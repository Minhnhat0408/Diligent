import {
    faCircleExclamation,
    faComment,
    faEllipsis,
    faLock,
    faMinus,
    faSave,
    faShare,
    faThumbsDown,
    faThumbsUp,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import FuncItem from '../FuncItem';
import { Wrapper } from '../Popper';
import styles from './Post.module.scss';
import { useState } from 'react';
import CommentBox from '~/component/CommentBox';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
import Image from '../Image';
import getTimeDiff from '~/utils/timeDiff';
import { arrayRemove, arrayUnion, doc, updateDoc, addDoc, collection, query, where, setDoc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '~/firebase';
import { UserAuth } from '~/contexts/authContext';
import routes from '~/config/routes';
import type from '~/config/typeNotification';

const cx = classNames.bind(styles);

function Post({ id, data }) {
    const [isCommentVisible, setIsCommentVisible] = useState(false);
    const context = useContext(ThemeContext);
    const { userData, user,notifications } = UserAuth();
    const [focusPost, setFocusPost] = useState(false);
    console.log(data.react)
    const handleClickLike = async () => {
        try {
            const dis = data.react === -1 ? data.dislike.count -1 : data.dislike.count;
            console.log(dis)
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
            if(user.uid !== data.user.id) {
            const q = query(collection(db,'users',data.user.id,'notifications'),where('sender.id','==',user.uid),where('type','==','dislike'))
            getDocs(q).then(async(result) => {
                if(result.docs.length === 0){
                    await addDoc(collection(db,'users',data.user.id,'notifications'),{
                        title: type.like,
                        url: routes.post + user.uid,
                        sender: {
                            id: user.uid,
                            name: userData.user_name,
                            avatar: userData.user_avatar,
                        },
                        type: 'like',
                        time: new Date(),
                        read: false,
                    })
                }else{
                    await updateDoc(doc(db, 'users', data.user.id, 'notifications',result.docs[0].id), {
                        title: type.like,
                        type: 'like',
                        time: new Date(),
                        read: false,
                    })
                }
            })
           ;}
        } catch (err) {
            console.log(err);
        }
    };

   
    
    const handleClickDislike = async () => {
        try {
            const lik = data.react === 1 ? data.like.count -1 : data.like.count;
            console.log(lik)
            await updateDoc(doc(db, 'posts', id), {
                dislike: {
                    count: data.dislike.count +1,
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
            if(user.uid !== data.user.id) {
                const q = query(collection(db,'users',data.user.id,'notifications'),where('sender.id','==',user.uid),where('type','==','like'))
                getDocs(q).then(async(result) => {
                    if(result.docs.length === 0){
                        await addDoc(collection(db,'users',data.user.id,'notifications'),{
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
                        })
                    }else{
                        await updateDoc(doc(db, 'users', data.user.id, 'notifications',result.docs[0].id), {
                            title: type.dislike,
                            type: 'dislike',
                            time: new Date(),
                            read: false,
                        })
                    }
                })
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
                            <h3>Sơn's Post</h3>
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
                                <Image src={data.user.avatar} className={cx('avatar')} alt="avatar" />
                                <div className={cx('title')}>
                                    <h5 className={cx('username')}>{data.user.name}</h5>
                                    <p className={cx('time')}>{getTimeDiff(Date.now(), data.time.toMillis())}</p>
                                </div>
                            </div>

                            <Tippy
                                interactive
                                placement="bottom"
                                delay={[0, 300]}
                                render={(attrs) => (
                                    <div className={cx('popper-wrapper')} tabIndex="-1" {...attrs}>
                                        <Wrapper>
                                            <FuncItem
                                                icon={<FontAwesomeIcon icon={faSave} />}
                                                title="Save"
                                                detail="Add this to your saved items"
                                            />
                                            <FuncItem
                                                icon={<FontAwesomeIcon icon={faMinus} />}
                                                title="Hide"
                                                detail="Hide this post"
                                            />
                                            <FuncItem
                                                icon={<FontAwesomeIcon icon={faCircleExclamation} />}
                                                title="Hide all"
                                                detail="Hide all posts from this user"
                                            />
                                            <FuncItem
                                                icon={<FontAwesomeIcon icon={faLock} />}
                                                title="Unfollow"
                                                detail="You will not see any activity from this user"
                                            />
                                        </Wrapper>
                                    </div>
                                )}
                            >
                                <div className={cx('options')}>
                                    <FontAwesomeIcon icon={faEllipsis} className={cx('icon')} />
                                </div>
                            </Tippy>
                        </div>

                        <p className={cx('content')}>{data.text} </p>
                        {data.files.map((file) => {
                            return <Image className={cx('image')} alt="post-image" src={file} />;
                        })}

                        <div className={cx('actions')}>
                            <div className={cx('default-action')}>
                                <div className={cx('like-action')}>
                                    <FontAwesomeIcon
                                        icon={faThumbsUp}
                                        className={cx('icon',{active:data.react === 1})}
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
                                        className={cx('icon',{active:data.react === -1})}
                                        onClick={() => {
                                            if (data.react !== -1) {
                                                handleClickDislike();
                                        }}}
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
                    <Image src={data.user.avatar} className={cx('avatar')} alt="avatar" />
                    <div className={cx('title')}>
                        <h5 className={cx('username')}>{data.user.name}</h5>
                        <p className={cx('time')}>{getTimeDiff(Date.now(), data.time.toMillis())}</p>
                    </div>
                </div>

                <Tippy
                    interactive
                    placement="bottom"
                    delay={[0, 300]}
                    render={(attrs) => (
                        <div className={cx('popper-wrapper')} tabIndex="-1" {...attrs}>
                            <Wrapper>
                                <FuncItem
                                    icon={<FontAwesomeIcon icon={faSave} />}
                                    title="Save"
                                    detail="Add this to your saved items"
                                />
                                <FuncItem
                                    icon={<FontAwesomeIcon icon={faMinus} />}
                                    title="Hide"
                                    detail="Hide this post"
                                />
                                <FuncItem
                                    icon={<FontAwesomeIcon icon={faCircleExclamation} />}
                                    title="Hide all"
                                    detail="Hide all posts from this user"
                                />
                                <FuncItem
                                    icon={<FontAwesomeIcon icon={faLock} />}
                                    title="Unfollow"
                                    detail="You will not see any activity from this user"
                                />
                            </Wrapper>
                        </div>
                    )}
                >
                    <div className={cx('options')}>
                        <FontAwesomeIcon icon={faEllipsis} className={cx('icon')} />
                    </div>
                </Tippy>
            </div>

            <p className={cx('content')}>{data.text} </p>
            <div className={cx('image-holders')}>
                {data.files.map((file) => {
                    return <Image className={cx('image')} alt="post-image" src={file} />;
                })}
            </div>

            <div className={cx('actions')}>
                <div className={cx('default-action')}>
                    <div className={cx('like-action')}>
                        <FontAwesomeIcon icon={faThumbsUp} className={cx('icon',{active:data.react === 1})}
                                        onClick={() => {
                                            if (data.react !== 1) {
                                                handleClickLike();
                                            }
                                        }} />
                        <p className={cx('nums')}>{data.like.count}</p>
                    </div>

                    <div className={cx('dislike-action')}>
                        <FontAwesomeIcon icon={faThumbsDown} className={cx('icon',{active:data.react === -1})}
                        onClick={() => {
                            if (data.react !== -1) {
                                handleClickDislike();
                        }}} />
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
