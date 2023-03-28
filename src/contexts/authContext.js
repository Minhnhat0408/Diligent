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
            console.log(data);
        }

        if (user?.uid) {
            console.log('fetch ');
            fetchData();
        }
    }, [countUser, userData?.user_friendRequests]);

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
        });
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
    const userStateChanged = async () => {
        onAuthStateChanged(auth, async (currentUser) => {
            onSnapshot(query(collection(db, 'users'), where('user_status', '==', 'online')), (docs) => {
                setCountUser(docs.docs.length);
            });

            if (currentUser) {
                onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
                    console.log(doc.data());
                    setUserData(doc.data());
                });
                onSnapshot(
                    query(collection(db, 'users', currentUser.uid, 'notifications'), orderBy('time', 'desc')),
                    (docs) => {
                        let data1 = [];
                        let readNoti = 0;
                        console.log('hello');
                        docs.forEach((doc) => {
                            data1.push(doc.data());
                            if (!doc.data().read) {
                                readNoti++;
                            }
                        });
                        setNotifications({ data: data1, unread: readNoti });
                    },
                );
                const docdata = await getDoc(doc(db, 'users', currentUser.uid));
                setUserData(docdata.data());
                setUser(currentUser);
                await updateDoc(doc(userRef, currentUser.uid), {
                    user_status: 'online',
                });
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
        handleDecline,
        handleAccept,
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
