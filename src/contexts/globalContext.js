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
    deleteDoc,
    and,
} from 'firebase/firestore';
import type from '~/config/typeNotification';
import { db } from '../firebase';
import { UserAuth } from './authContext';
import { useContext } from 'react';

import routes from '~/config/routes';
import { adminId } from '~/utils/constantValue';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [stories, setStories] = useState({});
    const [lastPost, setLastPost] = useState(null);
    const { user, userData, getUserPrefers, listFr } = UserAuth();
    const [contacts, setContacts] = useState([]);
    const [notifications, setNotifications] = useState();
    const suggestedFr = useRef([]);
    const [lastFinalPost, setLastFinalPost] = useState(null);
    const relevantPosts = useRef([]);
    const [scrollPositions, setScrollPositions] = useState({});
    const [refreshPosts, setReFreshPosts] = useState(false);
    const storage = getStorage();
    const metadata = {
        contentType: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'],
    };
    useEffect(() => {
        if (user) {
            const fetchUserPosts = async () => {
                let listFr = userData.user_friends.map((d) => d.id);
                const userPreferences = await getUserPrefers();
                if (userPreferences.length === 0) {
                    userPreferences.push('nothing');
                }
                if (listFr.length === 0) {
                    listFr.push('nothing');
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
                let newData = [];
                docs.docs.forEach((doc) => {
                    if(!doc.data().hide.includes(user.uid)) {
                        if (
                            doc.data().like.list.some((u) => {
                                return u.id === user.uid;
                            })
                        ) {
                            newData.push({ id: doc.id, data: { ...doc.data(), react: 1 } }); // 1 mean like
                        } else if (
                            doc.data().dislike.list.some((u) => {
                                return u.id === user.uid;
                            })
                        ) {
                            newData.push({ id: doc.id, data: { ...doc.data(), react: -1 } }); // -1 mean dislike
                        } else {
                            newData.push({ id: doc.id, data: { ...doc.data(), react: 0 } }); // 0 mean neutral
                        }
                    }
                    
                });
              
                setPosts(newData);

                // Update the last post for pagination
                if (docs.docs.length > 0) {
                    setLastPost(docs.docs[docs.docs.length - 1]);
                }
            };
            if (userData) {
                fetchUserPosts();
            }
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
        async function fetchStories() {
            const q = query(collection(db, 'stories'), orderBy('time'));
            const querySnapshot = await getDocs(q);
            const docs = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
            }));
            let tmp = {};
            docs.forEach((doc) => {
                if (tmp[doc.data.user.id]) {
                    tmp[doc.data.user.id].push(doc);
                } else {
                    tmp[doc.data.user.id] = [doc];
                }
            });
            setStories(tmp);
        }

        fetchStories();
    }, []);
    useEffect(() => {
        if (user && userData) {
            async function fetchSuggestedFr() {
                let fr = [user.uid];
                userData.user_friends.forEach((u) => {
                    fr.push(u.id);
                });
                fr.slice(0, 10);
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

            // chat realtime data
            const unsubscribeMessagesIconming = onSnapshot(
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
            const unsubscribeNotifications = onSnapshot(
                query(collection(db, 'users', user.uid, 'notifications'), orderBy('time', 'desc')),
                (docs) => {
                    let data1 = [];
                    let readNoti = 0;
                    docs.forEach((doc) => {
                        data1.push(doc.data());
                        if (!doc.data().read) {
                            readNoti++;
                        }
                    });
                    setNotifications({ data: data1, unread: readNoti });
                },
            );

            const unsubscribeStories = onSnapshot(query(collection(db, 'stories'), orderBy('time')), (docs) => {
                let tmp = {};
                docs.forEach((doc) => {
                    if (tmp[doc.data().user.id]) {
                        tmp[doc.data().user.id].push({ id: doc.id, data: doc.data() });
                    } else {
                        tmp[doc.data().user.id] = [{ id: doc.id, data: doc.data() }];
                    }
                });
                setStories(tmp);
            });

            return () => {
                unsubscribeMessagesIconming();
                unsubscribeNotifications();
                unsubscribeStories();
            };
        }
    }, [user, userData]);

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
    const createPost = async (files, title, text, tags, mentions, update = null) => {
        let docRef = null;
        if (update) {
            docRef = await updateDoc(doc(db, 'posts', update.id), {
                title: title,
                text: text,
                files: files,
                tags: tags,
                mentions: mentions,
                updated: true,
                hide: [],
            });
        } else {
            docRef = await addDoc(collection(db, 'posts'), {
                title: title,
                text: text,
                files: files,
                tags: tags,
                mentions: mentions,
                user: {
                    id: user.uid,
                    avatar: userData.user_avatar,
                    name: userData.user_name,
                },
                time: new Date(),
                like: { count: 0, list: [] },
                dislike: { count: 0, list: [] },
                commentNumber: 0,
                hide: [],
                updated: false,
            });
        }

        return docRef;
    };
    const fileDelete = async (path) => {
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
    };
    const fileUpload = ({ file, name, location = 'images', bg_upload = false }) => {
        return new Promise((resolve, reject) => {
            const storageRef = ref(storage, `${location}/${name}`);
            const uploadTask = uploadBytesResumable(storageRef, file, metadata.contentType);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    // console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            break;
                        case 'running':
                            break;
                        default:
                            break;
                    }
                },
                (error) => {
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    if (bg_upload) {
                        updateDoc(doc(db, 'users', user.uid), {
                            user_bg: downloadURL,
                        });
                        resolve('succesful');
                    } else {
                        resolve({ url: downloadURL, name: name }); // resolve the Promise with the downloaded URL
                    }
                },
            );
        });
    };
    const sendReport = async (content, id, rtype) => {
        const q = query(
            collection(db, 'users', adminId, 'notifications'),
            where('sender.id', '==', user.uid),
            where('url', '==', routes.post + id),
            where('title', '==', type.report + content),
        );
        getDocs(q).then(async (result) => {
            if (result.docs.length === 0) {
                await addDoc(collection(db, 'users', adminId, 'notifications'), {
                    title: type.report + content,
                    url: rtype === 'post' ? routes.post + id : routes.user + id,
                    sender: {
                        id: user.uid,
                        name: userData.user_name,
                        avatar: userData.user_avatar,
                    },
                    type: 'report',
                    time: serverTimestamp(),
                    read: false,
                });
            }
        });
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
    const handleAddfr = async ({ id, setDisabled }) => {
        try {
            await updateDoc(doc(db, 'users', id), {
                user_friendRequests: arrayUnion({
                    id: user.uid,
                    name: userData.user_name,
                    ava: userData.user_avatar,
                }),
            });

            await addDoc(collection(db, 'users', id, 'notifications'), {
                title: type.addfr,
                url: routes.user + user.uid,
                sender: {
                    id: user.uid,
                    name: userData.user_name,
                    avatar: userData.user_avatar,
                },
                type: 'addfr',
                time: serverTimestamp(),
                read: false,
            });

            setDisabled('Requesting');
        } catch (err) {
            console.log(err);
            alert(err);
        }
    };
    const deleteSavePost = async (id) => {
        await deleteDoc(doc(db, 'users', user.uid, 'saves', id));
    };

    const value = {
        lastPost,
        posts,
        notifications,
        refreshPosts,
        stories,
        scrollPositions,
        suggestedFr,
        contacts,
        setPosts,
        deleteSavePost,
        createPost,
        sendReport,
        setScrollPositions,
        setReFreshPosts,
        fetchMorePosts,
        unFriend,
        fileDelete,
        fileUpload,
        handleAccept,
        handleDecline,
        handleReadNoti,
        handleAddfr,
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
