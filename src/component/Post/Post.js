import { faComment, faEllipsis, faThumbsDown, faThumbsUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './Post.module.scss';
import { useEffect, useRef, useState } from 'react';
import CommentBox from '~/component/CommentComponents/CommentBox';
import { useContext } from 'react';
import { PostContext, ThemeContext } from '~/contexts/Context';
import Image from '../Image';
import getTimeDiff from '~/utils/timeDiff';
import {
    arrayRemove,
    arrayUnion,
    doc,
    updateDoc,
    addDoc,
    collection,
    query,
    where,
    getDocs,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '~/firebase';
import { UserAuth } from '~/contexts/authContext';
import routes from '~/config/routes';
import type from '~/config/typeNotification';
import { isImageUrl, isVideoUrl } from '~/utils/checkFile';
import { useNavigate } from 'react-router-dom';
import Menu from '../Popper/Menu/Menu';
import { POST_OPTIONS, USER_POST_OPTIONS, getIdInMentions, regex } from '~/utils/constantValue';
import parse from 'html-react-parser';
import { MyComment } from '../CommentComponents/MyComment';

const cx = classNames.bind(styles);

function Post({ page = false }) {
    const [isCommentVisible, setIsCommentVisible] = useState(false);
    const context = useContext(ThemeContext);
    const { userData, user, deletePost, savePost, posts, hidePost } = UserAuth();
    const [focusPost, setFocusPost] = useState(false);
    const navigate = useNavigate();
    const post = useContext(PostContext);
    const [text, setText] = useState('');
    const userLink = (id) => {
        navigate(routes.user + id);
    };

    useEffect(() => {
        setText(
            post.data.text.replace(regex, (spc) => {
                const id = spc.match(getIdInMentions)[0].substring(1);
                const name = spc.substring(0, spc.indexOf('('));
                return `<strong id="mentions" data='${id}' name="${name}" >${name}</strong>`;
            }),
        );
    }, [posts]);
    const replace = (domNode) => {
        if (domNode.attribs && domNode.attribs.id === 'mentions') {
            return (
                <strong
                    onClick={() => userLink(domNode.attribs.data)}
                    className={cx('mention', { dark: context.theme === 'dark' })}
                >
                    {domNode.attribs.name}
                </strong>
            );
        }
    };
    const handleClickLike = async () => {
        try {
            let lik = 0;
            let dis = 0;
            if (post.data.react === 1) {
                lik = post.data.like.count - 1;
                dis = post.data.dislike.count;
                await updateDoc(doc(db, 'posts', post.id), {
                    like: {
                        count: lik,
                        list: arrayRemove({
                            id: user.uid,
                            name: userData.user_name,
                            ava: userData.user_avatar,
                        }),
                    },
                });
            } else if (post.data.react === -1) {
                lik = post.data.like.count + 1;
                dis = post.data.dislike.count - 1;
                await updateDoc(doc(db, 'posts', post.id), {
                    like: {
                        count: lik,
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
            } else {
                lik = post.data.like.count + 1;
                dis = post.data.dislike.count;
                await updateDoc(doc(db, 'posts', post.id), {
                    like: {
                        count: lik,
                        list: arrayUnion({
                            id: user.uid,
                            name: userData.user_name,
                            ava: userData.user_avatar,
                        }),
                    },
                });
            }

            if (post.data.react === -1) {
                if (user.uid !== post.data.user.id) {
                    const q = query(
                        collection(db, 'users', post.data.user.id, 'notifications'),
                        where('sender.id', '==', user.uid),
                        where('url', '==', routes.post + post.id),
                        where('type', '==', 'dislike'),
                    );
                    getDocs(q).then(async (result) => {
                        if (result.docs.length === 0) {
                            await addDoc(collection(db, 'users', post.data.user.id, 'notifications'), {
                                title: type.like,
                                url: routes.post + post.id,
                                sender: {
                                    id: user.uid,
                                    name: userData.user_name,
                                    avatar: userData.user_avatar,
                                },
                                type: 'like',
                                time: serverTimestamp(),
                                read: false,
                            });
                        } else {
                            await updateDoc(doc(db, 'users', post.data.user.id, 'notifications', result.docs[0].id), {
                                title: type.like,
                                type: 'like',
                                time: serverTimestamp(),
                                read: false,
                            });
                        }
                    });
                }
            }
        } catch (err) {
            console.log(err);
        }
    };
    console.log(post);
    const handlePostOptions = (item) => {
        switch (item.type) {
            case 'hide':
                hidePost(post.id);
                break;
            case 'save':
                savePost(post.id, post.data);
                break;
            case 'delete':
                deletePost(post.id);
                break;
            default:
                break;
        }
    };
    const handleClickDislike = async () => {
        try {
            let lik = 0;
            let dis = 0;
            if (post.data.react === 1) {
                lik = post.data.like.count - 1;
                dis = post.data.dislike.count + 1;
                await updateDoc(doc(db, 'posts', post.id), {
                    dislike: {
                        count: dis,
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
            } else if (post.data.react === -1) {
                lik = post.data.like.count;
                dis = post.data.dislike.count - 1;
                await updateDoc(doc(db, 'posts', post.id), {
                    dislike: {
                        count: dis,
                        list: arrayRemove({
                            id: user.uid,
                            name: userData.user_name,
                            ava: userData.user_avatar,
                        }),
                    },
                });
            } else {
                lik = post.data.like.count;
                dis = post.data.dislike.count + 1;
                await updateDoc(doc(db, 'posts', post.id), {
                    dislike: {
                        count: dis,
                        list: arrayUnion({
                            id: user.uid,
                            name: userData.user_name,
                            ava: userData.user_avatar,
                        }),
                    },
                });
            }
            if (post.data.react === 1) {
                if (user.uid !== post.data.user.id) {
                    const q = query(
                        collection(db, 'users', post.data.user.id, 'notifications'),
                        where('sender.id', '==', user.uid),
                        where('url', '==', routes.post + post.id),
                        where('type', '==', 'like'),
                    );
                    getDocs(q).then(async (result) => {
                        if (result.docs.length === 0) {
                            await addDoc(collection(db, 'users', post.data.user.id, 'notifications'), {
                                title: type.dislike,
                                url: routes.post + user.uid,
                                sender: {
                                    id: user.uid,
                                    name: userData.user_name,
                                    avatar: userData.user_avatar,
                                },
                                type: 'dislike',
                                time: serverTimestamp(),
                                read: false,
                            });
                        } else {
                            await updateDoc(doc(db, 'users', post.data.user.id, 'notifications', result.docs[0].id), {
                                title: type.dislike,
                                type: 'dislike',
                                time: serverTimestamp(),
                                read: false,
                            });
                        }
                    });
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            {page ? (
                <div className={cx('wrapper','postpage', { dark: context.theme === 'dark' })}>
                    <div className={cx('scroll-box')}>
                        <div className={cx('post-wrapper')}>
                            <div className={cx('header')}>
                                <div className={cx('info')}>
                                    <Image
                                        src={post.data.user.avatar}
                                        className={cx('avatar')}
                                        onClick={() => navigate(routes.user + post.data.user.id)}
                                        alt="avatar"
                                    />
                                    <div className={cx('user')}>
                                        <h5
                                            className={cx('username')}
                                            onClick={() => navigate(routes.user + post.data.user.id)}
                                        >
                                            {post.data.user.name}
                                        </h5>
                                        <p className={cx('time')}>
                                            {getTimeDiff(Date.now(), post.data.time.toMillis())}
                                        </p>
                                    </div>
                                </div>

                                {user && (
                                    <Menu
                                        // chinh ben trai / chieu cao so vs ban dau
                                        item={post.data.user.id === user.uid ? USER_POST_OPTIONS : POST_OPTIONS}
                                        onClick={handlePostOptions}
                                        small
                                    >
                                        <div className={cx('options')}>
                                            <FontAwesomeIcon icon={faEllipsis} className={cx('icon')} />
                                        </div>
                                    </Menu>
                                )}
                            </div>

                            <div className={cx('title-wrapper')}>
                                <h4 className={cx('title')}>{post.data.title}</h4>
                                <ul className={cx('selected-category')}>
                                    {post.data.tags.map((tag, index) => {
                                        return <li key={index}>{tag}</li>;
                                    })}
                                </ul>
                            </div>
                            <div className={cx('content')}>{parse(text, { replace })}</div>
                            {post.data.files.others.length !== 0 && (
                                <div className={cx('file-show')}>
                                    {post.data.files.others.map((f, id) => {
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
                            <div className={cx('actions')}>
                                <div className={cx('default-action')}>
                                    <div className={cx('like-action')}>
                                        <FontAwesomeIcon
                                            icon={faThumbsUp}
                                            className={cx('icon', { active: post.data.react === 1 })}
                                            onClick={() => {
                                                handleClickLike();
                                            }}
                                        />
                                        <p className={cx('nums')}>{post.data.like.count}</p>
                                    </div>

                                    <div className={cx('dislike-action')}>
                                        <FontAwesomeIcon
                                            icon={faThumbsDown}
                                            className={cx('icon', { active: post.data.react === -1 })}
                                            onClick={() => {
                                                handleClickDislike();
                                            }}
                                        />
                                        <p className={cx('nums')}>{post.data.dislike.count}</p>
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
                                        <p className={cx('nums')}>{post.data.commentNumber}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <CommentBox />
                    </div>
                    {user && (
                        <div className={cx('input-section')}>
                            <MyComment />
                        </div>
                    )}
                </div>
            ) : (
                <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
                    {focusPost && (
                        <div className={cx('pop-up')}>
                            <div className={cx('focus', { dark: context.theme === 'dark' })}>
                                <div className={cx('post')}>
                                    <h3>
                                        {post.data.user.name.split(' ')[post.data.user.name.split(' ').length - 1]}
                                        's Post
                                    </h3>
                                    <FontAwesomeIcon
                                        icon={faXmark}
                                        className={cx('esc')}
                                        onClick={() => {
                                            setIsCommentVisible(false);
                                            setFocusPost(false);
                                        }}
                                    />
                                </div>

                                <div className={cx('scroll-box')}>
                                    <div className={cx('post-wrapper')}>
                                        <div className={cx('header')}>
                                            <div className={cx('info')}>
                                                <Image
                                                    src={post.data.user.avatar}
                                                    className={cx('avatar')}
                                                    onClick={() => navigate(routes.user + post.data.user.id)}
                                                    alt="avatar"
                                                />
                                                <div className={cx('user')}>
                                                    <h5
                                                        className={cx('username')}
                                                        onClick={() => navigate(routes.user + post.data.user.id)}
                                                    >
                                                        {post.data.user.name}
                                                    </h5>
                                                    <p className={cx('time')}>
                                                        {getTimeDiff(Date.now(), post.data.time.toMillis())}
                                                    </p>
                                                </div>
                                            </div>

                                            {user && (
                                                <Menu
                                                    // chinh ben trai / chieu cao so vs ban dau
                                                    item={
                                                        post.data.user.id === user.uid
                                                            ? USER_POST_OPTIONS
                                                            : POST_OPTIONS
                                                    }
                                                    onClick={handlePostOptions}
                                                    small
                                                >
                                                    <div className={cx('options')}>
                                                        <FontAwesomeIcon icon={faEllipsis} className={cx('icon')} />
                                                    </div>
                                                </Menu>
                                            )}
                                        </div>
                                        <div className={cx('title-wrapper')}>
                                            <h4 className={cx('title')}>{post.data.title}</h4>
                                            <ul className={cx('selected-category')}>
                                                {post.data.tags.map((tag, index) => {
                                                    return <li key={index}>{tag}</li>;
                                                })}
                                            </ul>
                                        </div>
                                        <div className={cx('content')}>{parse(text, { replace })}</div>
                                        {post.data.files.others.length !== 0 && (
                                            <div className={cx('file-show')}>
                                                {post.data.files.others.map((f, id) => {
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
                                            {post.data.files.media.map((url, id) => {
                                                if (id < 3) {
                                                    let result = undefined;

                                                    if (isImageUrl(url)) {
                                                        result = (
                                                            // trao doi vi tri anh
                                                            <div
                                                                key={id}
                                                                onClick={() =>
                                                                    navigate(routes.post + post.id + '/' + id)
                                                                }
                                                                className={cx('image-box', {
                                                                    plenty: post.data.files.media.length > 2,
                                                                })}
                                                            >
                                                                <Image
                                                                    src={url}
                                                                    alt="preview"
                                                                    className={cx('image', {
                                                                        plenty: post.data.files.media.length > 2,
                                                                    })}
                                                                />
                                                                {post.data.files.media.length > 3 && id === 2 && (
                                                                    <div className={cx('more')}>
                                                                        +{post.data.files.media.length - 2}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    } else if (isVideoUrl(url)) {
                                                        result = (
                                                            <div
                                                                key={id}
                                                                onClick={() =>
                                                                    navigate(routes.post + post.id + '/' + id)
                                                                }
                                                                className={cx('image-box', {
                                                                    plenty: post.data.files.media.length > 2,
                                                                })}
                                                            >
                                                                <video
                                                                    controls
                                                                    className={cx('image', {
                                                                        plenty: post.data.files.media.length > 2,
                                                                    })}
                                                                >
                                                                    <source src={url} />
                                                                </video>
                                                            </div>
                                                        );
                                                    }
                                                    return result;
                                                }
                                                return <></>;
                                            })}
                                        </div>
                                        <div className={cx('actions')}>
                                            <div className={cx('default-action')}>
                                                <div className={cx('like-action')}>
                                                    <FontAwesomeIcon
                                                        icon={faThumbsUp}
                                                        className={cx('icon', { active: post.data.react === 1 })}
                                                        onClick={() => {
                                                            handleClickLike();
                                                        }}
                                                    />
                                                    <p className={cx('nums')}>{post.data.like.count}</p>
                                                </div>

                                                <div className={cx('dislike-action')}>
                                                    <FontAwesomeIcon
                                                        icon={faThumbsDown}
                                                        className={cx('icon', { active: post.data.react === -1 })}
                                                        onClick={() => {
                                                            handleClickDislike();
                                                        }}
                                                    />
                                                    <p className={cx('nums')}>{post.data.dislike.count}</p>
                                                </div>

                                                <div className={cx('comment-action')}>
                                                    <FontAwesomeIcon icon={faComment} className={cx('icon')} />
                                                    <p className={cx('nums')}>{post.data.commentNumber}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {isCommentVisible && <CommentBox />}
                                </div>
                                {user && (
                                    <div className={cx('input-section')}>
                                        <MyComment />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div className={cx('header')}>
                        <div className={cx('info')}>
                            <Image
                                src={post.data.user.avatar}
                                className={cx('avatar')}
                                onClick={() => navigate(routes.user + post.data.user.id)}
                                alt="avatar"
                            />
                            <div className={cx('user')}>
                                <h5
                                    className={cx('username')}
                                    onClick={() => navigate(routes.user + post.data.user.id)}
                                >
                                    {post.data.user.name}
                                </h5>
                                <p className={cx('time')}>{getTimeDiff(Date.now(), post.data.time.toMillis())}</p>
                            </div>
                        </div>

                        {user && (
                            <Menu
                                // chinh ben trai / chieu cao so vs ban dau
                                item={post.data.user.id === user.uid ? USER_POST_OPTIONS : POST_OPTIONS}
                                onClick={handlePostOptions}
                                small
                            >
                                <div className={cx('options')}>
                                    <FontAwesomeIcon icon={faEllipsis} className={cx('icon')} />
                                </div>
                            </Menu>
                        )}
                    </div>

                    <div className={cx('title-wrapper')}>
                        <h4 className={cx('title')}>{post.data.title}</h4>
                        <ul className={cx('selected-category')}>
                            {post.data.tags.map((tag, index) => {
                                return <li key={index}>{tag}</li>;
                            })}
                        </ul>
                    </div>
                    <div className={cx('content')}>{parse(text, { replace })}</div>
                    {post.data.files.others.length !== 0 && (
                        <div className={cx('file-show')}>
                            {post.data.files.others.map((f, id) => {
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
                        {post.data.files.media.map((url, id) => {
                            if (id < 3) {
                                let result = undefined;

                                if (isImageUrl(url)) {
                                    result = (
                                        // trao doi vi tri anh
                                        <div
                                            key={id}
                                            onClick={() => navigate(routes.post + post.id + '/' + id)}
                                            className={cx('image-box', { plenty: post.data.files.media.length > 2 })}
                                        >
                                            <Image
                                                src={url}
                                                alt="preview"
                                                className={cx('image', { plenty: post.data.files.media.length > 2 })}
                                            />
                                            {post.data.files.media.length > 3 && id === 2 && (
                                                <div className={cx('more')}>+{post.data.files.media.length - 2}</div>
                                            )}
                                        </div>
                                    );
                                } else if (isVideoUrl(url)) {
                                    result = (
                                        <div
                                            key={id}
                                            onClick={() => navigate(routes.post + post.id + '/' + id)}
                                            className={cx('image-box', { plenty: post.data.files.media.length > 2 })}
                                        >
                                            <video
                                                controls
                                                className={cx('image', { plenty: post.data.files.media.length > 2 })}
                                            >
                                                <source src={url} />
                                            </video>
                                        </div>
                                    );
                                }
                                return result;
                            }
                            return <></>;
                        })}
                    </div>

                    <div className={cx('actions')}>
                        <div className={cx('default-action')}>
                            <div className={cx('like-action')}>
                                <FontAwesomeIcon
                                    icon={faThumbsUp}
                                    className={cx('icon', { active: post.data.react === 1 })}
                                    onClick={() => {
                                        handleClickLike();
                                    }}
                                />
                                <p className={cx('nums')}>{post.data.like.count}</p>
                            </div>

                            <div className={cx('dislike-action')}>
                                <FontAwesomeIcon
                                    icon={faThumbsDown}
                                    className={cx('icon', { active: post.data.react === -1 })}
                                    onClick={() => {
                                        handleClickDislike();
                                    }}
                                />
                                <p className={cx('nums')}>{post.data.dislike.count}</p>
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
                                <p className={cx('nums')}>{post.data.commentNumber}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Post;
