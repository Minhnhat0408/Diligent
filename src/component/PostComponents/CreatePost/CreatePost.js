import { useState, useContext } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faPaperclip, faUserTag } from '@fortawesome/free-solid-svg-icons';
import 'tippy.js/themes/light.css';
import 'tippy.js/dist/tippy.css';
import { ThemeContext } from '~/contexts/Context';
import styles from './CreatePost.module.scss';
import { UserAuth } from '~/contexts/authContext';
import Image from '../../Image';
import PostForm from '../PostForm/PostForm';
import PostLoading from '../PostLoading/PostLoading';

const cx = classNames.bind(styles);

function CreatePost({ setReFresh, setLoading }) {
    const { userData } = UserAuth();
    const [showForm, setShowForm] = useState(false);
    const context = useContext(ThemeContext);
    const handleClickCreateBox = () => {
        setShowForm(true);
    };

    //Xử lí khi đóng create box
    return (
        <>
            {userData ? (
                <>
                    {(showForm) && (
                        <PostForm
                            onXmark={setShowForm}
                            setReFresh={setReFresh}
                            setLoading={setLoading}
                        />
                    )}
                    <div
                        className={
                            cx('wrapper', { dark: context.theme === 'dark' }) +
                            ' sml-max:!w-full mdx-max:max-w-full smu-max:!min-w-full'
                        }
                    >
                        {/* Create Post Box  */}

                        <div className={cx('header')}>
                            <i className="fa-light fa-pen"></i>
                            <h5 className={cx('header-title')}>Create Post</h5>
                        </div>

                        <div className={cx('input-outside')}>
                            <Image className={cx('avatar')} src={userData?.user_avatar} alt="avatar" />
                            <textarea placeholder="What's on your mind?" onClick={handleClickCreateBox}></textarea>
                        </div>

                        <div className={cx('options')}>
                            <div className={cx('option')} onClick={handleClickCreateBox}>
                                <FontAwesomeIcon icon={faImages} className={cx('option-icon', 'photo')} />
                                <h5 className={cx('option-title')}>Media</h5>
                            </div>
                            <div className={cx('option')} onClick={handleClickCreateBox}>
                                <FontAwesomeIcon icon={faPaperclip} className={cx('option-icon', 'attach')} />
                                <h5 className={cx('option-title')}>File</h5>
                            </div>
                            <div className={cx('option')} onClick={handleClickCreateBox}>
                                <FontAwesomeIcon icon={faUserTag} className={cx('option-icon', 'user-tag')} />
                                <h5 className={cx('option-title')}>Tag</h5>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <PostLoading />
            )}
        </>
    );
}

export default CreatePost;
