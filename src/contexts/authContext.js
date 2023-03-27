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
} from 'firebase/firestore';
import { auth } from '../firebase';
import { provider } from '../firebase';
import { db } from '../firebase';
import image from '~/assets/images';

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
        console.log(user);
        await setDoc(doc(db, 'users', user.uid), {
            user_email: user?.email,
            user_authProvider: response?.providerId || 'email/pasword',
            user_createdAt: serverTimestamp(),
        });

        return response;
    };

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
        }

        if (user?.uid) {
            console.log('fetch ');
            fetchData();
        }
    }, [countUser]);

    const handleReadNoti = async (data) => {
        console.log('read');
        const q = query(collection(db, 'users', user?.uid, 'notifications'), where('sender.id', '==', data.sender.id));
        const docs = await getDocs(q);
        await updateDoc(doc(db, 'users', user?.uid, 'notifications', docs.docs[0].id), {
            read: true,
        });
        await getDocs(collection(db, 'users', user?.uid, 'notifications')).then((docs) => {
            let data1 = [];
            let readNoti = 0;
            docs.forEach((doc) => {
                data1.push(doc.data());
                if (!doc.data().read) {
                    readNoti++;
                }
            });
            setNotifications({ data: data1, unread: readNoti });
        });
    };
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
        await setDoc(
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
            { merge: true },
        );
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
                await updateDoc(doc(userRef,currentUser.uid),{
                    user_status: 'online'
                })
                
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
