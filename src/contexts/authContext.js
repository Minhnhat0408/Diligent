import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateCurrentUser,
    updateProfile,
    GoogleAuthProvider,
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
    getCountFromServer,
    updateDoc,
} from 'firebase/firestore';
import { auth } from '../firebase';
import { provider } from '../firebase';
import { db } from '../firebase';

import image from '~/assets/images';
import { async } from '@firebase/util';

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState();
    const [countUser, setCountUser] = useState(0);
    const userRef = collection(db, 'users');
    const [usersList, setUsersList] = useState();
    const createUser = async (email, password) => {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        const user = response.user;
        console.log(response);
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
                data.push({ id: doc.id, data: doc.data() });
            });
            setUsersList(data);
        }
        fetchData();
    }, [countUser]);

    const signIn = async (email, password) => {
        const newUser = await signInWithEmailAndPassword(auth, email, password);
        return updateDoc(doc(db, 'users', newUser.user.uid), {
            user_status: 'online'
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
                user_friendRequests:[],
                user_friends:[]
            },
            { merge: true },
        );
    };

    const googleSignIn = async () => {
        const response = await signInWithPopup(auth, provider);
        const repuser = response.user;

        const docs = await getDoc(doc(db, 'users', repuser.uid));
        console.log(docs.data(), 'fefe');
        if (!docs.data()) {
            console.log('new');

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
            onSnapshot(query(collection(db,'users'),where('user_status','==',"online")),(docs) => {
                setCountUser(docs.docs.length);
            })
            
            if (currentUser) {
                onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
                    console.log(doc.data())
                    setUserData(doc.data());
                });
                const docdata = await getDoc(doc(db, 'users', currentUser.uid));
                setUserData(docdata.data());
                setUser(currentUser);
                
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
