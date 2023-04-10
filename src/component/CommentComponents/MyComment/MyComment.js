import classNames from 'classnames/bind';
import styles from './MyComment.module.scss';
import { faCamera, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

const cx = classNames.bind(styles);

function MyComment() {
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

    return (
        <div className={cx('wrapper')}>
            <div className={cx('my-comment')}>
                <img
                    src="https://scontent.fhan15-2.fna.fbcdn.net/v/t39.30808-6/318961918_3317632705152230_4867945811344342607_n.jpg?stp=cp6_dst-jpg&_nc_cat=103&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=LTax3aa44p0AX_o4DQj&_nc_ht=scontent.fhan15-2.fna&oh=00_AfAIK9umaEtYOTkeqBLtPbfHnvGXv1SnKCVwlgwgIGIWqw&oe=641E1201"
                    className={cx('avatar')}
                    alt='avatar'
                />
                <div className={cx('input')}>
                    <textarea placeholder="Write your comment..."></textarea>
                    <label htmlFor="upload">
                        <FontAwesomeIcon icon={faCamera} className={cx('upload-icon')} />
                    </label>
                    <input type="file" id="upload" className={cx('d-none')} onChange={handleImageChange} key={counter} />
                </div>
            </div>
            {imagePreview && (
                <div className={cx('add-img')}>
                    <img src={imagePreview} alt="preview" className={cx('your-img')} />
                    <FontAwesomeIcon icon={faXmark} className={cx('delete')} onClick={handleDeleteImage} />
                </div>
            )}
        </div>
    );
}

export default MyComment;
