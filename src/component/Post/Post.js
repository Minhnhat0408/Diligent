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

const cx = classNames.bind(styles);

function Post({ avatar, username, time, content, image, likeNums, dislikeNums, commentNums }) {
    const [isCommentVisible, setIsCommentVisible] = useState(false);

    function handleCommentClick() {
        console.log('ok');
        setIsCommentVisible(!isCommentVisible);
    }

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

    const context = useContext(ThemeContext)

    return (
        <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
            <div className={cx('header')}>
                <div className={cx('info')}>
                    <Image
                        src="https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-9/51132488_1049848925197144_4209746563502702592_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=6jNeyhfww0cAX9bxzni&_nc_ht=scontent.fhan5-2.fna&oh=00_AfDAyCtElTrMPbwWW9z-mT07V8vShL7B6TDQ5VjrdXzNiA&oe=643AA3B8"
                        className={cx('avatar')}
                        alt="avatar"
                    />
                    <div className={cx('title')}>
                        <h5 className={cx('username')}>To Lam Son</h5>
                        <p className={cx('time')}>22 min ago</p>
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

            <p className={cx('content')}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non,
                feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus.{' '}
            </p>

            <img
                className={cx('image')}
                src="https://scontent.fhan5-11.fna.fbcdn.net/v/t1.15752-9/331385382_2146975102167124_2229025955395837596_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=ae9488&_nc_ohc=KSLV0bPZ_gsAX_0MW4o&_nc_ht=scontent.fhan5-11.fna&oh=03_AdSFysJF-Z9LR5usHvHCY7KUBoOKm45-_LZ8Zilqf18hUQ&oe=643ABF47"
            />

            <div className={cx('actions')}>
                <div className={cx('default-action')}>
                    <div className={cx('like-action')}>
                        <FontAwesomeIcon
                            icon={faThumbsUp}
                            className={cx('icon')}
                            onClick={handleClickLike}
                            style={{ color: isLikeActive && '#0073ff' }}
                        />
                        <p className={cx('nums')}>2.8k</p>
                    </div>

                    <div className={cx('dislike-action')}>
                        <FontAwesomeIcon
                            icon={faThumbsDown}
                            className={cx('icon')}
                            onClick={handleClickDislike}
                            style={{ color: isDislikeActive && '#0073ff' }}
                        />
                        <p className={cx('nums')}>2.8k</p>
                    </div>

                    <div className={cx('comment-action')}>
                        <FontAwesomeIcon icon={faComment} className={cx('icon')} onClick={handleCommentClick} />
                        <p className={cx('nums')}>2.8k</p>
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
