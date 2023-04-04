import { useState, useEffect, useContext, useRef } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCamera,
    faFaceSmile,
    faImage,
    faImages,
    faL,
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
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '~/firebase';


const cx = classNames.bind(styles);

function CreatePost() {
    const [createBoxVisible, setCreateBoxVisible] = useState(false);
    const {userData,fileUpload,createPost,user} = UserAuth();
    const handleClickCreateBox = () => {
        setCreateBoxVisible(true);
    };

    //Xử lí khi đóng create box
    const handleClickCloseBox = () => {
        setCreateBoxVisible(false);
        setSelectedCategories([])
    };

    const createBoxRef = useRef(null);

    useEffect(() => {
        // add event listener to detect clicks outside of the create-box component
        const handleClickOutside = (event) => {
            if (createBoxRef.current && !createBoxRef.current.contains(event.target)) {
                setCreateBoxVisible(false);
                handleDeleteImage();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        // cleanup event listener when component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleAddCategory = (value) => {
        if (selectedCategories.length < 5 && !selectedCategories.includes(value)) {
            setSelectedCategories([...selectedCategories, value]);
        } else {
            return;
        }
    };

    const handleDeleteCategory = (value) => {
        setSelectedCategories(selectedCategories.filter((category) => category !== value));
    };

    console.log(selectedCategories);

    //handle post 
    const textContent = useRef();
    
    const handlePost = async () => {
        console.log(textContent.current.value,imagePreview)
        try {
   
            console.log('promist')
            if(imagePreview) {
                const results = await Promise.all(imagePreview.map((img)  =>  fileUpload(img.file,img.file.name)));
                console.log('Upload completed!', results);
                createPost(results
                    ,textContent.current.value)
            }else{
                createPost(null
                    ,textContent.current.value)
            }
       
            await updateDoc(doc(db,'users',user.uid),{
                user_postNumber:userData.user_postNumber+1
            })
            setCreateBoxVisible(false)
            setImagePreview([])
          } catch (error) {
            console.error('Upload failed!', error);
          }
    }


    const context = useContext(ThemeContext);
    return (
        <div className={cx('wrapper', { dark: context.theme === 'dark' })}> 
            {/* Create Post Box  */}
            {createBoxVisible && (
                <div className={cx('pop-up')}>
                    <div
                        className={cx('create-box',{dark:context.theme === 'dark'})}
                        style={{
                            height:
                                (imagePreview && selectedCategories.length > 0 && '658px') ||
                                (imagePreview && selectedCategories.length == 0 && '628px') ||
                                (selectedCategories.length > 0 && '458px'),
                        }}
                    >
                        <div className={cx('header')}>
                            <div></div>
                            <h1 className={cx('title')}>Create post</h1>
                            <div className={cx('icon')} onClick={handleClickCloseBox}>
                                <FontAwesomeIcon icon={faXmark} />
                            </div>
                        </div>

                        <hr />
    
                        <div className={cx('body' ,  { dark: context.theme === 'dark' })}>
                            <div className={cx('info')}>
                                <Image
                                    className={cx('avatar')}
                                    alt='ava'
                                    src={userData?.user_avatar}
                                />
                                <Image className={cx('avatar')} alt="ava" src={userData.user_avatar} />
                                <Tippy
                                placement="bottom"
                                trigger="click"
                                interactive={true}
                                content={
                                    <div className={cx('categories')}>
                                        <div
                                            className={cx('category-item')}
                                            onClick={() => handleAddCategory('Japanese')}
                                        >
                                            <p>Japanese</p>
                                        </div>
                                        <div
                                            className={cx('category-item')}
                                            onClick={() => handleAddCategory('English')}
                                        >
                                            <p>English</p>
                                        </div>
                                        <div
                                            className={cx('category-item')}
                                            onClick={() => handleAddCategory('Korean')}
                                        >
                                            <p>Korean</p>
                                        </div>
                                        <div
                                            className={cx('category-item')}
                                            onClick={() => handleAddCategory('Chinese')}
                                        >
                                            <p>Chinese</p>
                                        </div>
                                        <div
                                            className={cx('category-item')}
                                            onClick={() => handleAddCategory('French')}
                                        >
                                            <p>French</p>
                                        </div>
                                    </div>
                                }
                            >
                                <div>
                                    <h5 className={cx('username')}>{userData.user_name}</h5>
                                    <div className={cx('category')}>
                                        <p>Choose category</p>
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </div>
                                </div>
                            </Tippy>
                            </div>
                            <textarea placeholder="What's on your mind?" ref={textContent} className={cx('input')} />
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

                            <ul className={cx('selected-category')}>
                                {selectedCategories.map((category, index) => (
                                    <li key={index} onClick={() => handleDeleteCategory(category)}>
                                        <p>{category}</p>
                                        <FontAwesomeIcon icon={faXmark} />
                                    </li>
                                ))}
                            </ul>

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
    
                        <Button primary dark={context.theme === 'dark'} onClick={handlePost} className={cx('upload')}>Upload</Button>
                    </div>
                </div>
            )}

            <div className={cx('header')}>
                <i className="fa-light fa-pen"></i>
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
