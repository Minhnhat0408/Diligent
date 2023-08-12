import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Stories from '~/component/StoryComponents/Stories';
import CreatePost from '~/component/PostComponents/CreatePost';
import Post from '~/component/PostComponents/Post';
import { UserAuth } from '~/contexts/authContext';
import { useEffect } from 'react';
import { PostProvider } from '~/contexts/Provider';
import { useState } from 'react';
import { memo } from 'react';
import { addDoc, collection,serverTimestamp,} from 'firebase/firestore';
import { db } from '~/firebase';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostLoading from '~/component/PostComponents/PostLoading/PostLoading';
import { GlobalProps } from '~/contexts/globalContext';
import {toast} from 'react-hot-toast'
const cx = classNames.bind(styles);

function Home() {
    const { user,userData } = UserAuth();
    const [loading, setLoading] = useState(false);

    const { fetchMorePosts, lastPost, setPosts, posts, setReFreshPosts } = GlobalProps();
    useEffect(() =>{
        async function deck() {
            for (let i = 0; i < 5; i++) {
                await addDoc(collection(db, 'flashcards'), {
                    front:'creative',
                    back:{
                        content:'Sáng tạo trong công việc',
                        example:''
                    },
                    deckId:'mgpdo7LthVhECGKF9N5f',
                    time:serverTimestamp()
                }); 
              }
              
        }
        if(user && userData) {
            deck();
        }
     
    },[user,userData])
    return (
        <div className={cx('wrapper') + ' mdx-max:w-[34vw] mdl-max:min-w-[80vw] md-max:!w-[93vw] '}  >
            {/* Phần story  */}
            <Stories />
         
            {/* Phần tạo bài viết  */}
            {user && <CreatePost setLoading={setLoading} setReFresh={setReFreshPosts} />}
            {/* Hiển thị bài viết */}

            {loading && <PostLoading />}
            {posts ? (
                <InfiniteScroll
                    dataLength={posts.length}
                    next={fetchMorePosts}
                    className="min-w-[550px] smu-max:min-w-full"
                    style={{overflow:'visible'}}
                    hasMore={lastPost !== null}
                    loader={<PostLoading />}
                >
                    {posts.map((post, id) => (
                        <PostProvider
                            key={id}
                            id={post.id}
                            data={post.data}
                            setReFresh={setReFreshPosts}
                            setUpdate={setPosts}
                        >
                            <Post key={id} />
                        </PostProvider>
                    ))}
                </InfiniteScroll>
            ) : (
                <PostLoading />
            )}
        </div>
    );
}

export default memo(Home);
