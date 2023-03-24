import classNames from 'classnames/bind';
import styles from './CommentBox.module.scss';
import Comment from '~/component/Comment/Comment';
import MyComment from '~/component/MyComment/MyComment';

const cx = classNames.bind(styles);

const comments = [
    {
        avatar: 'https://scontent.fhan15-2.fna.fbcdn.net/v/t1.6435-1/147677418_1119459815159609_3387462793116236375_n.jpg?stp=dst-jpg_p100x100&_nc_cat=104&ccb=1-7&_nc_sid=7206a8&_nc_ohc=y_xkM1TEpE8AX-s4V6A&_nc_ad=z-m&_nc_cid=1229&_nc_ht=scontent.fhan15-2.fna&oh=00_AfC9FFHBtWRfbeZVmWdRFAl7z4noGNMC6qmxPZ3PHqG7-g&oe=643FA667',
        username: 'Sếp Khoa',
        paragraph: 'Ngon vkl',
        img: 'https://scontent.fhan15-1.fna.fbcdn.net/v/t39.30808-6/282784957_3154917814757054_2260434140125186522_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=vPEnTA0MOFIAX9SThQJ&_nc_ht=scontent.fhan15-1.fna&oh=00_AfDIFmevc9bbhdYocGCOf0pZl0Efbn2DUSxM4mBVfSjTKQ&oe=641DA3A3',
    },
];

function CommentBox() {
    return (
        <div className={cx('wrapper')}>
            {comments.map((comment, index) => {
                return (
                    <Comment
                        key={index}
                        avatar={comment.avatar}
                        username={comment.username}
                        img={comment.img}
                        paragraph={comment.paragraph}
                    />
                );
            })}

            <MyComment />
        </div>
    );
}

export default CommentBox;
