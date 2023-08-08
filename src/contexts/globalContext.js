import { createContext, useEffect, useRef, useState } from 'react';
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    or,
    limit,
    startAfter,
    documentId,
    updateDoc,
    arrayRemove,
    doc,
    arrayUnion,
    addDoc,
    serverTimestamp,
    onSnapshot,
} from 'firebase/firestore';

import { db } from '../firebase';
import { UserAuth } from './authContext';
import { useContext } from 'react';
import type from '~/config/typeNotification';
import routes from '~/config/routes';

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [lastPost, setLastPost] = useState(null);
    const { user, userData, getUserPrefers } = UserAuth();
    const [contacts, setContacts] = useState([]);
    
    const suggestedFr = useRef([]);
    const [lastFinalPost, setLastFinalPost] = useState(null);
    const relevantPosts = useRef([]);
    const [scrollPositions, setScrollPositions] = useState({});
    const [refreshPosts, setReFreshPosts] = useState(false);
    useEffect(() => {
        if (user) {
            const fetchUserPosts = async () => {
                if (userData) {
                    let listFr = userData.user_friends.map((d) => d.id);
                    const userPreferences = await getUserPrefers();
                    if (userPreferences.length === 0) {
                        userPreferences.push('nothing');
                    }
                    console.log(userPreferences);
                    listFr.push(user.uid);
                    let q = query(
                        collection(db, 'posts'),
                        or(where('user.id', 'in', listFr), where('tags', 'array-contains-any', userPreferences)),
                        orderBy('time', 'desc'),
                        limit(5),
                    );
                    let docs = await getDocs(q);

                    if (docs.docs.length === 0) {
                        q = query(collection(db, 'posts'), orderBy('time', 'desc'), limit(5));
                        docs = await getDocs(q);
                    }
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
    }, [user, refreshPosts, userData]);

    useEffect(() => {
        if (user && userData) {
            async function fetchSuggestedFr() {
                const fr = userData.user_friends
                    .map((u) => {
                        return u.id;
                    })
                    .slice(0, 10);
                
                    console.log(fr)
                const a = await getDocs(query(collection(db, 'users'), where(documentId(), 'not-in', fr), limit(5)));
                const b = a.docs.map((d) => {
                    return {
                        id: d.id,
                        data: { user_name: d.data().user_name, user_avatar: d.data().user_avatar },
                    };
                });

                suggestedFr.current = b;
            }

            fetchSuggestedFr();

            const unsubscribe = onSnapshot(
                query(
                    collection(db, 'chats'),
                    orderBy('lastView', 'desc'),
                    or(where('user1.id', '==', user.uid), where('user2.id', '==', user.uid)),
                ),
                async (docs) => {
                    let tmp = [];
                    docs.forEach((d) => {
                        tmp.push({ id: d.id, data: d.data() });
                    });     
                    setContacts(tmp);
                },
            );

            return () => unsubscribe();
        }
    }, [user,userData]);
    const fetchMorePosts = async () => {
        if (lastPost) {
            let q = query(collection(db, 'posts'), orderBy('time', 'desc'), startAfter(lastPost), limit(5));
            if (user) {
                let listFr = userData.user_friends.map((d) => d.id);
                listFr.push(user.uid);
                const userPreferences = await getUserPrefers();
                if (userPreferences.length === 0) {
                    userPreferences.push('nothing');
                }
                q = query(
                    collection(db, 'posts'),
                    or(where('user.id', 'in', listFr), where('tags', 'array-contains-any', userPreferences)),
                    orderBy('time', 'desc'),
                    startAfter(lastPost),
                    limit(5),
                );
            }
            let docs = await getDocs(q);

            if (docs.docs.length > 0) {
                // Update the last post for pagination
                setLastPost(docs.docs[docs.docs.length - 1]);
            } else {
                // No more documents available
                if (relevantPosts.current.length <= 0) {
                    relevantPosts.current = posts.map((doc) => doc.id).slice(-10);
                }

                if (lastFinalPost) {
                    q = query(
                        collection(db, 'posts'),
                        where(documentId(), 'not-in', relevantPosts.current),
                        orderBy(documentId()),
                        startAfter(lastFinalPost),
                        limit(5),
                    );
                } else {
                    q = query(
                        collection(db, 'posts'),
                        where(documentId(), 'not-in', relevantPosts.current),
                        orderBy(documentId()),
                        limit(5),
                    );
                }
                docs = await getDocs(q);
                if (docs.docs.length > 0) {
                    setLastFinalPost(docs.docs[docs.docs.length - 1]);
                } else {
                    setLastFinalPost(null);
                    setLastPost(null);
                }
            }
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
        }
    };
    const handleReadNoti = async (data) => {
        if (data.read === false) {
            const q = query(
                collection(db, 'users', user?.uid, 'notifications'),
                where('sender.id', '==', data.sender.id),
                where('read', '==', false),
            );
            const docs = await getDocs(q);
            await updateDoc(doc(db, 'users', user?.uid, 'notifications', docs.docs[0].id), {
                read: true,
            });
        }
    };

    const handleDecline = async (data) => {
        await updateDoc(doc(db, 'users', user.uid), {
            user_friendRequests: arrayRemove({
                id: data.id,
                ava: data.ava,
                name: data.name,
            }),
        });
    };

    const handleAccept = async (data) => {
        await updateDoc(doc(db, 'users', data.id), {
            user_friends: arrayUnion({
                id: user.uid,
                ava: userData.user_avatar,
                name: userData.user_name,
                time: new Date(),
            }),
        });
        await addDoc(collection(db, 'users', data.id, 'notifications'), {
            title: type.accfr,
            url: routes.user + user.uid,
            sender: {
                id: user.uid,
                name: userData.user_name,
                avatar: userData.user_avatar,
            },
            type: 'accfr',
            time: serverTimestamp(),
            read: false,
        });

        await updateDoc(doc(db, 'users', user.uid), {
            user_friends: arrayUnion({
                id: data.id,
                ava: data.ava,
                name: data.name,
                time: new Date(),
            }),
            user_friendRequests: arrayRemove({
                id: data.id,
                ava: data.ava,
                name: data.name,
            }),
        });
    };
    const unFriend = async (friendData) => {
        const deleteFr = userData.user_friends.filter((friend) => {
            return friend.id === friendData.id;
        });

        await updateDoc(doc(db, 'users', user.uid), {
            user_friends: arrayRemove({
                id: deleteFr[0].id,
                ava: deleteFr[0].ava,
                name: deleteFr[0].name,
                time: deleteFr[0].time,
            }),
        });
        await updateDoc(doc(db, 'users', friendData.id), {
            user_friends: arrayRemove({
                id: friendData.data.id,
                ava: friendData.data.ava,
                name: friendData.data.name,
                time: friendData.data.time,
            }),
        });
    };

    const value = {
        lastPost,
        posts,
        refreshPosts,
        scrollPositions,
        suggestedFr,
        contacts,
        setPosts,
        setScrollPositions,
        setReFreshPosts,
        fetchMorePosts,
        unFriend,
        handleAccept,
        handleDecline,
        handleReadNoti,
    };

    return (
        <GlobalContext.Provider value={value}>
            <>{children}</>
        </GlobalContext.Provider>
    );
};

export const GlobalProps = () => {
    return useContext(GlobalContext);
};
