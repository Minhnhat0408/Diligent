import classNames from 'classnames/bind';
import styles from './MyComment.module.scss';
import { faCamera, faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import { UserAuth } from '~/contexts/authContext';
import Image from '~/component/Image/Image';
import Mentions from '~/component/Mentions/Mentions';
import { useContext } from 'react';
import { PostContext, ThemeContext } from '~/contexts/Context';
import { useEffect } from 'react';
import type from '~/config/typeNotification';
import routes from '~/config/routes';
import { getIdInMentions, regex } from '~/utils/constantValue';
import { db } from '~/firebase';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import Ban from '~/component/Ban/Ban';
const cx = classNames.bind(styles);

function MyComment({ tag = null, update = null }) {
    // Xử lí logic để hiện preview ảnh khi ấn thêm ảnh vào comment
    const [selectedFile, setSelectedFile] = useState(null);
    const { userData, user, fileUpload } = UserAuth();
    const [imagePreview, setImagePreview] = useState(update ? update.data.image : '');
    const [mentionData, setMentionData] = useState([]);
    const post = useContext(PostContext);
    const [ban, setBan] = useState(false);
    const [text, setText] = useState(() => {
        if (tag && tag.id !== user.uid) {
            return `@${tag.name}(${tag.id}) `;
        }
        return update ? update.data.text : '';
    });
    const context = useContext(ThemeContext);

    useEffect(() => {
        if (userData) {
            setMentionData(
                userData.user_friends.map((u) => {
                    return { display: u.name, id: u.id };
                }),
            );
        }
    }, [userData]);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleDeleteImage = () => {
        URL.revokeObjectURL(imagePreview);
        setSelectedFile(null);
        setImagePreview(null);
    };

    const handleUpdate = async (inpData) => {
        let image = null;
        post.setLoading(true);
        if (inpData.image) {
            image = await fileUpload({ file: inpData.image, name: inpData.image.name });
            await updateDoc(doc(db, 'posts', post.id, 'comments', inpData.cmtId), {
                text: inpData.text,
                image: image?.url,
                time: serverTimestamp(),
                isEdited: true,
            });
        } else {
            await updateDoc(doc(db, 'posts', post.id, 'comments', inpData.cmtId), {
                text: inpData.text,
                time: serverTimestamp(),
                isEdited: true,
            });
        }

        const tagUser = [];
        if (inpData.text.match(regex)) {
            inpData.text.match(regex).forEach((spc) => {
                const user_id = spc.match(getIdInMentions)[0].substring(1);
                if (!tagUser.includes(user_id)) {
                    tagUser.push(user_id);
                }
            });
        }
        if (tagUser.length !== 0) {
            await Promise.all(
                tagUser.map((user_id) => {
                    return addDoc(collection(db, 'users', user_id, 'notifications'), {
                        title: type.menCmt,
                        url: routes.post + post.id,
                        sender: {
                            id: user.uid,
                            name: userData.user_name,
                            avatar: userData.user_avatar,
                        },
                        type: 'mention',
                        time: serverTimestamp(),
                        read: false,
                    });
                }),
            );
        }
        post.setUpdate((prev) => prev + 1);
        post.setLoading(false);
    };
    const handleSubmit = async (inpData) => {
        let image = null;
        post.setLoading(true);
        if (inpData.image) {
            image = await fileUpload({ file: inpData.image, name: inpData.image.name });
        }

        await addDoc(collection(db, 'posts', post.id, 'comments'), {
            fatherCmt: inpData?.father || '',
            text: inpData.text,
            image: image?.url || '',
            time: serverTimestamp(),
            isEdited: false,
            user: {
                name: userData.user_name,
                id: user.uid,
                avatar: userData.user_avatar,
            },
            like: {
                count: 0,
                list: [],
            },
        });
        await updateDoc(doc(db, 'posts', post.id), {
            commentNumber: post.data.commentNumber + 1,
        });
        if (post.data.user.id !== user.uid) {
            await addDoc(collection(db, 'users', post.data.user.id, 'notifications'), {
                title: type.comment,
                url: routes.post + post.id,
                sender: {
                    id: user.uid,
                    name: userData.user_name,
                    avatar: userData.user_avatar,
                },
                type: 'comment',
                time: new Date(),
                read: false,
            });
        }

        const tagUser = [];
        if (inpData.text.match(regex)) {
            inpData.text.match(regex).forEach((spc) => {
                const user_id = spc.match(getIdInMentions)[0].substring(1);
                if (!tagUser.includes(user_id)) {
                    tagUser.push(user_id);
                }
            });
        }
        if (tagUser.length !== 0) {
            await Promise.all(
                tagUser.map((user_id) => {
                    return addDoc(collection(db, 'users', user_id, 'notifications'), {
                        title: type.menCmt,
                        url: routes.post + post.id,
                        sender: {
                            id: user.uid,
                            name: userData.user_name,
                            avatar: userData.user_avatar,
                        },
                        type: 'mention',
                        time: serverTimestamp(),
                        read: false,
                    });
                }),
            );
        }
        post.setLoading(false);
    };
    return (
        <div className={cx('wrapper')}>
            {
                ban && <Ban onXmark={setBan}>You have been banned from commenting because of your inappropriate behaviours</Ban>
            }
            <div
                className={cx('my-comment', { reply: tag, dark: context.theme === 'dark' })}
                onClick={() => {
                    if (userData.user_status === 'ban') {
                        setBan(true);
                    }
                }}
            >
                <Image src={userData.user_avatar} className={cx('avatar')} alt="avatar" />
                <div className={cx('box-input')}>
                    <div className={cx('input')}>
                        <Mentions
                            disabled={ban}
                            data={mentionData}
                            value={text}
                            placeholder={!tag ? 'Write your comment...' : 'Reply '}
                            cmt={!tag}
                            reply={!!tag}
                            dark={context.theme === 'dark'}
                            onChange={(e) => {
                                setText(e.target.value);
                            }}
                        />
                        <label htmlFor={!ban && 'upload'}>
                            <FontAwesomeIcon icon={faCamera} className={cx('upload-icon')} />
                        </label>
                        <input type="file" id="upload" className={cx('d-none')} onChange={handleImageChange} />
                        <FontAwesomeIcon
                            icon={faPaperPlane}
                            className={cx('upload-icon')}
                            onClick={() => {
                                setText('');
                                setSelectedFile(null);
                                setImagePreview(null);
                                if(text !== '' && userData.user_status !== 'ban') {
                                    if (update) {
                                        handleUpdate({
                                            text: text,
                                            image: selectedFile,
                                            cmtId: update?.id,
                                        });
                                    } else {
                                        handleSubmit({
                                            text: text,
                                            image: selectedFile,
                                            father: tag?.father,
                                        });
                                    }
                                }
                              
                            }}
                        />
                    </div>
                    {imagePreview && (
                        <div className={cx('add-img')}>
                            <img src={imagePreview} alt="preview" className={cx('your-img')} />
                            <FontAwesomeIcon icon={faXmark} className={cx('delete')} onClick={handleDeleteImage} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyComment;
