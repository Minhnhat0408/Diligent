import classNames from 'classnames/bind';
import styles from './CreatePost.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faImage, faPen, faVideoCamera } from '@fortawesome/free-solid-svg-icons';
import image from '~/assets/images';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';

const cx = classNames.bind(styles);

function CreatePost({avatar}) {
    const context = useContext(ThemeContext)
    if (avatar == undefined) {
        avatar = image.userUndefined
    }
    return (
        <div className={cx('wrapper',{dark: context.theme === 'dark'})}>
            <div className={cx('header')}>
                <i className="fa-light fa-pen" ></i>
                <h5 className={cx('header-title')}>Create Post</h5>
            </div>

            <div className={cx('input')}>
                <img
                    className={cx('avatar')}
                    src={avatar}
                    alt='avatar'
                />
                <textarea placeholder="What's on your mind?"></textarea>
            </div>

            <div className={cx('options')}>
                <div className={cx('option')}>
                    <FontAwesomeIcon icon={faVideoCamera} className={cx('option-icon', 'video')} />
                    <h5 className={cx('option-title')}>Live Video</h5>
                </div>
                <div className={cx('option')}>
                    <FontAwesomeIcon icon={faImage} className={cx('option-icon', 'photo')} />
                    <h5 className={cx('option-title')}>Photo/Video</h5>
                </div>
                <div className={cx('option')}>
                    <FontAwesomeIcon icon={faCamera} className={cx('option-icon', 'camera')} />
                    <h5 className={cx('option-title')}>Feeling/Activity</h5>
                </div>

                {/* <div className={cx('more-option')}>
                    <FontAwesomeIcon icon={faEllipsis} className={cx('icon')}/>
                </div> */}
            </div>
        </div>
    );
}

export default CreatePost;
