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
    setDoc,
    serverTimestamp,
    getDoc,
    onSnapshot,
    updateDoc,
    deleteDoc,
    deleteField,
} from 'firebase/firestore';
import { Fprovider, Gprovider, auth } from '../firebase';
import { db } from '../firebase';
import image from '~/assets/images';

import routes from '~/config/routes';
import { RingLoader } from 'react-spinners';
import { actionPrefersValue } from '~/utils/constantValue';
const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState();
    const [usersStatus, setUsersStatus] = useState();
    const createUser = async (email, password) => {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        const user = response.user;
        await setDoc(doc(db, 'status', user.uid), {
            user_status: 'online',
        });
        await setDoc(doc(db, 'preferences', user.uid), {});
        await setDoc(doc(db, 'users', user.uid), {
            user_email: user?.email,
            user_authProvider: response?.providerId || 'email/pasword',
            user_createdAt: serverTimestamp(),
            user_friendRequests: [],
            user_friends: [],
            user_postNumber: 0,
            user_ratings: [],
            user_decks: 0,
            user_theme: 'dark',
        });

        return response;
    };

    const signIn = async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
        // // Signed in
    };

    const logOut = async () => {
        if (usersStatus[user.uid].user_status !== 'ban') {
            await updateDoc(doc(db, 'status', user.uid), {
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
    const facebookSignIn = async () => {
        const response = await signInWithPopup(auth, Fprovider);
        const repuser = response.user;
        const docs = await getDoc(doc(db, 'users', repuser.uid));
        console.log(repuser);
        if (!docs.data()) {
            await setDoc(doc(db, 'status', repuser.uid), {
                user_status: 'online',
            });
            await setDoc(doc(db, 'preferences', repuser.uid), {});
            await setDoc(doc(db, 'users', repuser.uid), {
                user_email: repuser?.email,
                user_authProvider: response?.providerId,
                user_createdAt: serverTimestamp(),
                user_friendRequests: [],
                user_friends: [],
                user_postNumber: 0,
                user_ratings: [],
                user_decks: 0,
                user_theme: 'dark',
            });

            // navigate(routes.updateInfo)
            return false; // false means fresh account
        } 
        return true;
    };
    const googleSignIn = async () => {
        const response = await signInWithPopup(auth, Gprovider);
        const repuser = response.user;
        const docs = await getDoc(doc(db, 'users', repuser.uid));

        if (!docs.data()) {
            await setDoc(doc(db, 'status', repuser.uid), {
                user_status: 'online',
            });
            await setDoc(doc(db, 'preferences', repuser.uid), {});
            await setDoc(doc(db, 'users', repuser.uid), {
                user_email: repuser?.email,
                user_authProvider: response?.providerId,
                user_createdAt: serverTimestamp(),
                user_friendRequests: [],
                user_friends: [],
                user_postNumber: 0,
                user_ratings: [],
                user_decks: 0,
                user_theme: 'dark',
            });

            // navigate(routes.updateInfo)
            return false; // false means fresh account
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

    //save post handle

    const getUserPrefers = async () => {
        const pref = await getDoc(doc(db, 'preferences', user.uid));

        const tagPref = Object.entries(pref.data())
            .filter((entry) => entry[1] > 0)
            .sort((a, b) => b[1] - a[1]);

        return tagPref.map((tag) => tag[0]).slice(0, 5);
    };
    const updateUserPrefers = async (action, tags) => {
        const curPref = await getDoc(doc(db, 'preferences', user.uid));
        let newPref = {};
        tags.forEach((tag) => {
            if (curPref.data()[tag]) {
                newPref[tag] = curPref.data()[tag] + actionPrefersValue[action];
            } else {
                newPref[tag] = actionPrefersValue[action];
            }
        });
        await updateDoc(doc(db, 'preferences', user.uid), newPref);
    };

    useEffect(() => {
        // Subscribe to auth state changes to get the current user
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser({ ...currentUser, isAdmin: currentUser.uid === 'rFB2DyO43uTTjubLtoi8BhPQcNu1' });
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        const unsubscribeStatus = onSnapshot(collection(db, 'status'), async (stats) => {
            const a = {};
            stats.forEach((s) => {
                a[s.id] = s.data();
            });
            setUsersStatus(a);
            if(user){
                if (a[user.uid].user_status !== 'online') {
                    if (a[user.uid]?.user_banUntil && a[user.uid].user_banUntil.toMillis() < new Date()) {
                        console.log(a[user.uid]?.user_banUntil)
                        console.log(a[user.uid].user_banUntil.toMillis() < new Date())
                        await updateDoc(doc(db, 'users', user.uid), {
                            user_status: 'online',
                            user_banUntil: deleteField(),
                        });
                    }
                }
            }
            
        });

        return () => {
            unsubscribeAuth();
            unsubscribeStatus();
        };
    }, []);

    useEffect(() => {
        // Check if the user is logged in before setting up other real-time listeners

        if (user) {
            // Subscribe to userData changes
            const unsubscribeUserData = onSnapshot(doc(db, 'users', user.uid), (result) => {
                setUserData(result.data());
            });

            // Subscribe to usersStatus changes

            return () => {
                // Clean up all the real-time listeners when the component unmounts or when the user changes

                unsubscribeUserData();
            };
        }
    }, [user]);

    const value = {
        user,
        userData,
        usersStatus,
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
