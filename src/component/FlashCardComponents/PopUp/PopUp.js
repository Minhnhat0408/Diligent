import { useContext, useEffect, useRef, useState } from 'react';
import { ThemeContext } from '~/contexts/Context';
import classNames from 'classnames/bind'
import styles from './PopUp.module.scss'
import { RingLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from '~/component/Image/Image';
import Button from '~/component/Button/Button';
import {
    faCircle,
    faCircleXmark,
    faK,
    faMagnifyingGlass,
    faPlusCircle,
    faSpinner,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(styles)

function PopUp({setPopup, }) {
    const context = useContext(ThemeContext);
    return (
        <>
        <div className={cx('pop-up')}>
                    {/* {loading && (
                        <div className="pop-up loader">
                            <RingLoader color="#367fd6" size={150} speedMultiplier={0.5} />
                        </div>
                    )} */}

                    <div className={cx('create-box', { dark: context.theme === 'dark' })}>
                        <div className={cx('header')}>
                            <div></div>
                            <h1 className={cx('title')}>Add Card</h1>
                            <div className={cx('out')} onClick={() => setPopup(false)}>
                                <FontAwesomeIcon icon={faXmark} />
                            </div>
                        </div>

                        <hr />
                
                        <div className={cx('body', { dark: context.theme === 'dark' })}>
                            <div className={cx('user-info')}>
                                {/* <Image className={cx('avatar')} alt="ava" src={userData?.user_avatar} /> */}

                                {/* <h5 className={cx('username')}>{userData.user_name}</h5> */}
                            </div>
                            <textarea
                                placeholder="What have been questioning you ?"
                                // ref={title}
                                // onFocus={() => {
                                //     setInvalid(false);
                                // }}
                                // onBlur={() => {
                                //     setTextFinal((prev) => {
                                //         return { ...prev, title: titleContent.current.value };
                                //     });
                                // }}
                                className={cx('input', 'inp-title')}
                            />
                            <textarea
                                placeholder="What have been questioning you ?"
                                // ref={title}
                                // onFocus={() => {
                                //     setInvalid(false);
                                // }}
                                // onBlur={() => {
                                //     setTextFinal((prev) => {
                                //         return { ...prev, title: titleContent.current.value };
                                //     });
                                // }}
                                className={cx('input', 'inp-title')}
                            />
                        </div>

                        <Button
                            primary
                            // disabled={
                            //     imagePreview.length === 0 && others.length === 0 && !titleContent.current?.value
                            // }
                            dark={context.theme === 'dark'}
                            // onClick={handlePost}
                            className={cx('upload')}
                        >
                            Upload
                        </Button>
                    </div>
                </div>
        </>
    )
}

export default PopUp;
