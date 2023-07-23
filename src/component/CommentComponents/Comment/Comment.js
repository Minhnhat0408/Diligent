import classNames from 'classnames/bind';
import { useState } from 'react';
import styles from './Comment.module.scss';
import { MyComment } from '../MyComment';
import Image from '~/component/Image/Image';
import parse from 'html-react-parser';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '~/config/routes';
import getTimeDiff from '~/utils/timeDiff';
import { UserAuth } from '~/contexts/authContext';
import { useContext } from 'react';
import { PostContext, ThemeContext } from '~/contexts/Context';
import { getIdInMentions, regex, report } from '~/utils/constantValue';
import Menu from '~/component/Popper/Menu/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faEllipsis, faFilePen, faStar, faThumbsUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
    deleteDoc,
    doc,
    updateDoc,
    addDoc,
    collection,
    query,
    where,
    getDocs,
    arrayUnion,
    arrayRemove,
    onSnapshot,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '~/firebase';
import type from '~/config/typeNotification';
import { memo } from 'react';
import { extractFilePathFromURL } from '~/utils/extractPath';

const cx = classNames.bind(styles);
function Comment({ data, id, react }) {
    const [like, setLike] = useState(react === 1);
    const [isReply, setIsReply] = useState(false);
    const [preview, setPreview] = useState(false);
    const {fileDelete} = UserAuth()
    const [text, setText] = useState(
        data.text.replace(regex, (spc) => {
            const id = spc.match(getIdInMentions)[0].substring(1);
            const name = spc.substring(0, spc.indexOf('('));
            return `<strong id="mentions" data='${id}' name="${name}" >${name}</strong>`;
        }),
    );
    const { user, userData } = UserAuth();
    const navigate = useNavigate();
    const context = useContext(ThemeContext);
    const [update, setUpdate] = useState(false);
    const [subComments, setSubComments] = useState([]);
    const post = useContext(PostContext);
    useEffect(() => {
        const q = query(collection(db, 'posts', post.id, 'comments'), where('fatherCmt', '==', id));
        const unsubscribe = onSnapshot(q, (docs) => {
            const tmp = [];
            docs.forEach((doc) => {
                if (
                    doc.data().like.list.some((u) => {
                        return u.id === user.uid;
                    })
                ) {
                    tmp.push({ id: doc.id, data: doc.data(), react: 1 });
                } else {
                    tmp.push({ id: doc.id, data: doc.data(), react: 0 });
                }
            });
            setSubComments(tmp);
        });

        return () => unsubscribe();
    }, []);
    useEffect(() => {
        setText(
            data.text.replace(regex, (spc) => {
                const id = spc.match(getIdInMentions)[0].substring(1);
                const name = spc.substring(0, spc.indexOf('('));
                return `<strong id="mentions" data='${id}' name="${name}" >${name}</strong>`;
            }),
        );
        setUpdate(false);
    }, [post.update]);
    const handleClickLike = async () => {
        try {
            const lik = data.like.list.some((u) => {
                return u.id === user.uid;
            });
            setLike((prev) => !prev);
            if (lik) {
                await updateDoc(doc(db, 'posts', post.id, 'comments', id), {
                    like: {
                        count: data.like.count - 1,
                        list: arrayRemove({
                            id: user.uid,
                            name: userData.user_name,
                            ava: userData.user_avatar,
                        }),
                    },
                });
            } else {
                await updateDoc(doc(db, 'posts', post.id, 'comments', id), {
                    like: {
                        count: data.like.count + 1,
                        list: arrayUnion({
                            id: user.uid,
                            name: userData.user_name,
                            ava: userData.user_avatar,
                        }),
                    },
                });
            }

            if (user.uid !== data.user.id) {
                const q = query(
                    collection(db, 'users', data.user.id, 'notifications'),
                    where('sender.id', '==', user.uid),
                    where('url', '==', routes.post + id),
                    where('type', '==', 'likecmt'),
                );
                getDocs(q).then(async (result) => {
                    if (result.docs.length === 0) {
                        await addDoc(collection(db, 'users', data.user.id, 'notifications'), {
                            title: type.likecmt,
                            url: routes.post + id,
                            sender: {
                                id: user.uid,
                                name: userData.user_name,
                                avatar: userData.user_avatar,
                            },
                            type: 'likecmt',
                            time: new Date(),
                            read: false,
                        });
                    } else {
                        await deleteDoc(doc(db, 'users', data.user.id, 'notifications', result.docs[0].id));
                    }
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleClickReply = () => {
        setIsReply(!isReply);
    };
    const userLink = (id) => {
        navigate(routes.user + id);
    };

    const replace = (domNode) => {
        if (domNode.attribs && domNode.attribs.id === 'mentions') {
            return (
                <strong onClick={() => userLink(domNode.attribs.data)} className={cx('mention')}>
                    {domNode.attribs.name}
                </strong>
            );
        }
    };

    const handleCommentOptions = async (item) => {
        if (item.type === 'update') {
            setUpdate(true);
        } else if (item.type === 'delete') {
            await deleteDoc(doc(db, 'posts', post.id, 'comments', id));
            subComments.forEach(async (cmt) => {
                await deleteDoc(doc(db, 'posts', post.id, 'comments', cmt.id));
            });
            if(data.image) {
                fileDelete(extractFilePathFromURL(data.image))
            }
            await updateDoc(doc(db, 'posts', post.id), {
                commentNumber: post.data.commentNumber - 1 - subComments.length,
            });
        } else if (item.type === 'correct') {
            await updateDoc(doc(db, 'posts', post.id, 'comments', id), {
                isCorrect: true,
            });
            if (data.user.id !== user.uid) {
                const q = query(
                    collection(db, 'users', data.user.id, 'notifications'),
                    where('sender.id', '==', user.uid),
                    where('type', '==', 'correct'),
                );
                getDocs(q).then(async (result) => {
                    if (result.docs.length === 0) {
                        await addDoc(collection(db, 'users', data.user.id, 'notifications'), {
                            title: type.correct,
                            url: routes.post + post.id,
                            sender: {
                                id: user.uid,
                                name: userData.user_name,
                                avatar: userData.user_avatar,
                            },
                            type: 'correct',
                            time: serverTimestamp(),
                            read: false,
                        });
                    } else {
                        await updateDoc(doc(db, 'users', data.user.id, 'notifications', result.docs[0].id), {
                            time: serverTimestamp(),
                            read: false,
                        });
                    }
                });
            }
        } else if (item.type === 'incorrect') {
            await updateDoc(doc(db, 'posts', post.id, 'comments', id), {
                isCorrect: false,
            });
        }
    };

    return (
        <div className={cx('wrapper', { dark: context.theme === 'dark', page: post.page })}>
            {!update ? (
                <>
                    <div className={cx('ava-like')}>
                        <Image
                            src={data.user.avatar}
                            onClick={() => {
                                navigate(routes.user + data.user.id);
                            }}
                            className={cx('avatar')}
                            alt="ava"
                        />
                        {data.like.count > 0 && (
                            <div className={cx('like-count')}>
                                <span>{data.like.count}</span>
                                <FontAwesomeIcon className={cx('like-icon')} icon={faThumbsUp} />
                            </div>
                        )}
                    </div>
                    <div className={cx('comment')}>
                        <h5
                            className={cx('username')}
                            onClick={() => {
                                navigate(routes.user + data.user.id);
                            }}
                        >
                            {data.user.name}
                        </h5>
                        <div className={cx('row')}>
                            <div className={cx('m')}>
                                {text && (
                                    <div className={cx('message', { correct: data?.isCorrect })}>
                                        <div className={cx('content')}>{parse(text, { replace })}</div>
                                    </div>
                                )}
                                {data.image && (
                                    <Image
                                        className={cx('image', { correct: data?.isCorrect })}
                                        src={data.image}
                                        alt="pic"
                                        onClick={() => {
                                            setPreview(true);
                                        }}
                                    />
                                )}
                                {data?.isCorrect && (
                                    <div className={cx('correct-icon')}>
                                        <FontAwesomeIcon icon={faCircleCheck} />{' '}
                                    </div>
                                )}
                            </div>
                            {preview && <div className={cx('pop-up')} onClick={() => setPreview(false)}>
                                <Image src={data.image} className={cx('preview')} alt="preview" />
                            </div>}
                            <Menu
                                // chinh ben trai / chieu cao so vs ban dau
                                item={
                                    user?.uid === post.data.user.id
                                        ? data?.user.id === user?.uid
                                            ? [
                                                  {
                                                      icon: <FontAwesomeIcon icon={faFilePen} />,
                                                      title: 'Update',
                                                      type: 'update',
                                                  },
                                                  {
                                                      icon: <FontAwesomeIcon icon={faTrash} />,
                                                      title: 'Delete',
                                                      type: 'delete',
                                                  },
                                                  data?.isCorrect
                                                      ? {
                                                            icon: <FontAwesomeIcon icon={faCircleCheck} />,
                                                            title: 'Incorrect',
                                                            type: 'incorrect',
                                                        }
                                                      : {
                                                            icon: <FontAwesomeIcon icon={faCircleCheck} />,
                                                            title: 'Correct',
                                                            type: 'correct',
                                                        },
                                              ]
                                            : [
                                                  {
                                                      icon: <FontAwesomeIcon icon={faTrash} />,
                                                      title: 'Delete',
                                                      type: 'delete',
                                                  },
                                                  data?.isCorrect
                                                      ? {
                                                            icon: <FontAwesomeIcon icon={faCircleCheck} />,
                                                            title: 'Incorrect',
                                                            type: 'incorrect',
                                                        }
                                                      : {
                                                            icon: <FontAwesomeIcon icon={faCircleCheck} />,
                                                            title: 'Correct',
                                                            type: 'correct',
                                                        },
                                              ]
                                        : user?.isAdmin
                                        ? [
                                              {
                                                  icon: <FontAwesomeIcon icon={faTrash} />,
                                                  title: 'Delete',
                                                  type: 'delete',
                                              },
                                          ]
                                        : [report]
                                }
                                onClick={handleCommentOptions}
                                small
                                placement="right"
                            >
                                <div className={cx('options')}>
                                    <FontAwesomeIcon icon={faEllipsis} className={cx('icon')} />
                                </div>
                            </Menu>
                        </div>

                        <div className={cx('actions')}>
                            <span
                                className={cx('like')}
                                onClick={handleClickLike}
                                style={{ color: (react === 1 || like) && '#13a0f8' }}
                            >
                                Like
                            </span>
                            {!data.fatherCmt && (
                                <span className={cx('reply')} onClick={handleClickReply}>
                                    Reply {subComments.length > 0 && subComments.length}
                                </span>
                            )}
                            {data.isEdited && <span className={cx('edit')}>Edited</span>}
                            <span className={cx('time')}>{getTimeDiff(Date.now(), data.time?.toMillis())} ago</span>
                        </div>

                        {isReply &&
                            subComments.length !== 0 &&
                            subComments.map((comment) => {
                                return (
                                    <Comment
                                        key={comment.id}
                                        data={comment.data}
                                        id={comment.id}
                                        react={comment.react}
                                    />
                                );
                            })}
                        {isReply && user && <MyComment tag={{ name: data.user.name, id: data.user.id, father: id }} />}
                    </div>
                </>
            ) : (
                <>
                    <MyComment postData={data} postId={id} update={{ id: id, data: data }} />
                </>
            )}
        </div>
    );
}

export default memo(Comment);
