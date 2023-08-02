import { createContext, useContext, useEffect, useRef, useState } from 'react';
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
    or,
    limit,
    startAfter,
    documentId,
} from 'firebase/firestore';
import { Fprovider, Gprovider, auth } from '../firebase';
import { db } from '../firebase';
import image from '~/assets/images';
import type from '~/config/typeNotification';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import routes from '~/config/routes';
import { RingLoader } from 'react-spinners';
import { actionPrefersValue, adminId } from '~/utils/constantValue';
const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [stories, setStories] = useState({});
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState();
    const [notifications, setNotifications] = useState();
    const userRef = collection(db, 'users');
    const [usersList, setUsersList] = useState();
    const [usersStatus,setUsersStatus] = useState();
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
        });
        await setDoc(doc(db,'users',user.uid) , {
            user_status:'online'
        })
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
            // data.forEach(async (d) => {
            //     await updateDoc(doc(db,'status',d.id), {
            //         user_status:'offline',
            //         lastOnline:new Date(2023,6,31,12,30,0),
            //     })
            // })
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


        fetchUserData();
        fetchStories();
    }, []);
    const signIn = async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
        // // Signed in
    };
    
    const logOut = async () => {
        if (usersStatus[user.uid].user_status !== 'ban') {
            await updateDoc(doc(db,'status',user.uid), {
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
                user_theme: 'dark',
                user_friendRequests: [],
                user_friends: [],
                user_postNumber: 0,
                user_ratings: [],
                user_decks: 0,
            });
            await setDoc(doc(db,'preferences',user.uid),{})
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
    const facebookSignIn = async () => {
        const response = await signInWithPopup(auth, Fprovider);
        const repuser = response.user;
        const docs = await getDoc(doc(db, 'users', repuser.uid));
        console.log(repuser);
        if (!docs.data()) {
            await setDoc(doc(db, 'users', repuser.uid), {
                user_email: repuser?.email,
                user_authProvider: response?.providerId,
                user_createdAt: serverTimestamp(),
            });

            // navigate(routes.updateInfo)
            return false; // false means fresh account
        } else {
            await updateDoc(doc(db,'status',repuser.uid), {
                user_status: 'online',
            });
        }
        return true;
    };
    const googleSignIn = async () => {
        const response = await signInWithPopup(auth, Gprovider);
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
            await updateDoc(doc(db,'status',repuser.uid), {
                user_status: 'online',
            });
        }
        return true;
    };
    
    const banUser = async ({ id, duration }) => {
        await updateDoc(doc(db, 'status', id), {
            user_status: 'ban',
            user_banUntil: duration,
        });
    };
    const unbanUser = async ({ id }) => {
        await updateDoc(doc(db, 'status', id), {
            user_status: 'offline',
            user_banUntil: deleteField(),
        });
    };
    const fileDelete = async (path) => {
        const storageRef = ref(storage, path);
        console.log(storageRef);
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
    const getUserPrefers = async () => {
        const pref = await getDoc(doc(db, 'preferences', user.uid));

        const tagPref = Object.entries(pref.data())
            .filter((entry) => entry[1] > 0)
            .sort((a, b) => b[1] - a[1]);

        return tagPref.map((tag) => tag[0]).slice(0, 5);
    };
    const updateUserPrefers = async (action,tags) =>{
        
        const curPref = await getDoc(doc(db, 'preferences', user.uid));
        let newPref ={}
        tags.forEach((tag) => {
            if (curPref.data()[tag]) {
                newPref[tag] = curPref.data()[tag] + actionPrefersValue[action];
            } else {
                newPref[tag] = actionPrefersValue[action];
            }
        });
        await updateDoc(doc(db, 'preferences', user.uid), newPref);
    }
    //send report
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

                //fetch user data change realtime
                onSnapshot(doc(db, 'users', currentUser.uid), async (result) => {
                    console.log('data of user change');

                    setUserData(result.data());

                    
                });
                onSnapshot(collection(db,'status'), async (stats) => {
                    const a = {}
                    stats.forEach((s) => {
                        a[s.id] = s.data()
                    })
           
                    
                    setUsersStatus(a)
                    if (a[currentUser.uid].user_status !== 'online') {
                        if (a[currentUser.uid]?.user_banUntil && a[currentUser.uid].user_banUntil.toMillis() < new Date()) {
                            await updateDoc(doc(db, 'users', currentUser.uid), {
                                user_status: 'online',
                                user_banUntil: deleteField(),
                            });
                        }
                    }
                })
                //fetch user notifications realtime
                onSnapshot(
                    query(collection(db, 'users', currentUser.uid, 'notifications'), orderBy('time', 'desc')),
                    (docs) => {
                        let data1 = [];
                        let readNoti = 0;
                        docs.forEach((doc) => {
                            data1.push(doc.data());
                            if (!doc.data().read) {
                                readNoti++;
                            }
                        });
                        setNotifications({ id: doc.id, data: data1, unread: readNoti });
                    },
                );
      
                if (window.location.pathname !== routes.updateInfo)
                    await updateDoc(doc(db, 'status', currentUser.uid), {
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
        stories,
        notifications,
        usersStatus,
        fileUpload,
        fileDelete,
        sendReport,
        createPost,
        deleteSavePost,
        banUser,
        unbanUser,
        signIn,
        logOut,
        getUserPrefers,
        updateUserPrefers,
        createUser,
        googleSignIn,
        facebookSignIn,
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
