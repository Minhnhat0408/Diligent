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
} from 'firebase/firestore';
import { auth } from '../firebase';
import { provider } from '../firebase';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import routes from '~/routes';
import image from '~/assets/images';



const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
    
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState();
    // const navigate = useNavigate();
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

    const signIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logOut = () => {
        return signOut(auth);
    };
    const updateProfile = async (data) => {
        
        await setDoc(doc(db, 'users',user.uid), {
           user_dob:data.dob,
           user_name:data.fullname,
           user_gender:data.gender,
           user_phone: data.phone,
           user_address:data.address,
           user_bio:data.bio,
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
            if (currentUser) {
                localStorage.setItem('user_id',currentUser.uid)
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
