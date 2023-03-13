import { createContext, useContext, useEffect, useState } from 'react';
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
import { addDoc, collection, doc, getDocs, setDoc, serverTimestamp,query, where,getDoc,onSnapshot } from 'firebase/firestore';
import { auth } from '../firebase';
import { provider } from '../firebase';
import { db } from '../firebase';

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const usersRef = collection(db, 'users');
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [userData,setUserData] = useState();
    const createUser = async (email, password) => {
        try {
            const response = createUserWithEmailAndPassword(auth, email, password);
            const user = response.user;
            const q = query(usersRef, where('uid', '==', user.uid));
            const docs = await getDocs(q);
            console.log(doc);
            if (docs.docs.length === 0) {
                await setDoc(doc(db, 'users', user.uid), {
                    user_name: '',
                    user_email: user?.email,
                    user_avatar: '',
                    user_authProvider: response?.providerId,
                    user_createdAt: serverTimestamp(),
                    user_status: 'offline',
                    user_bio: '',
                });
            }
        } catch (error) {
            alert(error.message);
            console.log(error.message);
        }
    };

    const signIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logOut = () => {
        return signOut(auth);
    };

    const googleSignIn = async () => {
        try {
            const response = await signInWithPopup(auth, provider);
            const user = response.user;
            
            const docs = await getDoc(doc(db,"users",user.uid));
            console.log(docs.data(),'fefe')
            if (!docs) {
                console.log("new")
                await setDoc(doc(db, 'users', user.uid), {
                    user_name: user?.displayName,
                    user_email: user?.email,
                    user_avatar: user?.photoURL,
                    user_authProvider: response?.providerId,
                    user_createdAt: serverTimestamp(),
                    user_status: 'offline',
                    user_bio: '',
                });
            }
        } catch (error) {
            alert(error.message);
            console.log(error.message);
        }
    };

    const userStateChanged = async () => {
        onAuthStateChanged(auth, async (currentUser) => {
          if (currentUser) {
            await onSnapshot(doc(db,"users",currentUser.uid), (doc) => {
                setUserData(doc.data());
                console.log(doc.data());
                const dateObject = new Date(doc.data().user_createdAt.toMillis());
                console.log(dateObject.toLocaleString())
              });
            setUser(user);
            
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
  
    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    //         console.log(currentUser);
    //         if (currentUser) {
    //             onSnapshot(doc(db,"users",currentUser.uid), (doc) => {
    //             setUserData(doc.data());
    //           });
    //           setUser(currentUser);
    //         }
       
    //         setLoading(false);
    //     });
    //     return () => {
    //         unsubscribe();
    //     };
    // }, []);

    const value = {
        user,
        userData,
        signIn,
        logOut,
        createUser,
        googleSignIn,
    };

    return <UserContext.Provider value={value}>{!loading && children}</UserContext.Provider>;
};

export const UserAuth = () => {
    return useContext(UserContext);
};
