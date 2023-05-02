import classNames from 'classnames/bind';
import styles from './PostForm.module.scss';
import { useContext } from 'react';
import { PostContext, ThemeContext } from '~/contexts/Context';
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
import Image from '../Image/Image';
import Button from '../Button';
import Menu from '../Popper/Menu/Menu';
import Tippy from '@tippyjs/react';
import Mentions from '../Mentions/Mentions';
import type from '~/config/typeNotification';
import routes from '~/config/routes';
import { useState, useRef, useEffect } from 'react';
import { CATEGORY_OPTIONS, getIdInMentions, regex } from '~/utils/constantValue';
import { UserAuth } from '~/contexts/authContext';
import { isImage, isNotEmpty, isVideo } from '~/utils/validator';
import { RingLoader } from 'react-spinners';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '~/firebase';
import { isImageUrl } from '~/utils/checkFile';
import { isVideoUrl } from '~/utils/checkFile';
import Ban from '../Ban/Ban';
const cx = classNames.bind(styles);

function PostForm({ onXmark, update }) {
    const context = useContext(ThemeContext);
    const { userData, user, fileUpload ,createPost} = UserAuth();
    const [loading, setLoading] = useState(false);
    const handleClickCloseBox = () => {
        onXmark(false);
        setSelectedCategories([]);
    };

    // Xử lí logic để hiện preview ảnh khi ấn thêm ảnh
    const [imagePreview, setImagePreview] = useState(() => {
        return update ? update.data.files.media : [];
    });
    const handleImageChange = (e) => {
        const newfile = e.target.files[0];
        if (isImage(newfile) || isVideo(newfile)) {
            const img = { file: newfile, url: URL.createObjectURL(newfile) };
            setImagePreview((prev) => [...prev, img]);
        } else {
            alert('This is not an image');
        }
    };
    const [others, setOthersPreview] = useState(() => {
        return update ? update.data.files.others : [];
    });
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
    console.log(imagePreview);
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
    const [selectedCategories, setSelectedCategories] = useState(() => {
        return update ? update.data.tags : [];
    });

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
    const [textFinal, setTextFinal] = useState(() => {
        return update ? { title: update.data.title, text: update.data.text } : { title: '', text: '' };
    });
    const [invalid, setInvalid] = useState(false);
    const [text, setText] = useState(() => {
        return update ? update.data.text : '';
    });
    const [mentionData, setMentionData] = useState([]);
    useEffect(() => {
        if (userData) {
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
                    imagePreview
                        .filter((img) => img?.file)
                        .map((img) => fileUpload({ file: img.file, name: img.file.name })),
                );
                files.media = update
                    ? imagePreview.filter((img) => !img?.file).concat(results.map((obj) => obj.url))
                    : results.map((obj) => obj.url);
            }

            if (others.length !== 0) {
                const results = await Promise.all(
                    others
                        .filter((file) => file?.file)
                        .map((file) => fileUpload({ file: file.file, name: file.file.name, location: 'others' })),
                );
                files.others = update ? others.filter((file) => !file?.file).concat(results) : results;
            }

            if (!update) {
                await updateDoc(doc(db, 'users', user.uid), {
                    user_postNumber: userData.user_postNumber + 1,
                });
            }

            const tagUser = [];
            if (textFinal.text.match(regex)) {
                textFinal.text.match(regex).forEach((spc) => {
                    const id = spc.match(getIdInMentions)[0].substring(1);
                    if (!tagUser.includes(id)) {
                        tagUser.push(id);
                    }
                });
            }
            const refPost = createPost(files, textFinal.title, textFinal?.text, selectedCategories, tagUser, update);
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

            onXmark(false);
            setImagePreview([]);
            setOthersPreview([]);
            setLoading(false);
        } catch (error) {
            console.error('Upload failed!', error);
        }
    };
    return (
        <>
            {userData?.user_status === 'ban' ? (
                <Ban onXmark={onXmark}>You have been banned from posting because of your inappropriate behaviors</Ban>
            ) : (
                <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
                    <div className={cx('pop-up')}>
                        {loading && (
                            <div className="pop-up loader">
                                <RingLoader color="#367fd6" size={150} speedMultiplier={0.5} />
                            </div>
                        )}

                        <div className={cx('create-box', { dark: context.theme === 'dark' })}>
                            <div className={cx('header')}>
                                <div></div>
                                <h1 className={cx('title')}>{update ? 'Update Post' : 'Create post'}</h1>
                                <div className={cx('out')} onClick={handleClickCloseBox}>
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
                                    defaultValue={update ? update.data.title : ''}
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
                                            console.log(text);
                                            return { ...prev, text: text };
                                        })
                                    }
                                    placeholder="Describe your question..."
                                    dark={context.theme === 'dark'}
                                    onChange={(e) => setText(e.target.value)}
                                />
                                <div className={cx('file-show')}>
                                    {others.length !== 0 &&
                                        others.map((f, id) => {
                                            return (
                                                <div className={cx('file-link')}>
                                                    <a href={f.url} download={!f?.file ? f.name : f.file.name}>
                                                        {!f?.file ? f.name : f.file.name}
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
                                            let checkImage = false;
                                            let checkVideo = false;
                                            let url = '';
                                            if (!img?.file) {
                                                checkImage = isImageUrl(img);
                                                checkVideo = isVideoUrl(img);
                                                url = img;
                                            } else {
                                                checkImage = isImage(img.file);
                                                checkVideo = isVideo(img.file);
                                                url = img.url;
                                            }
                                            if (checkImage) {
                                                result = (
                                                    // trao doi vi tri anh
                                                    <div
                                                        key={id}
                                                        className={cx('show-img-content', {
                                                            plenty: imagePreview.length > 2,
                                                        })}
                                                    >
                                                        <img
                                                            src={url}
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
                                            } else if (checkVideo) {
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
                                                            <source src={url} />
                                                        </video>
                                                        <FontAwesomeIcon icon={faCirclePlay} className={cx('play')} />
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
                                            accept="image/*,video/*"
                                            className={cx('d-none')}
                                            onChange={handleImageChange}
                                        />
                                        <label htmlFor="create-post-file">
                                            <FontAwesomeIcon icon={faPaperclip} className={cx('attach')} />
                                        </label>
                                        <input
                                            type="file"
                                            id="create-post-file"
                                            accept=".pdf,.docx,.doc,.xls,.xlsx,.rar,.zip"
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
                                    imagePreview.length === 0 && others.length === 0 && !titleContent.current?.value
                                }
                                dark={context.theme === 'dark'}
                                onClick={handlePost}
                                className={cx('upload')}
                            >
                                Upload
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PostForm;
