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
import { getIdInMentions, regex } from '~/utils/constantValue';
import Menu from '~/component/Popper/Menu/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faFilePen, faTrash } from '@fortawesome/free-solid-svg-icons';
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
} from 'firebase/firestore';
import { db } from '~/firebase';
import type from '~/config/typeNotification';
import { memo } from 'react';

const cx = classNames.bind(styles);
function Comment({ data, id, react }) {
    const [like, setLike] = useState(false);
    const [isReply, setIsReply] = useState(false);
    const [text, setText] = useState('');
    const { user, userData } = UserAuth();
    const navigate = useNavigate();
    const context = useContext(ThemeContext);
    const [update, setUpdate] = useState(false);
    const [subComments, setSubComments] = useState([]);
    const post = useContext(PostContext)
    useEffect(() => {
        const fetchSubComment = async () => {
            const q = query(collection(db, 'posts', post.id, 'comments'), where('fatherCmt', '==', id));
            const tmp = [];
            const docs = await getDocs(q);

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
            console.log(tmp);
            setSubComments(tmp);
        };
        if (isReply) {
            fetchSubComment();
        }else{
            setText(
                data.text.replace(regex, (spc) => {
                    const id = spc.match(getIdInMentions)[0].substring(1);
                    const name = spc.substring(0, spc.indexOf('('));
                    return `<strong id="mentions" data='${id}' name="${name}" >${name}</strong>`;
                }),
            );
        }
        setUpdate(false);
    }, [data, isReply]);
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
        let type = item.type;
        if (type === 'update') {
            setUpdate(true);
        } else if (type === 'delete') {
            await deleteDoc(doc(db, 'posts', post.id, 'comments', id));
            await updateDoc(doc(db, 'posts', post.id), {
                commentNumber: post.data.commentNumber - 1,
            });
        }
    };

    return (
        <div className={cx('wrapper', { dark: context.theme === 'dark',page:post.page })}>
            {!update ? (
                <>
                    <Image src={data.user.avatar} className={cx('avatar')} alt="ava" />
                    <div className={cx('comment')}>
                        <h5 className={cx('username')}>{data.user.name}</h5>
                        <div className={cx('row')}>
                            <div className={cx('message')}>
                                <div className={cx('content')}>{parse(text, { replace })}</div>
                            </div>
                            {data.user.id === user?.uid && (
                                <Menu
                                    // chinh ben trai / chieu cao so vs ban dau
                                    item={[
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
                                    ]}
                                    onClick={handleCommentOptions}
                                >
                                    <div className={cx('options')}>
                                        <FontAwesomeIcon icon={faEllipsis} className={cx('icon')} />
                                    </div>
                                </Menu>
                            )}
                        </div>
                        {data.image && <Image className={cx('image')} src={data.image} alt="pic" />}

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
                                    Reply
                                </span>
                            )}
                            {data.isEdited && <span className={cx('edit')}>Edited</span>}
                            <span className={cx('time')}>{getTimeDiff(Date.now(), data.time.toMillis())}</span>
                        </div>

                        {isReply &&
                            subComments.length !== 0 &&
                            subComments.map((comment) => {
                                return (
                                    <Comment
                                        key={comment.id}
                                        data={comment.data}
                                        id={comment.id}
                                    />
                                );
                            })}
                        {isReply && user && (
                            <MyComment
                                tag={{ name: data.user.name, id: data.user.id, father: id }}
                            />
                        )}
                    </div>
                </>
            ) : (
                <>
                    <MyComment
                        postData={data} postId={id}
                        update={{ id: id,data:data}}
                        
                    />
                </>
            )}
        </div>
    );
}

export default memo(Comment);
