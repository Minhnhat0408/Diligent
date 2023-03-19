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
    getCountFromServer
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
    const [countUser,setCountUser] = useState(0);       
     const userRef = collection(db,'users');

    const createUser = async (email, password) => {
      
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const user = response.user;
            console.log(response)
            console.log(user)
            await setDoc(doc(db, 'users', user.uid), {
                user_email: user?.email,
                user_authProvider: response?.providerId || 'email/pasword',
                user_createdAt: serverTimestamp(),
            });
            
            return response
      
    }; 

    const usersList = useMemo(async () => {
        const data = []
        const q = query(userRef,orderBy('user_name'));
        const docs = await getDocs(q);
        docs.forEach((doc) => {
            data.push({id:doc.id,data:doc.data()})
        })
        console.log(data)
        return data
    },[countUser])
    const signIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logOut = () => {
        return signOut(auth);
    };
    const updateProfile = async (data) => {
        
        await setDoc(doc(db, 'users',user.uid), {
           user_dob:data.dob,
           user_name:data.fullname.trimEnd(),
           user_gender:data.gender,
           user_phone: data.phone.trimEnd(),
           user_address:data.address.trimEnd(),
           user_bio:data.bio.trimEnd(),
           user_avatar:data.avatar ||  user?.photoURL || image.userUndefined,
           user_status: 'online',
           user_theme: 'light',
        },{merge:true});

    };
    
    const googleSignIn = async () => {
      
            const response = await signInWithPopup(auth, provider);
            const user = response.user;

            const docs = await getDoc(doc(db, 'users', user.uid));
            console.log(docs.data(), 'fefe');
            if (!docs.data()) {
                console.log('new');
          
                await setDoc(doc(db, 'users', user.uid), {
                    user_email: user?.email,
                    user_authProvider: response?.providerId,
                    user_createdAt: serverTimestamp(),
                });
       
                // navigate(routes.updateInfo) 
                return false;// false means fresh account
                
            }
            return true;
    };
    
    const userStateChanged = async () => {

        onAuthStateChanged(auth, async (currentUser) => {      
            const snapshot = await getCountFromServer(userRef);
            console.log(snapshot.data().count)
            setCountUser(snapshot.data().count)
            if (currentUser) {
                onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
                    setUserData(doc.data());
                    // console.log("data",doc.data());
                    // console.log("user" ,user)
                    // const dateObject = new Date(doc.data().user_createdAt.toMillis()+ 231231231);
                    // console.log(doc.data().user_createdAt)
                    // console.log(serverTimestamp())
                    // console.log(dateObject.toLocaleString())
                });
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
        updateProfile
    };

    return <UserContext.Provider value={value}>{!loading && children}</UserContext.Provider>;
};

export const UserAuth = () => {
    return useContext(UserContext);
};
