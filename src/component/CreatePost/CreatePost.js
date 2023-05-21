import { useState, useContext } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faPaperclip, faUserTag } from '@fortawesome/free-solid-svg-icons';
import 'tippy.js/themes/light.css';
import 'tippy.js/dist/tippy.css';
import { ThemeContext } from '~/contexts/Context';
import styles from './CreatePost.module.scss';
import { UserAuth } from '~/contexts/authContext';
import Image from '../Image';

import { RingLoader } from 'react-spinners';
import PostForm from '../PostForm/PostForm';

const cx = classNames.bind(styles);

function CreatePost({ show, setShow }) {
    const { userData } = UserAuth();

    const context = useContext(ThemeContext);
    const handleClickCreateBox = () => {
        setShow(true);
    };

    //Xử lí khi đóng create box

    return (
        <>
            {userData ? (
                <>
                    {show && <PostForm onXmark={setShow} />}
                    <div
                        className={
                            cx('wrapper', { dark: context.theme === 'dark' }) +
                            ' sml-max:!min-w-[100%] sml-max:!max-w-[100%] mdx-max:max-w-full'
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
                <div className="pop-up loader">
                    <RingLoader color="#367fd6" size={150} speedMultiplier={0.5} />
                </div>
            )}
        </>
    );
}

export default CreatePost;
