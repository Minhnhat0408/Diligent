import { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInWithPopup,
} from 'firebase/auth';
import {
    addDoc,
    collection,
    doc,
    getDocs,
    setDoc,
    serverTimestamp,
    query,
    where,
    getDoc,
    onSnapshot,
    orderBy,
    updateDoc,
    arrayRemove,
    arrayUnion,
    deleteDoc,
    deleteField,
    limit,
} from 'firebase/firestore';
import { auth } from '../firebase';
import { provider } from '../firebase';
import { db } from '../firebase';
import image from '~/assets/images';
import type from '~/config/typeNotification';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import routes from '~/config/routes';
import { RingLoader } from 'react-spinners';
import { adminId } from '~/utils/constantValue';
const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [stories, setStories] = useState();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState();
    const [notifications, setNotifications] = useState();
    const [savePostData, setSavePostData] = useState([]);
    const [posts, setPosts] = useState();

    const userRef = collection(db, 'users');
    const [usersList, setUsersList] = useState();
    const storage = getStorage();
    const metadata = {
        contentType: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'],
    };
    const createUser = async (email, password) => {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        const user = response.user;
        await setDoc(doc(db, 'users', user.uid), {
            user_email: user?.email,
            user_authProvider: response?.providerId || 'email/pasword',
            user_createdAt: serverTimestamp(),
            user_status: 'online',
        });
        return response;
    };

    useEffect(() => {
        async function fetchUserData() {
            const data = [];
            const q = query(userRef, orderBy('user_name'));
            const docs = await getDocs(q);
            docs.forEach(async (d) => {
                data.push({ id: d.id, data: d.data() });
            });
            setUsersList(data);
        }
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
        async function fetchPosts() {
            const data = [];
            const q = query(collection(db, 'posts'), orderBy('time', 'desc'));
            const docs = await getDocs(q);
            docs.forEach((doc) => {
                data.push({ id: doc.id, data: doc.data() });
            });
            setPosts(data);
        }

        fetchUserData();
        fetchPosts();
        fetchStories();
    }, []);
    const signIn = async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
        // // Signed in
    };
    const logOut = async () => {
        if (userData.user_status !== 'ban') {
            await updateDoc(doc(userRef, user.uid), {
                user_status: 'offline',
            });
        }
        await signOut(auth);
    };
    const updateProfile = async (data) => {
        if (window.location.pathname === routes.updateInfo) {
            await updateDoc(doc(db, 'users', user.uid), {
                user_dob: data.dob,
                user_name: data.fullname.trimEnd(),
                user_gender: data.gender,
                user_phone: data.phone.trimEnd(),
                user_address: data.address.trimEnd(),
                user_bio: data.bio.trimEnd(),
                user_avatar: data.avatar || user?.photoURL || image.userUndefined,
                user_status: 'online',
                user_theme: 'light',
                user_friendRequests: [],
                user_friends: [],
                user_postNumber: 0,
                user_ratings: [],
                user_decks: 0,
            });
        } else {
            await updateDoc(doc(db, 'users', user.uid), {
                user_dob: data.dob,
                user_name: data.fullname.trimEnd(),
                user_gender: data.gender,
                user_phone: data.phone.trimEnd(),
                user_address: data.address.trimEnd(),
                user_bio: data.bio.trimEnd(),
                user_avatar: data.avatar || user?.photoURL || image.userUndefined,
            });
        }
    };

    const googleSignIn = async () => {
        const response = await signInWithPopup(auth, provider);
        const repuser = response.user;
        const docs = await getDoc(doc(db, 'users', repuser.uid));

        if (!docs.data()) {
            await setDoc(doc(db, 'users', repuser.uid), {
                user_email: repuser?.email,
                user_authProvider: response?.providerId,
                user_createdAt: serverTimestamp(),
            });

            // navigate(routes.updateInfo)
            return false; // false means fresh account
        } else {
            await updateDoc(doc(userRef, repuser.uid), {
                user_status: 'online',
            });
        }
        return true;
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
    const banUser = async ({ id, duration }) => {
        await updateDoc(doc(db, 'users', id), {
            user_status: 'ban',
            user_banUntil: duration,
        });
    };
    const unbanUser = async ({ id }) => {
        await updateDoc(doc(db, 'users', id), {
            user_status: 'offline',
            user_banUntil: deleteField(),
        });
    };

    const fileUpload = ({ file, name, location = 'images', bg_upload = false }) => {
        return new Promise((resolve, reject) => {
            const storageRef = ref(storage, `${location}/${name}`);
            const uploadTask = uploadBytesResumable(storageRef, file, metadata.contentType);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    console.log('Upload is ' + progress + '% done');
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
    //save post handle
    const deleteSavePost = async (id) => {
        await deleteDoc(doc(db, 'users', user.uid, 'saves', id));
    };

    //send report
    const sendReport = async (content, id, rtype) => {
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
    };
    // update realtime database when changes happen
    const userStateChanged = async () => {
        onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser({ ...currentUser, isAdmin: currentUser.uid === 'rFB2DyO43uTTjubLtoi8BhPQcNu1' });
                //fetch user list realtime
                onSnapshot(query(collection(db, 'users'), orderBy('user_name')), async (docs) => {
                    const data = [];
                    console.log('fetch user list or someone online/offline');
                    docs.forEach((doc) => {
                        if (
                            doc.data().user_friends.some((doc) => {
                                return doc?.id === currentUser.uid;
                            })
                        ) {
                            data.push({ id: doc.id, data: doc.data(), friend: true });
                        } else {
                            data.push({ id: doc.id, data: doc.data(), friend: false });
                        }
                    });
                    setUsersList(data);
                });
                onSnapshot(query(collection(db, 'stories'), orderBy('time')), (docs) => {
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
                // fetch posts change realtime
                onSnapshot(query(collection(db, 'posts')), (docs) => {
                    let data1 = [];
                    console.log('posts change');
                    docs.forEach((doc) => {
                        if (
                            doc.data().like.list.some((u) => {
                                return u.id === currentUser.uid;
                            })
                        ) {
                            data1.push({ id: doc.id, data: { ...doc.data(), react: 1 } }); // 1 mean like
                        } else if (
                            doc.data().dislike.list.some((u) => {
                                return u.id === currentUser.uid;
                            })
                        ) {
                            data1.push({ id: doc.id, data: { ...doc.data(), react: -1 } }); // -1 mean dislike
                        } else {
                            data1.push({ id: doc.id, data: { ...doc.data(), react: 0 } }); // 0 mean neutral
                        }
                    });
                    data1.sort((a, b) => b.data.time.seconds - a.data.time.seconds);
                    setPosts(data1);
                });
                //fetch user data change realtime
                onSnapshot(doc(db, 'users', currentUser.uid), async (result) => {
                    console.log('data of user change');

                    setUserData(result.data());

                    if (result.data().user_status !== 'online') {
                        if (result.data()?.user_banUntil && result.data().user_banUntil.toMillis() < new Date()) {
                            await updateDoc(doc(db, 'users', currentUser.uid), {
                                user_status: 'online',
                                user_banUntil: deleteField(),
                            });
                        }
                    }
                });
                //fetch user notifications realtime
                onSnapshot(
                    query(collection(db, 'users', currentUser.uid, 'notifications'), orderBy('time', 'desc')),
                    (docs) => {
                        let data1 = [];
                        let readNoti = 0;
                        console.log('notification change');
                        docs.forEach((doc) => {
                            data1.push(doc.data());
                            if (!doc.data().read) {
                                readNoti++;
                            }
                        });
                        setNotifications({ id: doc.id, data: data1, unread: readNoti });
                    },
                );
                // fetch savepost realtime
                onSnapshot(query(collection(db, 'users', currentUser.uid, 'saves'), orderBy('title')), (docs) => {
                    console.log('save post change');
                    const result = docs.docs.map((doc) => {
                        return { id: doc.id, data: doc.data() };
                    });
                    setSavePostData(result);
                });
                if (window.location.pathname !== routes.updateInfo)
                    await updateDoc(doc(db, 'users', currentUser.uid), {
                        user_status: 'online',
                    });
            } else {
                setUser(null);
            }

            // proximate the loading time
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        });
    };

    useEffect(() => {
        userStateChanged();
        return () => userStateChanged();
    }, []);

    const value = {
        usersList,
        user,
        userData,
        posts,
        stories,
        notifications,
        savePostData,
        handleReadNoti,
        fileUpload,
        sendReport,
        createPost,
        deleteSavePost,
        handleDecline,
        handleAccept,
        unFriend,
        banUser,
        unbanUser,
        signIn,
        logOut,
        createUser,
        googleSignIn,
        updateProfile,
    };

    return (
        <UserContext.Provider value={value}>
            {loading ? (
                <div className="pop-up loader">
                    <RingLoader color="#367fd6" size={150} speedMultiplier={0.5} />
                </div>
            ) : (
                children
            )}
        </UserContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(UserContext);
};
