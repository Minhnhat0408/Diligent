import { createContext, useContext, useEffect, useMemo, useState } from 'react';
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
} from 'firebase/firestore';
import { auth } from '../firebase';
import { provider } from '../firebase';
import { db } from '../firebase';
import image from '~/assets/images';
import type from '~/config/typeNotification';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import routes from '~/config/routes';
const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState();
    const [countUser, setCountUser] = useState(0);
    const [notifications, setNotifications] = useState();
    const userRef = collection(db, 'users');
    const [usersList, setUsersList] = useState();
    const storage = getStorage();
    const metadata = {
        contentType: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'],
    };
    const createUser = async (email, password) => {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        const user = response.user;
        // console.log(user);
        await setDoc(doc(db, 'users', user.uid), {
            user_email: user?.email,
            user_authProvider: response?.providerId || 'email/pasword',
            user_createdAt: serverTimestamp(),
        });
        return response;
    };

    //fetch users list
    useEffect(() => {
        const data = [];
        const q = query(userRef, orderBy('user_name'));
        async function fetchData() {
            
        console.log('fetch user list');
            const docs = await getDocs(q);
            docs.forEach((doc) => {

                
                    if (
                        doc.data().user_friends.some((doc) => {
                            return doc?.id === user?.uid;
                        })
                    ) {
                        data.push({ id: doc.id, data: doc.data(), friend: true });
                    } else {
                        data.push({ id: doc.id, data: doc.data(), friend: false });
                    }
              
               
            });
            setUsersList(data);
        }
        if(user?.uid) {
            fetchData();
        }
    }, [countUser, userData?.user_friendRequests]);

    useEffect(() => {
        const data = [];
        const q = query(userRef, orderBy('user_name'));
        async function fetchData() {
            
        console.log('fetch user list first time');
            const docs = await getDocs(q);
            docs.forEach((doc) => {
                data.push({id: doc.id, data: doc.data()})
               
            });
            setUsersList(data);
        }
  
            fetchData();
    }, [])
    const signIn = async (email, password) => {
        const newUser = await signInWithEmailAndPassword(auth, email, password);
        return updateDoc(doc(db, 'users', newUser.user.uid), {
            user_status: 'online',
        });
        // // Signed in
    };
    const logOut = async () => {
        await updateDoc(doc(userRef, user.uid), {
            user_status: 'offline',
        });
        return signOut(auth);
    };
    const updateProfile = async (data) => {
        if (window.location.pathname === routes.updateInfo) {
            console.log(user,user?.uid)
            await updateDoc(
                doc(db, 'users', user.uid),
                {
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
                },
            );
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
        console.log('read');
        const q = query(
            collection(db, 'users', user?.uid, 'notifications'),
            where('sender.id', '==', data.sender.id),
            where('read', '==', false),
        );
        const docs = await getDocs(q);
        await updateDoc(doc(db, 'users', user?.uid, 'notifications', docs.docs[0].id), {
            read: true,
        });
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
    const fileUpload = (file, name) => {
        const storageRef = ref(storage, `images/${name}`);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata.contentType);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        break;
                }
            },
            (error) => {
                alert(error);
            },
            async () => {
                await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    updateDoc(doc(db, 'users', user.uid), {
                        user_bg: downloadURL,
                    });
                });
            },
        );
    };
    const userStateChanged = async () => {
        onAuthStateChanged(auth, async (currentUser) => {
            onSnapshot(query(collection(db, 'users'), where('user_status', '==', 'online')), (docs) => {
                setCountUser(docs.docs.length);
                console.log('some user online offline');
            });

            if (currentUser) {
                setUser(currentUser);
                await updateDoc(doc(userRef, currentUser.uid), {
                    user_status: 'online',
                });
                const docdata = await getDoc(doc(db, 'users', currentUser.uid));
                setUserData(docdata.data());
                console.log('helllo')
                onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
                    console.log('data of user change');
                    setUserData(doc.data());
                });
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
                        setNotifications({ data: data1, unread: readNoti });
                    },
                );
                
      
            } else {
                setUser(null);
            }

            setLoading(false);
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
        notifications,
        handleReadNoti,
        fileUpload,
        handleDecline,
        handleAccept,
        unFriend,
        signIn,
        logOut,
        createUser,
        googleSignIn,
        updateProfile,
    };

    return <UserContext.Provider value={value}>{!loading && children}</UserContext.Provider>;
};

export const UserAuth = () => {
    return useContext(UserContext);
};
