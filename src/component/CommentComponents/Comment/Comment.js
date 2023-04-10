import classNames from 'classnames/bind';
import { useState } from 'react';
import ReplyComment from '../ReplyComment/ReplyComment';
import styles from './Comment.module.scss';

const cx = classNames.bind(styles);

function Comment({ avatar, username, paragraph, img, disable }) {
    const [likeActive, setLikeActive] = useState(false);
    const [isReply, setIsReply] = useState(false);

    const handleClickLike = () => {
        setLikeActive(!likeActive);
    };

    const handleClickReply = () => {
        if (disable) {
            // Xử lí reply của subcomment
            return;
        }
        setIsReply(!isReply);
    };

    return (
        <div className={cx('wrapper')}>
            <img src={avatar} className={cx('avatar')} />
            <div className={cx('comment')}>
                <h5 className={cx('username')}>{username}</h5>
                <div className={cx('message')}>
                    <p className={cx('paragraph')}>{paragraph}</p>
                </div>
                {img != undefined && <img className={cx('image')} src={img} />}

                <div className={cx('actions')}>
                    <span className={cx('like')} onClick={handleClickLike} style={{ color: likeActive && '#13a0f8' }}>
                        Like
                    </span>
                    <span className={cx('reply')} onClick={handleClickReply}>
                        Reply
                    </span>
                    <span className={cx('time')}>2 tuần</span>
                </div>

                {isReply && (
                    <Comment
                        avatar="https://scontent.fhan5-9.fna.fbcdn.net/v/t39.30808-1/277751572_1315302068964376_895612620486881878_n.jpg?stp=dst-jpg_p100x100&_nc_cat=109&ccb=1-7&_nc_sid=7206a8&_nc_ohc=y6DgmDpQOo4AX_5dLAS&_nc_oc=AQmUBH4fWQYChiEt-Q8p-YbMmNFVnHE-bS3BNLHH4eA557wPleTncZFkK0_zQfCkt0A&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.fhan5-9.fna&oh=00_AfACNGCK4LgQWwYDYAKqbgfTkRrjb_LH5MmmHGw4QRWxtg&oe=641EFB00"
                        username="Minh Nhat"
                        paragraph="em nay ngon vkl vay"
                        img="https://scontent.fhan15-1.fna.fbcdn.net/v/t39.30808-6/282784957_3154917814757054_2260434140125186522_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=vPEnTA0MOFIAX9SThQJ&_nc_ht=scontent.fhan15-1.fna&oh=00_AfDIFmevc9bbhdYocGCOf0pZl0Efbn2DUSxM4mBVfSjTKQ&oe=641DA3A3"
                        disable={true}
                    />
                )}
                {isReply && <ReplyComment username={username} />}
            </div>
        </div>
    );
}

export default Comment;
