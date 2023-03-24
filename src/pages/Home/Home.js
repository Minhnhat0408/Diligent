import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Stories from '~/component/Stories';
import CreatePost from '~/layouts/components/CreatePost/CreatePost';
import Post from '~/layouts/components/Post/Post';

const cx = classNames.bind(styles);

function Home() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('newsfeed')}>
                {/* Phần story  */}
                <Stories />

                {/* Phần tạo bài viết  */}
                <CreatePost avatar="https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-9/51132488_1049848925197144_4209746563502702592_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=6jNeyhfww0cAX9bxzni&_nc_ht=scontent.fhan5-2.fna&oh=00_AfDAyCtElTrMPbwWW9z-mT07V8vShL7B6TDQ5VjrdXzNiA&oe=643AA3B8" />

                {/* Hiển thị bài viết */}
                <Post/>
            </div>

            <div className={cx('card-info')}></div>
        </div>
    );
}

export default Home;
