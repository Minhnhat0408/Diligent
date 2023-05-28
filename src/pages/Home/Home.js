import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Stories from '~/component/StoryComponents/Stories';
import CreatePost from '~/component/CreatePost';
import Post from '~/component/Post';
import { UserAuth } from '~/contexts/authContext';
import { useEffect } from 'react';
import { PostProvider } from '~/contexts/Provider';
import { useState } from 'react';
import { memo } from 'react';
import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { db } from '~/firebase';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostLoading from '~/component/PostLoading/PostLoading';

const cx = classNames.bind(styles);

function Home() {
    const { user, userData } = UserAuth();
    const [show, setShow] = useState(false);
    const [posts, setPosts] = useState([]);
    const [lastPost, setLastPost] = useState(null);
    const [refresh,setReFresh] = useState(false)
    useEffect(() => { 
        console.log('fetch');
        console.log(refresh)
        if (user) {
            const fetchUserPosts = async () => {
                if (userData) {
                    let listFr = userData.user_friends.map((d) => d.id);
                    listFr.push(user.uid);
                    const q = query(
                        collection(db, 'posts'),
                        where('user.id', 'in', listFr),
                        orderBy('time', 'desc'),
                        limit(5),
                    );
                    const docs = await getDocs(q);

                    const newData = docs.docs.map((doc) => {
                        if (
                            doc.data().like.list.some((u) => {
                                return u.id === user.uid;
                            })
                        ) {
                            return { id: doc.id, data: { ...doc.data(), react: 1 } }; // 1 mean like
                        } else if (
                            doc.data().dislike.list.some((u) => {
                                return u.id === user.uid;
                            })
                        ) {
                            return { id: doc.id, data: { ...doc.data(), react: -1 } }; // -1 mean dislike
                        } else {
                            return { id: doc.id, data: { ...doc.data(), react: 0 } }; // 0 mean neutral
                        }
                    });
                    console.log(newData)
                    setPosts(newData);

                    // Update the last post for pagination
                    if (docs.docs.length > 0) {
                        setLastPost(docs.docs[docs.docs.length - 1]);
                    }
                }
            };
            fetchUserPosts();
        } else {
            const fetchPosts = async () => {
                const q = query(collection(db, 'posts'), orderBy('time', 'desc'), limit(5));
                const docs = await getDocs(q);
                const newData = docs.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
                setPosts(newData);
                // Update the last post for pagination
                if (docs.docs.length > 0) {
                    setLastPost(docs.docs[docs.docs.length - 1]);
                }
            };
            fetchPosts();
        }
    }, [user, refresh]);
    const fetchMorePosts = async () => {
        console.log('hello');
        if (lastPost) {
            let q = query(collection(db, 'posts'), orderBy('time', 'desc'), startAfter(lastPost), limit(5));
            if (user) {
                let listFr = userData.user_friends.map((d) => d.id);
                listFr.push(user.uid);
                q = query(
                    collection(db, 'posts'),
                    where('user.id', 'in', listFr),
                    orderBy('time', 'desc'),
                    startAfter(lastPost),
                    limit(5),
                );
            }
            const docs = await getDocs(q);
            const newData = docs.docs.map((doc) => {
                if (user) {
                    if (
                        doc.data().like.list.some((u) => {
                            return u.id === user.uid;
                        })
                    ) {
                        return { id: doc.id, data: { ...doc.data(), react: 1 } }; // 1 mean like
                    } else if (
                        doc.data().dislike.list.some((u) => {
                            return u.id === user.uid;
                        })
                    ) {
                        return { id: doc.id, data: { ...doc.data(), react: -1 } }; // -1 mean dislike
                    } else {
                        return { id: doc.id, data: { ...doc.data(), react: 0 } }; // 0 mean neutral
                    }
                } else {
                    return { id: doc.id, data: doc.data() };
                }
            });
            setPosts((prevPosts) => [...prevPosts, ...newData]);
            // Update the last post for pagination
            if (docs.docs.length > 0) {
                setLastPost(docs.docs[docs.docs.length - 1]);
            } else {
                // No more documents available
                setLastPost(null);
            }
        }
    };
    return (
        <div className={cx('wrapper') + ' mdx-max:w-[34vw] mdl-max:!min-w-[80vw] md-max:!w-[93vw]'}>
            {/* Phần story  */}
            <Stories />
            {/* Phần tạo bài viết  */}
            {user && <CreatePost show={show} setShow={setShow} setReFresh={setReFresh} />}
            {/* Hiển thị bài viết */}
           
            {posts ? <InfiniteScroll
                dataLength={posts.length}
                next={fetchMorePosts}
                style={{minWidth:550,overflow:null}}
                hasMore={lastPost !== null}
                loader={<PostLoading/>}
            >
                {posts.map((post, id) => (
                    <PostProvider key={post.id} id={post.id} data={post.data} setReFresh={setReFresh} setUpdate={setPosts}>
                        <Post key={post.id} />
                    </PostProvider>
                ))}
            </InfiniteScroll> : <PostLoading/>}
        </div>
    );
}

export default memo(Home);
