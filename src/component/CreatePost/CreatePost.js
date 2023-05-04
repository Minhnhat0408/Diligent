import { useState, useEffect, useContext, useRef } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faArrowRight,
    faCirclePlay,
    faImages,
    faPaperclip,
    faUserTag,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import 'tippy.js/themes/light.css';
import 'tippy.js/dist/tippy.css';
import { ThemeContext } from '~/contexts/Context';
import styles from './CreatePost.module.scss';
import { UserAuth } from '~/contexts/authContext';
import Image from '../Image';
import Button from '../Button';
import { isImage, isNotEmpty, isVideo } from '~/utils/validator';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '~/firebase';
import { RingLoader } from 'react-spinners';
import Menu from '../Popper/Menu/Menu';
import { CATEGORY_OPTIONS, getIdInMentions, regex } from '~/utils/constantValue';
import Tippy from '@tippyjs/react';
import Mentions from '../Mentions/Mentions';
import type from '~/config/typeNotification';
import routes from '~/config/routes';

const cx = classNames.bind(styles);

function CreatePost() {
    const [createBoxVisible, setCreateBoxVisible] = useState(false);
    const { userData, fileUpload, createPost, user } = UserAuth();
    const [loading, setLoading] = useState(false);
    const handleClickCreateBox = () => {
        setCreateBoxVisible(true);
    };

    //Xử lí khi đóng create box
    const handleClickCloseBox = () => {
        setCreateBoxVisible(false);
        setSelectedCategories([]);
    };

    // Xử lí logic để hiện preview ảnh khi ấn thêm ảnh
    const [imagePreview, setImagePreview] = useState([]);
    const handleImageChange = (e) => {
        const newfile = e.target.files[0];
        if (isImage(newfile) || isVideo(newfile)) {
            const img = { file: newfile, url: URL.createObjectURL(newfile) };
            setImagePreview((prev) => [...prev, img]);
        } else {
            alert('This is not an image');
        }
    };
    const [others, setOthersPreview] = useState([]);
    const handleFileChange = (e) => {
        const newfile = e.target.files[0];
        if (!isImage(newfile) && !isVideo(newfile)) {
            const img = { file: newfile, url: URL.createObjectURL(newfile) };
            setOthersPreview((prev) => [...prev, img]);
        } else {
            alert('This is not a file');
        }
    };
    const handleDeleteOthers = (id) => {
        setOthersPreview((prev) => prev.filter((_, index) => index !== id));
    };
    const handleDeleteImage = (id) => {
        setImagePreview((prev) => prev.filter((_, index) => index !== id));
    };

    const moveLeft = (index) => {
        // Make sure the index is not out of range
        if (index > 0 && index < imagePreview.length) {
            // Switch the positions of the two elements
            const newImages = [...imagePreview];
            const temp = newImages[index];
            newImages[index] = newImages[index - 1];
            newImages[index - 1] = temp;
            // Update the state with the new array
            setImagePreview(newImages);
        }
    };

    const moveRight = (index) => {
        // Make sure the index is not out of range
        if (index >= 0 && index < imagePreview.length - 1) {
            // Switch the positions of the two elements
            const newImages = [...imagePreview];
            const temp = newImages[index];
            newImages[index] = newImages[index + 1];
            newImages[index + 1] = temp;

            // Update the state with the new array
            setImagePreview(newImages);
        }
    };

    //Xử lí khi chọn thể loại bài đăng
    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleAddCategory = (value) => {
        console.log('fsdafs');
        if (!selectedCategories.includes(value.title)) {
            setSelectedCategories([...selectedCategories, value.title]);
        } else {
            return;
        }
    };

    const handleDeleteCategory = (value) => {
        setSelectedCategories(selectedCategories.filter((category) => category !== value));
    };

    //handle post
    const titleContent = useRef();
    const [textFinal, setTextFinal] = useState();
    const [invalid, setInvalid] = useState(false);
    const context = useContext(ThemeContext);
    const [text, setText] = useState('');
    const [mentionData, setMentionData] = useState([]);
    useEffect(() => {
        if(userData) {
            setMentionData(
                userData.user_friends.map((u) => {
                    return { display: u.name, id: u.id };
                }),
            );
            }
      

    }, [userData]);
    const handlePost = async () => {
        if (!isNotEmpty(titleContent.current.value)) {
            titleContent.current.placeholder = 'Question title is required';
            setInvalid(true);
            return;
        }
        setLoading(true);
        try {
            let files = { media: [], others: [] };
            if (imagePreview.length !== 0) {
                const results = await Promise.all(
                    imagePreview.map((img) => fileUpload({ file: img.file, name: img.file.name })),
                );
                files.media = results.map((obj) => obj.url);
            }
            
            if (others.length !== 0) {
                const results = await Promise.all(
                    others.map((file) => fileUpload({ file: file.file, name: file.file.name, location: 'others' })),
                );
                files.others = results;
            }

            await updateDoc(doc(db, 'users', user.uid), {
                user_postNumber: userData.user_postNumber + 1,
            });
           

            const tagUser = [];
            if (textFinal.text.match(regex)) {
                textFinal.text.match(regex).forEach((spc) => {
                    const id = spc.match(getIdInMentions)[0].substring(1);
                    if (!tagUser.includes(id)) {
                        tagUser.push(id);
                    }
                });
            }
            const refPost = createPost(files, textFinal.title, textFinal?.text, selectedCategories, tagUser);
            if (tagUser.length !== 0) {
                refPost.then(async (res) => {
                    await Promise.all(
                        tagUser.map((id) => {
                            return addDoc(collection(db, 'users', id, 'notifications'), {
                                title: type.mention,
                                url: routes.post + res.id,
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
                });
            }

            setCreateBoxVisible(false);
            setImagePreview([]);
            setOthersPreview([]);
            setLoading(false);
        } catch (error) {
            console.error('Upload failed!', error);
        }
    };
    return (
        <>
            {userData ? (
                <>
                    <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
                        {/* Create Post Box  */}
                        {createBoxVisible && (
                            <div className={cx('pop-up')}>
                                <div className={cx('create-box', { dark: context.theme === 'dark' })}>
                                    <div className={cx('header')}>
                                        <div></div>
                                        <h1 className={cx('title')}>Create post</h1>
                                        <div className={cx('icon')} onClick={handleClickCloseBox}>
                                            <FontAwesomeIcon icon={faXmark} />
                                        </div>
                                    </div>

                                    <hr />

                                    <div className={cx('body', { dark: context.theme === 'dark' })}>
                                        <div className={cx('info')}>
                                            <Image className={cx('avatar')} alt="ava" src={userData?.user_avatar} />
                                            <Menu
                                                offset={[0, 30]}
                                                // chinh ben trai / chieu cao so vs ban dau
                                                placement="right"
                                                item={CATEGORY_OPTIONS}
                                                small
                                                onClick={handleAddCategory}
                                            >
                                                <div>
                                                    <h5 className={cx('username')}>{userData.user_name}</h5>
                                                    <div className={cx('category')}>
                                                        <p>Choose category</p>
                                                        <i className="fa-solid fa-chevron-right"></i>
                                                    </div>
                                                </div>
                                            </Menu>
                                        </div>
                                        <textarea
                                            placeholder="What have been questioning you ?"
                                            ref={titleContent}
                                            onFocus={() => {
                                                setInvalid(false);
                                            }}
                                            onBlur={() => {
                                                setTextFinal((prev) => {
                                                    return { ...prev, title: titleContent.current.value };
                                                });
                                            }}
                                            className={cx('input', 'inp-title', { invalid: invalid })}
                                        />
                                        <Mentions
                                            data={mentionData}
                                            value={text}
                                            onBlur={(e) =>
                                                setTextFinal((prev) => {
                                                    console.log(text)
                                                    return { ...prev, text: text };
                                                })
                                            }
                                            placeholder='Describe your question...'
                                            dark={context.theme === 'dark'}
                                            onChange={(e) => setText(e.target.value)}
                                        />
                                        <div className={cx('file-show')}>
                                            {others.length !== 0 &&
                                                others.map((f, id) => {
                                                    return (
                                                        <div className={cx('file-link')}>
                                                            <a href={f.url} download={f.file.name}>
                                                                {f.file.name}
                                                            </a>
                                                            <FontAwesomeIcon
                                                                icon={faXmark}
                                                                className={cx('delete-file')}
                                                                onClick={() => handleDeleteOthers(id)}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                        <div className={cx('show-img')}>
                                            {imagePreview.length !== 0 &&
                                                imagePreview.map((img, id) => {
                                                    let result = undefined;
                                                    if (isImage(img.file)) {
                                                        result = (
                                                            // trao doi vi tri anh
                                                            <div
                                                                key={id}
                                                                className={cx('show-img-content', {
                                                                    plenty: imagePreview.length > 2,
                                                                })}
                                                            >
                                                                <img
                                                                    src={img.url}
                                                                    alt="preview"
                                                                    style={{}}
                                                                    className={cx('your-img', {
                                                                        plenty: imagePreview.length > 2,
                                                                    })}
                                                                />
                                                                <FontAwesomeIcon
                                                                    icon={faXmark}
                                                                    className={cx('delete')}
                                                                    onClick={() => handleDeleteImage(id)}
                                                                />
                                                                {imagePreview.length > 1 && (
                                                                    <>
                                                                        <FontAwesomeIcon
                                                                            icon={faArrowLeft}
                                                                            className={cx('left')}
                                                                            onClick={() => moveLeft(id)}
                                                                        />
                                                                        <FontAwesomeIcon
                                                                            icon={faArrowRight}
                                                                            className={cx('right')}
                                                                            onClick={() => moveRight(id)}
                                                                        />
                                                                    </>
                                                                )}
                                                            </div>
                                                        );
                                                    } else if (isVideo(img.file)) {
                                                        result = (
                                                            <div
                                                                key={id}
                                                                className={cx('show-img-content', {
                                                                    plenty: imagePreview.length > 2,
                                                                })}
                                                            >
                                                                <video
                                                                    className={cx('your-img', {
                                                                        plenty: imagePreview.length > 2,
                                                                    })}
                                                                >
                                                                    <source src={img.url} />
                                                                </video>
                                                                <FontAwesomeIcon
                                                                    icon={faCirclePlay}
                                                                    className={cx('play')}
                                                                />
                                                                <FontAwesomeIcon
                                                                    icon={faXmark}
                                                                    className={cx('delete')}
                                                                    onClick={() => handleDeleteImage(id)}
                                                                />
                                                                {imagePreview.length > 1 && (
                                                                    <>
                                                                        <FontAwesomeIcon
                                                                            icon={faArrowLeft}
                                                                            className={cx('left')}
                                                                            onClick={() => moveLeft(id)}
                                                                        />
                                                                        <FontAwesomeIcon
                                                                            icon={faArrowRight}
                                                                            className={cx('right')}
                                                                            onClick={() => moveRight(id)}
                                                                        />
                                                                    </>
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                    return result;
                                                })}
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
                                                <label htmlFor="create-post-file">
                                                    <FontAwesomeIcon icon={faPaperclip} className={cx('attach')} />
                                                </label>
                                                <input
                                                    type="file"
                                                    id="create-post-file"
                                                    className={cx('d-none')}
                                                    onChange={handleFileChange}
                                                />
                                                <Tippy
                                                    placement="right"
                                                    trigger="click"
                                                    interactive
                                                    offset={[0, 20]}
                                                    arrow={false}
                                                    content={
                                                        <div className={cx('tag-box')}>
                                                            <span className={cx('tag-name')}>Use '@' to mention</span>
                                                        </div>
                                                    }
                                                >
                                                    <div>
                                                        <FontAwesomeIcon icon={faUserTag} className={cx('user-tag')} />
                                                    </div>
                                                </Tippy>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        primary
                                        disabled={
                                            imagePreview.length === 0 &&
                                            others.length === 0 &&
                                            !titleContent.current?.value
                                        }
                                        dark={context.theme === 'dark'}
                                        onClick={handlePost}
                                        className={cx('upload')}
                                    >
                                        Upload
                                    </Button>
                                </div>
                            </div>
                        )}

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
                    {loading && (
                        <div className="pop-up loader">
                            <RingLoader color="#367fd6" size={150} speedMultiplier={0.5} />
                        </div>
                    )}
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
