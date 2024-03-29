import classNames from 'classnames/bind';
import styles from './CommentBox.module.scss';
import Comment from '~/component/CommentComponents/Comment/Comment';
import { useEffect, useRef, useState } from 'react';
import {
    collection,
    onSnapshot,
    query,
    where,
} from 'firebase/firestore';
import { db } from '~/firebase';
import Image from '~/component/Image/Image';
import image from '~/assets/images';
import { UserAuth } from '~/contexts/authContext';

import { useContext } from 'react';
import { PostContext, ThemeContext } from '~/contexts/Context';
import CommentLoading from '../CommentLoading/CommentLoading';

const cx = classNames.bind(styles);

function CommentBox({box}) {
    const [comments, setComments] = useState([]);
    const { user } = UserAuth();
    const [filter, setFilter] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [animation, setAnimation] = useState(false);
    const post = useContext(PostContext);
    const context = useContext(ThemeContext);
    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'posts', post.id, 'comments'), where('fatherCmt', '==', '')), async (docs) => {
                let tmp = [];
                docs.forEach((doc) => {
                    if (
                        doc.data().like.list.some((u) => {
                            return u.id === user?.uid;
                        })
                    ) {
                        tmp.push({ id: doc.id, data: doc.data(), react: 1 });
                    } else {
                        tmp.push({ id: doc.id, data: doc.data(), react: 0 });
                    }
                });
                setComments(tmp);
            },
        );
        return () => unsubscribe();
    }, [post]);

    const onAnimationEnd = () => {
        if (!animation) setShowFilter(false);
    };

    useEffect(() => {
        if (animation) setShowFilter(true);
    }, [animation]);
    return (
        <>
            <div  className={cx('wrapper', { dark: context.theme === 'dark' })}>
                {comments.length !== 0 ? (
                    comments.map((comment) => {
                        return <Comment box={box} key={comment.id} data={comment.data} react={comment.react} id={comment.id} />;
                    })
                ) : (
                    <div className={cx('nothing')}>
                        <Image src={image.noContent} alt="nothing here" className={cx('no-content')} />
                    </div>
                )}


                <div className={cx('filter')} onClick={() => setAnimation(!animation)}>
                    {filter ? <span>{filter}</span> : <span>Filter</span>}
                </div>
                {showFilter && (
                    <div
                        className={cx('filter-opt', { show: animation, hide: !animation })}
                        onAnimationEnd={onAnimationEnd}
                    >
                        <div
                            onClick={() => {
                                setAnimation(!animation);
                                setFilter('Latest comments');
                                setComments((prev) => prev.sort((a, b) => b.data.time.seconds - a.data.time.seconds));
                            }}
                        >
                            Latest comments
                        </div>
                        <div
                            onClick={() => {
                                setAnimation(!animation);
                                setFilter('Most like comments');
                                setComments((prev) => prev.sort((a, b) => b.data.like.count - a.data.like.count));
                            }}
                        >
                            Most like comments
                        </div>
                        <div
                            onClick={() => {
                                setAnimation(!animation);
                                setFilter('Oldest comments');
                                setComments((prev) => prev.sort((a, b) => a.data.time.seconds - b.data.time.seconds));
                            }}
                        >
                            Oldest comments
                        </div>
                        <div
                            onClick={() => {
                                setAnimation(!animation);
                                setFilter('Correct answers');
                                setComments((prev) => prev.sort((a, b) => !!b.data?.isCorrect - !!a.data?.isCorrect));
                            }}
                        >
                            Correct answers
                        </div>
                    </div>
                )}
            </div>

            {post.cmtLoading && (
                <CommentLoading/>
            )}
        </>
    );
}

export default CommentBox;
