import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Stories from '~/component/StoryComponents/Stories';
import CreatePost from '~/component/CreatePost';
import Post from '~/component/Post';
import { UserAuth } from '~/contexts/authContext';
import { useEffect } from 'react';
import { PostProvider } from '~/contexts/Provider';

const cx = classNames.bind(styles);

function Home() {
    const { user, posts } = UserAuth();
    
    return (
        <div className={cx('wrapper')}>
            {/* Phần story  */}
            <Stories />
            {/* Phần tạo bài viết  */}
            {user && (
                <CreatePost avatar="https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-9/51132488_1049848925197144_4209746563502702592_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=6jNeyhfww0cAX9bxzni&_nc_ht=scontent.fhan5-2.fna&oh=00_AfDAyCtElTrMPbwWW9z-mT07V8vShL7B6TDQ5VjrdXzNiA&oe=643AA3B8" />
            )}
            {/* Hiển thị bài viết */}
            {posts &&
                posts
                    .filter((post) => {
                        return user ? !post.data.hide.includes(user.uid) : true;
                    })
                    .map((post, id) => (
                        <PostProvider key={id} id={post.id} data={post.data}>
                            <Post />
                        </PostProvider>
                    ))}
        </div>
    );
}

export default Home;
