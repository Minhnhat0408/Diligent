import { useState, useEffect, useContext, useRef } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCamera,
    faFaceSmile,
    faImage,
    faImages,
    faPen,
    faUserTag,
    faVideo,
    faVideoCamera,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/themes/light.css';
import 'tippy.js/dist/tippy.css';

import image from '~/assets/images';
import { ThemeContext } from '~/contexts/Context';

import styles from './CreatePost.module.scss';
import { UserAuth } from '~/contexts/authContext';
import Image from '../Image';
import Button from '../Button';
import { isImage } from '~/utils/validator';


const cx = classNames.bind(styles);

function CreatePost({ avatar }) {
    const [createBoxVisible, setCreateBoxVisible] = useState(false);
    const {userData} = UserAuth();
    const handleClickCreateBox = () => {
        setCreateBoxVisible(true);
    };

    const handleClickCloseBox = () => {
        setCreateBoxVisible(false);
        handleCategoryClick('Choose category');
    };

    

    // Xử lí logic để hiện preview ảnh khi ấn thêm ảnh
    const [imagePreview, setImagePreview] = useState([]);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(isImage(file)) {
            const img  = {file:file,url:URL.createObjectURL(file)};
            setImagePreview((prev) => [...prev,img])
        }
        
    };
    console.log(imagePreview,'fefe')
    const handleDeleteImage = (id) => {
        setImagePreview(prev => prev.filter((_, index) => index !== id));
    };

    //Xử lí khi chọn thể loại bài đăng
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    //Nếu người dùng chưa đăng nhập thì để avatar mặc định

    const context = useContext(ThemeContext)
    return (
        <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
            {/* Create Post Box  */}
            {createBoxVisible && (
                <div className={cx('pop-up')}>
                    <div className={cx('create-box',{dark:context.theme === 'dark'})} >
                        <div className={cx('header')}>
                            <div></div>
                            <h1 className={cx('title')}>Create post</h1>
                            <div className={cx('icon')} onClick={handleClickCloseBox}>
                                <FontAwesomeIcon icon={faXmark} />
                            </div>
                        </div>
    
                        <hr />
                        {console.log('rerender')}
                        <div className={cx('body',  { dark: context.theme === 'dark' })}>
                            <div className={cx('info')}>
                                <Image
                                    className={cx('avatar')}
                                    alt='ava'
                                    src={userData?.user_avatar}
                                />
                                <Tippy
                                placement="bottom"
                                trigger="click"
                                interactive={true}
                        
                                content={
                                    <div className={cx('categories')}>
                                        <div
                                            className={cx('category-item')}
                                            onClick={() => handleCategoryClick('Japanese')}
                                        >
                                            <p>Japanese</p>
                                        </div>
                                        <div
                                            className={cx('category-item')}
                                            onClick={() => handleCategoryClick('English')}
                                        >
                                            <p>English</p>
                                        </div>
                                        <div
                                            className={cx('category-item')}
                                            onClick={() => handleCategoryClick('Korean')}
                                        >
                                            <p>Korean</p>
                                        </div>
                                        <div
                                            className={cx('category-item')}
                                            onClick={() => handleCategoryClick('Chinese')}
                                        >
                                            <p>Chinese</p>
                                        </div>
                                        <div
                                            className={cx('category-item')}
                                            onClick={() => handleCategoryClick('French')}
                                        >
                                            <p>French</p>
                                        </div>
                                    </div>
                                }
                            >
                                <div>
                                    <h5 className={cx('username')}>{userData.user_name}</h5>
                                    <div className={cx('category')}>
                                        {selectedCategory ? (
                                            <p>{selectedCategory}</p>
                                        ) : (
                                            <>
                                                <p>Choose category</p>
                                            </>
                                        )}
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </div>
                                </div>
                            </Tippy>
                            </div>
                            <textarea placeholder="What's on your mind?" className={cx('input')} />
                            <div  className={cx('show-img')}>
                            {imagePreview.length !== 0  && 
                                (imagePreview.map((img,id) => {
                                    return (
                                        <div key={id} className={cx('show-img-content')}>
                                            <img src={img.url} alt="preview" className={cx('your-img')} />
                                            <FontAwesomeIcon icon={faXmark} className={cx('delete')} onClick={() => handleDeleteImage(id)} />
                                     </div>
                                    )
                                }))}
                            </div>
                            <div className={cx('options')}>
                                <h4 className={cx('title')}>Add to your post</h4>
                                <div className={cx('option')}>
                                    <label htmlFor="create-post-img">
                                        <FontAwesomeIcon icon={faImages} className={cx('img')} />
                                    </label>
                                    <input
                                        type="file"
                                        id="create-post-img"
                                        className={cx('d-none')}
                                        onChange={handleImageChange}
                                    />
    
                                    <FontAwesomeIcon icon={faVideo} className={cx('video')} />
                                    <FontAwesomeIcon icon={faUserTag} className={cx('user-tag')} />
                            
                             
                                </div>
                            </div>
                        </div>
    
                        <Button primary dark={context.theme === 'dark'} className={cx('upload')}>Upload</Button>
                    </div>
                </div>

            )}

            <div className={cx('header')}>
                <i className="fa-light fa-pen" ></i>
                <h5 className={cx('header-title')}>Create Post</h5>
            </div>

            <div className={cx('input')}>
                <Image className={cx('avatar')} src={userData?.user_avatar} alt='avatar' />
                <textarea placeholder="What's on your mind?" onClick={handleClickCreateBox}></textarea>
            </div>

            <div className={cx('options')}>
                <div className={cx('option')} onClick={handleClickCreateBox}>
                    <FontAwesomeIcon icon={faVideoCamera} className={cx('option-icon', 'video')} />
                    <h5 className={cx('option-title')}>Video</h5>
                </div>
                <div className={cx('option')} onClick={handleClickCreateBox}>
                    <FontAwesomeIcon icon={faImage} className={cx('option-icon', 'photo')} />
                    <h5 className={cx('option-title')}>Photo</h5>
                </div>
                <div className={cx('option')} onClick={handleClickCreateBox}>
                    <FontAwesomeIcon icon={faCamera} className={cx('option-icon', 'camera')} />
                    <h5 className={cx('option-title')}>Feeling/Activity</h5>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
