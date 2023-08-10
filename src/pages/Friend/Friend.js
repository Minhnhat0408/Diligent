import classNames from 'classnames/bind';
import styles from './Friend.module.scss';
import FriendBox from '~/component/FriendBox/FriendBox';
import { useState } from 'react';
import { useEffect } from 'react';
import { collection, documentId, getDocs, limit, query, startAfter, where } from 'firebase/firestore';
import { UserAuth } from '~/contexts/authContext';
import { db } from '~/firebase';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostLoading from '~/component/PostComponents/PostLoading';
const cx = classNames.bind(styles);

function Friend() {
    const [allFr, setAllFr] = useState([]);
    const [lastFr, setLastFr] = useState();
    const { user, userData } = UserAuth();
    useEffect(() => {
        const fetchAllFr = async () => {
            const q = query(collection(db, 'users'), where(documentId(), '!=', user.uid), limit(8));
            const docs = await getDocs(q);
            const newData = docs.docs.map((doc) => {
                const ids1Set = new Set(userData?.user_friends.map((obj) => obj.id));
                const commonIds = doc.data().user_friends.filter((obj) => ids1Set.has(obj.id));
                if (userData.user_friends.some((obj) => obj.id === doc.id)) {
                    return { id: doc.id, data: { ...doc.data(), friend: 1,mutual:commonIds.length } };
                } else if (userData.user_friendRequests.some((obj) => obj.id === doc.id)) {
                    return { id: doc.id, data: { ...doc.data(), friend: -1,mutual:commonIds.length } };
                } else {
                    return { id: doc.id, data: { ...doc.data(), friend: 0,mutual:commonIds.length } };
                }
            });
            setAllFr(newData);
            // // Update the last post for pagination
            if (docs.docs.length > 0) {
                setLastFr(docs.docs[docs.docs.length - 1]);
            }
        };
        if(userData)
        fetchAllFr();
    }, [userData]);

    const fetchMoreFr = async () => {
        if (lastFr) {
            const q = query(collection(db, 'users'), where(documentId(), '!=', user.uid), startAfter(lastFr), limit(8));
            let docs = await getDocs(q);

            if (docs.docs.length > 0) {
                setLastFr(docs.docs[docs.docs.length - 1]);
            } else {
                // No more documents available
                setLastFr(null);
            }
            const newData = docs.docs.map((doc) => {
                const ids1Set = new Set(userData.user_friends.map((obj) => obj.id));
                    const commonIds = doc.data().user_friends.filter((obj) => ids1Set.has(obj.id));
                if (userData.user_friends.some((obj) => obj.id === doc.id)) {
                    return { id: doc.id, data: { ...doc.data(), friend: 1,mutual:commonIds.length } };
                } else if (userData.user_friendRequests.some((obj) => obj.id === doc.id)) {
                    return { id: doc.id, data: { ...doc.data(), friend: -1,mutual:commonIds.length } };
                } else {
                    
                    return { id: doc.id, data: { ...doc.data(), friend: 0,mutual:commonIds.length } };
                }
            });
            setAllFr((prev) => [...prev, ...newData]);
        }
    };
    return (
        <div className={'py-[10px]   '}>
            {/* <h2 className="flex flex-col text-white justify-center items-center">Friend page</h2> */}

            {allFr ? (
                <InfiniteScroll
                    dataLength={allFr.length}
                    next={fetchMoreFr}
                    className=" w-[50vw] min-w-[700px] m-auto flex flex-wrap justify-around content-start"
                    style={{ overflow: 'visible' }}
                    hasMore={lastFr !== null}
                    loader={<PostLoading />}
                >
                    {allFr.map((u, id) => (
                        <FriendBox key={u.id} id={u.id} data={u.data} />
                    ))}
                </InfiniteScroll>
            ) : (
                <PostLoading />
            )}
        </div>
    );
}

export default Friend;
