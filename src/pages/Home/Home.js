import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Stories from '~/component/StoryComponents/Stories';
import CreatePost from '~/component/CreatePost';
import Post from '~/component/Post';
import { UserAuth } from '~/contexts/authContext';
import { useEffect } from 'react';
import { PostProvider } from '~/contexts/Provider';
import { useState } from 'react';
import {
    collection,
    limit,
    onSnapshot,
    query,
    where,
} from 'firebase/firestore';
import { db } from '~/firebase';
import InfiniteScroll from 'react-infinite-scroll-component';

const cx = classNames.bind(styles);

function Home() {
    const { user,posts } = UserAuth();
    const [show,setShow] = useState(false);
    // const [posts,setPosts] = useState();
    // const [lim,setLim] = useState(5);
    // useEffect(()=>{
    //     const unsubscribe =  onSnapshot(query(collection(db, 'posts'), limit(lim)), (docs) => {
    //         let data1 = [];
    //         console.log('posts change');
    //         docs.forEach((doc) => {
    //             if (
    //                 doc.data().like.list.some((u) => {
    //                     return u.id === user.uid;
    //                 })
    //             ) {
    //                 data1.push({ id: doc.id, data: { ...doc.data(), react: 1 } }); // 1 mean like
    //             } else if (
    //                 doc.data().dislike.list.some((u) => {
    //                     return u.id === user.uid;
    //                 })
    //             ) {
    //                 data1.push({ id: doc.id, data: { ...doc.data(), react: -1 } }); // -1 mean dislike
    //             } else {
    //                 data1.push({ id: doc.id, data: { ...doc.data(), react: 0 } }); // 0 mean neutral
    //             }
    //         });
    //         data1.sort((a, b) => b.data.time.seconds - a.data.time.seconds);
    //         setPosts(data1);
    //     });
    //     return () => unsubscribe();        
    // },[])
    return (
        <div className={cx('wrapper') + ' mdx-max:w-[34vw] mdl-max:!min-w-[80vw] md-max:!w-[93vw]'}>
            {/* Phần story  */}
            <Stories />
            {/* Phần tạo bài viết  */}
            {user && <CreatePost show={show} setShow={setShow} />}
            {/* Hiển thị bài viết */}
            {/* <InfiniteScroll
          dataLength={this.state.items.length}
          next={this.fetchMoreData}
          hasMore={true}
          loader={<h4>Loading...</h4>}
        >
          {this.state.items.map((i, index) => (
            <div style={style} key={index}>
              div - #{index}
            </div>
          ))}
        </InfiniteScroll> */}
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
