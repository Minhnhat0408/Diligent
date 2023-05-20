import classNames from 'classnames/bind';
import styles from './ChatInput.module.scss';
import TextareaAutosize from 'react-textarea-autosize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFile,
    faPaperPlane,
    faPhotoFilm,
    faPhotoVideo,
    faThumbsUp,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import Button from '../Button/Button';
import { useState } from 'react';
import { isImage, isVideo } from '~/utils/validator';
import Image from '../Image/Image';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '~/firebase';
import { useRef } from 'react';
import { UserAuth } from '~/contexts/authContext';
import { RingLoader } from 'react-spinners';
import { ThemeContext } from '~/contexts/Context';
import { useContext } from 'react';
const cx = classNames.bind(styles);

function ChatInput({ roomId }) {
    const [filePreview, setFilePreview] = useState({ others: [], media: [] });
    const [text, setText] = useState('');
    const { user, fileUpload } = UserAuth();
    const [loading, setLoading] = useState();
    const context = useContext(ThemeContext);
    const handleFileChange = (e) => {
        const newfile = e.target.files[0];
        if (isImage(newfile) || isVideo(newfile)) {
            const media = [...filePreview.media, { file: newfile, url: URL.createObjectURL(newfile) }];
            setFilePreview({ others: filePreview.others, media: media });
        } else {
            const others = [...filePreview.others, { file: newfile, url: URL.createObjectURL(newfile) }];
            setFilePreview({ others: others, media: filePreview.media });
        }
    };
    const handleDeleteFile = (type, index) => {
        setFilePreview((prevState) => ({
            ...prevState,
            [type]: prevState[type].filter((_, i) => i !== index),
        }));
    };
    const handleSendMessage = async (icon = undefined) => {
        if (icon) {
            console.log(icon);
            setLoading(true);
            await addDoc(collection(db, 'chats', roomId, 'messages'), {
                sender: user.uid,
                time: serverTimestamp(),
                content: icon,
                seen: false,
            });
        }
        if (!!text.trim()) {
            console.log(text);
            setLoading(true);
            await addDoc(collection(db, 'chats', roomId, 'messages'), {
                sender: user.uid,
                time: serverTimestamp(),
                content: text,
                seen: false,
            });
        }
        if (filePreview.others.length !== 0 || filePreview.media.length !== 0) {
            setLoading(true);

            if (filePreview.others.length !== 0) {
                let files = { media: [], others: [] };
                const others = await Promise.all(
                    filePreview.others.map((o) => fileUpload({ file: o.file, name: o.file.name })),
                );
                files.others = others;
                await addDoc(collection(db, 'chats', roomId, 'messages'), {
                    sender: user.uid,
                    time: serverTimestamp(),
                    content: files,
                    seen: false,
                });
            }
            if (filePreview.media.length !== 0) {
                let files = { media: [], others: [] };
                const media = await Promise.all(
                    filePreview.media.map((m) => fileUpload({ file: m.file, name: m.file.name })),
                );
                files.media = media;
                await addDoc(collection(db, 'chats', roomId, 'messages'), {
                    sender: user.uid,
                    time: serverTimestamp(),
                    content: files,
                    seen: false,
                });
            }
        }
        setText('');
        setFilePreview({ others: [], media: [] });
        setLoading(false);
    };
    return (
        <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
            <div className={cx('section')}>
                {(filePreview.others.length !== 0 || filePreview.media.length !== 0) && (
                    <div className={cx('preview')}>
                        {filePreview.media.map((data, ind) => {
                            return (
                                <div key={ind} className={cx('media')}>
                                    <Image src={data.url} alt="preview" className={cx('content')} />
                                    <FontAwesomeIcon
                                        icon={faXmark}
                                        onClick={() => handleDeleteFile('media', ind)}
                                        className={cx('delete')}
                                    />
                                </div>
                            );
                        })}
                        {filePreview.others.map((data, ind) => {
                            return (
                                <div key={ind} className={cx('others')}>
                                    <div className={cx('content')}>
                                        <FontAwesomeIcon icon={faFile} className={cx('file-icon')} />
                                        <a href={data.url} className={cx('file-name')}>
                                            {data.file.name}
                                        </a>
                                    </div>
                                    <FontAwesomeIcon
                                        icon={faXmark}
                                        onClick={() => handleDeleteFile('others', ind)}
                                        className={cx('delete')}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
                <div className={cx('input-section')}>
                    <TextareaAutosize
                        value={text}
                        minRows={1}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        wrap="off"
                        onChange={(e) => setText(e.target.value)}
                        maxRows={4}
                        placeholder="Start typing now"
                        className={cx('user-input')}
                    />
                    <label htmlFor="file" className={cx('options')}>
                        <FontAwesomeIcon icon={faPhotoVideo} />
                    </label>
                    <input
                        type="file"
                        id="file"
                        accept="image/*,video/*,.pdf,.docx,.doc,.txt,.xls,.xlsx,.rar,.zip,.pptx,.csv"
                        className={cx('d-none')}
                        onChange={handleFileChange}
                    />
                    <div className={cx('options')}>
                        <FontAwesomeIcon
                            icon={faThumbsUp}
                            onClick={() => {
                                handleSendMessage(`:)`);
                            }}
                        />
                    </div>
                </div>
            </div>
            <Button submit="submit" className={cx('send')} onClick={() => handleSendMessage()}>
                <FontAwesomeIcon icon={faPaperPlane} />
            </Button>
        </div>
    );
}

export default ChatInput;
