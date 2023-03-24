import classNames from 'classnames/bind';
import styles from './ReplyComment.module.scss';
import { memo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function ReplyComment({ avatar, username, commentId }) {
    // Xử lí logic để hiện preview ảnh khi ấn thêm ảnh vào comment
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [counter, setCounter] = useState(0);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setCounter((prevCounter) => prevCounter + 1);
        };
        reader.readAsDataURL(file);
    };

    const handleDeleteImage = () => {
        URL.revokeObjectURL(imagePreview);
        setSelectedFile(null);
        setImagePreview(null);
        setCounter((prevCounter) => prevCounter + 1);
    };

    const [comment, setComment] = useState('');

    const handleChangeComment = (event) => {
        setComment(event.target.value);
    };

    const handlePostReply = () => {
        // Xử lý đăng bình luận
    };

    return (
        <div className={cx('wrapper')}>
            <img
                src="https://scontent.fhan5-9.fna.fbcdn.net/v/t39.30808-1/277751572_1315302068964376_895612620486881878_n.jpg?stp=dst-jpg_p100x100&_nc_cat=109&ccb=1-7&_nc_sid=7206a8&_nc_ohc=y6DgmDpQOo4AX_5dLAS&_nc_oc=AQmUBH4fWQYChiEt-Q8p-YbMmNFVnHE-bS3BNLHH4eA557wPleTncZFkK0_zQfCkt0A&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.fhan5-9.fna&oh=00_AfACNGCK4LgQWwYDYAKqbgfTkRrjb_LH5MmmHGw4QRWxtg&oe=641EFB00"
                className={cx('avatar')}
                alt="avatar"
            />
            <div className={cx('user-info')}>
                <div className={cx('comment')}>
                    <div className={cx('title')}>
                        Replying
                        <h5 className={cx('username')}>{username}</h5>
                    </div>

                    <div className={cx('input')}>
                        <textarea
                            type="text"
                            placeholder="Write your comment"
                            value={comment}
                            onChange={handleChangeComment}
                        />
                        {/* id của input là upload-(id của comment) ví dụ bên dưới là id = 1*/}
                        <label for="upload-1">
                            <FontAwesomeIcon icon={faCamera} className={cx('upload-icon')} />
                        </label>
                        <input
                            type="file"
                            id="upload-1"
                            className={cx('d-none')}
                            onChange={handleImageChange}
                            key={counter}
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

export default memo(ReplyComment);
