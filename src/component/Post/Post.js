import {
    faComment,
    faEllipsis,
    faShare,
    faThumbsDown,
    faThumbsUp,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './Post.module.scss';
import { useState } from 'react';
import CommentBox from '~/component/CommentBox';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
import Image from '../Image';
import getTimeDiff from '~/utils/timeDiff';
import { arrayRemove, arrayUnion, doc, updateDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '~/firebase';
import { UserAuth } from '~/contexts/authContext';
import routes from '~/config/routes';
import type from '~/config/typeNotification';
import { isImageUrl, isVideoUrl } from '~/utils/checkFile';
import { useNavigate } from 'react-router-dom';
import Menu from '../Popper/Menu/Menu';
import { POST_OPTIONS, USER_POST_OPTIONS } from '~/utils/constantValue';

const cx = classNames.bind(styles);

function Post({ id, data }) {
    const [isCommentVisible, setIsCommentVisible] = useState(false);
    const context = useContext(ThemeContext);
    const { userData, user,deletePost } = UserAuth();
    const [focusPost, setFocusPost] = useState(false);
    const navigate = useNavigate();

    const handleClickLike = async () => {
        try {
            const dis = data.react === -1 ? data.dislike.count - 1 : data.dislike.count;
            await updateDoc(doc(db, 'posts', id), {
                like: {
                    count: data.like.count + 1,
                    list: arrayUnion({
                        id: user.uid,
                        name: userData.user_name,
                        ava: userData.user_avatar,
                    }),
                },
                dislike: {
                    count: dis,
                    list: arrayRemove({
                        id: user.uid,
                        name: userData.user_name,
                        ava: userData.user_avatar,
                    }),
                },
            });
            if (user.uid !== data.user.id) {
                const q = query(
                    collection(db, 'users', data.user.id, 'notifications'),
                    where('sender.id', '==', user.uid),
                    where('url', '==', routes.post + id),
                );
                getDocs(q).then(async (result) => {
                    if (result.docs.length === 0) {
                        await addDoc(collection(db, 'users', data.user.id, 'notifications'), {
                            title: type.like,
                            url: routes.post + id,
                            sender: {
                                id: user.uid,
                                name: userData.user_name,
                                avatar: userData.user_avatar,
                            },
                            type: 'like',
                            time: new Date(),
                            read: false,
                        });
                    } else {
                        await updateDoc(doc(db, 'users', data.user.id, 'notifications', result.docs[0].id), {
                            title: type.like,
                            type: 'like',
                            time: new Date(),
                            read: false,
                        });
                    }
                });
            }
        } catch (err) {
            console.log(err);
        }
    };
    const handlePostOptions = (item) => {
        switch (item.type) {
            case 'unfollow':
                break;
            case 'save':
                break;
            case 'delete':
                deletePost(id)
                break;
            default:
                break;
        }
    };
    const handleClickDislike = async () => {
        try {
            const lik = data.react === 1 ? data.like.count - 1 : data.like.count;
            console.log(lik);
            await updateDoc(doc(db, 'posts', id), {
                dislike: {
                    count: data.dislike.count + 1,
                    list: arrayUnion({
                        id: user.uid,
                        name: userData.user_name,
                        ava: userData.user_avatar,
                    }),
                },
                like: {
                    count: lik,
                    list: arrayRemove({
                        id: user.uid,
                        name: userData.user_name,
                        ava: userData.user_avatar,
                    }),
                },
            });
            if (user.uid !== data.user.id) {
                const q = query(
                    collection(db, 'users', data.user.id, 'notifications'),
                    where('sender.id', '==', user.uid),
                    where('url', '==', routes.post + id),
                );
                getDocs(q).then(async (result) => {
                    if (result.docs.length === 0) {
                        await addDoc(collection(db, 'users', data.user.id, 'notifications'), {
                            title: type.dislike,
                            url: routes.post + user.uid,
                            sender: {
                                id: user.uid,
                                name: userData.user_name,
                                avatar: userData.user_avatar,
                            },
                            type: 'dislike',
                            time: new Date(),
                            read: false,
                        });
                    } else {
                        await updateDoc(doc(db, 'users', data.user.id, 'notifications', result.docs[0].id), {
                            title: type.dislike,
                            type: 'dislike',
                            time: new Date(),
                            read: false,
                        });
                    }
                });
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
            {focusPost && (
                <div className={cx('pop-up')}>
                    <div className={cx('focus', { dark: context.theme === 'dark' })}>
                        <div className={cx('post')}>
                            <h3>{data.user.name.split(' ')[data.user.name.split(' ').length - 1]}'s Post</h3>
                            <FontAwesomeIcon
                                icon={faXmark}
                                className={cx('esc')}
                                onClick={() => {
                                    setIsCommentVisible(false);
                                    setFocusPost(false);
                                }}
                            />
                        </div>
                        <div className={cx('header')}>
                            <div className={cx('info')}>
                                <Image
                                    src={data.user.avatar}
                                    className={cx('avatar')}
                                    onClick={() => navigate(routes.user + data.user.id)}
                                    alt="avatar"
                                />
                                <div className={cx('title')}>
                                    <h5 className={cx('username')} onClick={() => navigate(routes.user + data.user.id)}>
                                        {data.user.name}
                                    </h5>
                                    <p className={cx('time')}>{getTimeDiff(Date.now(), data.time.toMillis())}</p>
                                </div>
                            </div>

                            <Menu
                                // chinh ben trai / chieu cao so vs ban dau
                                item={data.user.id === user.uid ? USER_POST_OPTIONS : POST_OPTIONS}
                                onClick={handlePostOptions}
                            >
                                <div className={cx('options')}>
                                    <FontAwesomeIcon icon={faEllipsis} className={cx('icon')} />
                                </div>
                            </Menu>
                        </div>

                        <p className={cx('content')}>{data.text} </p>
                        {data.files.others.length !== 0 && (
                            <div className={cx('file-show')}>
                                {data.files.others.map((f, id) => {
                                    return (
                                        <div className={cx('file-link')}>
                                            <a href={f.url} target="_blank" download={f.name}>
                                                {f.name}
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <div className={cx('image-holders')}>
                            {data.files.media.map((url, id) => {
                                let result = undefined;
                                if (isImageUrl(url)) {
                                    result = (
                                        // trao doi vi tri anh
                                        <div
                                            key={id}
                                            className={cx('image-box', { plenty: data.files.media.length > 2 })}
                                        >
                                            <Image
                                                src={url}
                                                alt="preview"
                                                className={cx('image', { plenty: data.files.media.length > 2 })}
                                            />
                                        </div>
                                    );
                                } else if (isVideoUrl(url)) {
                                    result = (
                                        <div
                                            key={id}
                                            className={cx('image-box', { plenty: data.files.media.length > 2 })}
                                        >
                                            <video
                                                controls
                                                className={cx('image', { plenty: data.files.media.length > 2 })}
                                            >
                                                <source src={url} />
                                            </video>
                                        </div>
                                    );
                                }
                                return result;
                            })}
                        </div>
                        <div className={cx('actions')}>
                            <div className={cx('default-action')}>
                                <div className={cx('like-action')}>
                                    <FontAwesomeIcon
                                        icon={faThumbsUp}
                                        className={cx('icon', { active: data.react === 1 })}
                                        onClick={() => {
                                            if (data.react !== 1) {
                                                handleClickLike();
                                            }
                                        }}
                                    />
                                    <p className={cx('nums')}>{data.like.count}</p>
                                </div>

                                <div className={cx('dislike-action')}>
                                    <FontAwesomeIcon
                                        icon={faThumbsDown}
                                        className={cx('icon', { active: data.react === -1 })}
                                        onClick={() => {
                                            if (data.react !== -1) {
                                                handleClickDislike();
                                            }
                                        }}
                                    />
                                    <p className={cx('nums')}>{data.dislike.count}</p>
                                </div>

                                <div className={cx('comment-action')}>
                                    <FontAwesomeIcon icon={faComment} className={cx('icon')} />
                                    <p className={cx('nums')}>{data.commentNumber}</p>
                                </div>
                            </div>

                            <div className={cx('share-action')}>
                                <FontAwesomeIcon icon={faShare} className={cx('icon')} />
                                <p>Share</p>
                            </div>
                        </div>

                        {isCommentVisible && <CommentBox />}
                    </div>
                </div>
            )}
            <div className={cx('header')}>
                <div className={cx('info')}>
                    <Image
                        src={data.user.avatar}
                        className={cx('avatar')}
                        onClick={() => navigate(routes.user + data.user.id)}
                        alt="avatar"
                    />
                    <div className={cx('title')}>
                        <h5 className={cx('username')} onClick={() => navigate(routes.user + data.user.id)}>
                            {data.user.name}
                        </h5>
                        <p className={cx('time')}>{getTimeDiff(Date.now(), data.time.toMillis())}</p>
                    </div>
                </div>

                <Menu
                    // chinh ben trai / chieu cao so vs ban dau
                    item={data.user.id === user.uid ? USER_POST_OPTIONS : POST_OPTIONS}
                    onClick={handlePostOptions}
                >
                    <div className={cx('options')}>
                        <FontAwesomeIcon icon={faEllipsis} className={cx('icon')} />
                    </div>
                </Menu>
            </div>

            <p className={cx('content')}>{data.text} </p>
            {data.files.others.length !== 0 && (
                <div className={cx('file-show')}>
                    {data.files.others.map((f, id) => {
                        return (
                            <div className={cx('file-link')}>
                                <a href={f.url} target="_blank" download={f.name}>
                                    {f.name}
                                </a>
                            </div>
                        );
                    })}
                </div>
            )}
            <div className={cx('image-holders')}>
                {data.files.media.map((url, id) => {
                    let result = undefined;
                    if (isImageUrl(url)) {
                        result = (
                            // trao doi vi tri anh
                            <div key={id} className={cx('image-box', { plenty: data.files.media.length > 2 })}>
                                <Image
                                    src={url}
                                    alt="preview"
                                    className={cx('image', { plenty: data.files.media.length > 2 })}
                                />
                            </div>
                        );
                    } else if (isVideoUrl(url)) {
                        result = (
                            <div key={id} className={cx('image-box', { plenty: data.files.media.length > 2 })}>
                                <video controls className={cx('image', { plenty: data.files.media.length > 2 })}>
                                    <source src={url} />
                                </video>
                            </div>
                        );
                    }
                    return result;
                })}
            </div>

            <div className={cx('actions')}>
                <div className={cx('default-action')}>
                    <div className={cx('like-action')}>
                        <FontAwesomeIcon
                            icon={faThumbsUp}
                            className={cx('icon', { active: data.react === 1 })}
                            onClick={() => {
                                if (data.react !== 1) {
                                    handleClickLike();
                                }
                            }}
                        />
                        <p className={cx('nums')}>{data.like.count}</p>
                    </div>

                    <div className={cx('dislike-action')}>
                        <FontAwesomeIcon
                            icon={faThumbsDown}
                            className={cx('icon', { active: data.react === -1 })}
                            onClick={() => {
                                if (data.react !== -1) {
                                    handleClickDislike();
                                }
                            }}
                        />
                        <p className={cx('nums')}>{data.dislike.count}</p>
                    </div>

                    <div className={cx('comment-action')}>
                        <FontAwesomeIcon
                            icon={faComment}
                            className={cx('icon')}
                            onClick={() => {
                                setIsCommentVisible(true);
                                setFocusPost(true);
                            }}
                        />
                        <p className={cx('nums')}>{data.commentNumber}</p>
                    </div>
                </div>

                <div className={cx('share-action')}>
                    <FontAwesomeIcon icon={faShare} className={cx('icon')} />
                    <p>Share</p>
                </div>
            </div>

            {isCommentVisible && <CommentBox />}
        </div>
    );
}

export default Post;
