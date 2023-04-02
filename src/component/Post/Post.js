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

const cx = classNames.bind(styles);

function Post({ data ,...props}) {
    const [isCommentVisible, setIsCommentVisible] = useState(false);
    const context = useContext(ThemeContext);
    const [focusPost, setFocusPost] = useState(false);

    const [isLikeActive, setIsLiveActive] = useState(false);
    const [isDislikeActive, setIsDislikeActive] = useState(false);

    const handleClickLike = () => {
        setIsLiveActive(!isLikeActive);
        setIsDislikeActive(false);
    };

    const handleClickDislike = () => {
        setIsDislikeActive(!isDislikeActive);
        setIsLiveActive(false);
    };

    return (
        <div {...props} className={cx('wrapper', { dark: context.theme === 'dark' })}>
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
                                        className={cx('icon')}
                                        onClick={handleClickLike}
                                        style={{ color: isLikeActive && '#0073ff' }}
                                    />
                                    <p className={cx('nums')}>{data.like.length}</p>
                                </div>

                                <div className={cx('dislike-action')}>
                                    <FontAwesomeIcon
                                        icon={faThumbsDown}
                                        className={cx('icon')}
                                        onClick={handleClickDislike}
                                        style={{ color: isDislikeActive && '#0073ff' }}
                                    />
                                    <p className={cx('nums')}>{data.dislike.length}</p>
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
                        <FontAwesomeIcon
                            icon={faThumbsUp}
                            className={cx('icon')}
                            onClick={handleClickLike}
                            style={{ color: isLikeActive && '#0073ff' }}
                        />
                        <p className={cx('nums')}>{data.like.length}</p>
                    </div>

                    <div className={cx('dislike-action')}>
                        <FontAwesomeIcon
                            icon={faThumbsDown}
                            className={cx('icon')}
                            onClick={handleClickDislike}
                            style={{ color: isDislikeActive && '#0073ff' }}
                        />
                        <p className={cx('nums')}>{data.dislike.length}</p>
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
