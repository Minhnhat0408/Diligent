import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Stories from '~/component/StoryComponents/Stories';
import CreatePost from '~/component/CreatePost';
import Post from '~/component/Post';
import { UserAuth } from '~/contexts/authContext';
import { useEffect } from 'react';
import { PostProvider } from '~/contexts/Provider';
import { useState } from 'react';

const cx = classNames.bind(styles);

function Home() {
    const { user, posts } = UserAuth();
    const [show, setShow] = useState(false);
    return (
        <div className={cx('wrapper') + ' mdx-max:w-[34vw] mdl-max:!min-w-[80vw] md-max:!w-[93vw]'}>
            {/* Phần story  */}
            <Stories />
            {/* Phần tạo bài viết  */}
            {user && <CreatePost show={show} setShow={setShow} />}
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
