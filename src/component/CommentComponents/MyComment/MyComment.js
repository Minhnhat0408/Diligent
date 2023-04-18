import classNames from 'classnames/bind';
import styles from './MyComment.module.scss';
import { faCamera, faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import { UserAuth } from '~/contexts/authContext';
import Image from '~/component/Image/Image';
import Mentions from '~/component/Mentions/Mentions';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
import { useEffect } from 'react';
const cx = classNames.bind(styles);

function MyComment({ tag = null, onClick,update = null }) {
    // Xử lí logic để hiện preview ảnh khi ấn thêm ảnh vào comment
    const [selectedFile, setSelectedFile] = useState(null);
    const { userData,user } = UserAuth();
    const [imagePreview, setImagePreview] = useState(update ? update.data.image : '');
    const [mentionData, setMentionData] = useState([]);
    const [text, setText] = useState(() => {
        if(tag && tag.id !== user.uid) {
            return `@${tag.name}(${tag.id})`
        }
        return update ? update.data.text : ''});
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
        setImagePreview(URL.createObjectURL(file))
    };

    const handleDeleteImage = () => {
        URL.revokeObjectURL(imagePreview);
        setSelectedFile(null);
        setImagePreview(null);
    };
    // const highlight = useRef();
    // const [boxMentions, setBoxMentions] = useState(false);
    // const [overallText,setOverallText] =useState('')
    // const [planText,setPlainText] = useState('');
    // const [textFormat,setTextFormat] = useState('')
    // const handleMentions = (e) => {
    //     if (e.key === '@' && (text[text.length - 1] === ' ' || text.length === 0)) {
    //         console.log('heheh');
    //         setBoxMentions(true);
    //         setOverallText(highlight.current.innerHTML)

    //     } else {
    //         highlight.current.innerHTML = overallText + `<span style="visibility: hidden;">${planText}</span>`;
    //         setPlainText((prev) => prev + e.key)
    //         setTextFormat((prev) => prev + e.key)
    //         if (boxMentions) {
    //             setBoxMentions(false);
    //         }
    //     }
    // };
    // const handlePickMentions = (e) => {
    //     const chosen = e.target.textContent;
    //     setText((prev) => prev + `@[${chosen}](${e.target.id})`)
    //     highlight.current.innerHTML = overallText +`<strong class="${styles.mentions__mention} ${styles.dark}" style="font-weight: inherit;">@${e.target.textContent}</strong>`
    //     setOverallText( highlight.current.innerHTML)
    //     setPlainText('')
    //     setBoxMentions(false)
    // }
    // const calWidth= () => {
    //     const width = ( 10*text.length) %637
    //     return width > 435 ? 435 : width;
    // }
    return (
        <div className={cx('wrapper')}>
            <div className={cx('my-comment', { reply: tag, dark: context.theme === 'dark' })}>
                <Image src={userData.user_avatar} className={cx('avatar')} alt="avatar" />
                <div className={cx('box-input')}>
                    <div className={cx('input')}>
                        <Mentions
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
                        <label htmlFor="upload">
                            <FontAwesomeIcon icon={faCamera} className={cx('upload-icon')}  />
                        </label>
                        <input
                            type="file"
                            id="upload"
                            className={cx('d-none')}
                            onChange={handleImageChange}
                        />
                        <FontAwesomeIcon icon={faPaperPlane} className={cx('upload-icon')} onClick={() => {
                            setText('');
                            setSelectedFile(null);
                            setImagePreview(null)
                            return onClick({text:text,image:selectedFile,cmtId:update?.id,postId:update?.postId,father:tag?.father})}} />
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
