import { useState } from 'react';
import { UserAuth } from './authContext';
import { PostContext, ThemeContext } from './Context';
import { addDoc, arrayUnion, collection, deleteDoc, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '~/firebase';

export function ThemeProvider({ children }) {
    const { userData, user,usersList} = UserAuth();
    const [theme, setTheme] = useState('light');

    const toggleTheme = async () => {
        if (user) {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                user_theme: userData.user_theme === 'dark' ? 'light' : 'dark',
            });
        }

        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme: userData?.user_theme || theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function PostProvider({ id, data, children, page = false }) {
    const [loading, setLoading] = useState(false);
    const [update, setUpdate] = useState(0);
    const { user, usersList } = UserAuth();
  

    const deletePost = async (id,uid) => {

        await deleteDoc(doc(db, 'posts', id));
        await updateDoc(doc(db, 'users', uid), {
            user_postNumber: usersList.filter((obj) => obj.id === uid)[0].data.user_postNumber - 1,
        });
    };
    const hidePost = async (id) => {
        await updateDoc(doc(db, 'posts', id), {
            hide: arrayUnion(user.uid),
        });
    };
    const savePost = async (id, data) => {
        await setDoc(doc(db, 'users', user.uid, 'saves', id), {
            title: data.title,
            tags: data.tags,
            user: {
                name: data.user.name,
                avatar: data.user.avatar,
            },
            time:serverTimestamp(),
        });
    };
    const value = {
        loading,
        setLoading,
        update,
        setUpdate,
        id,
        data,
        page,
        deletePost,
        savePost,
        hidePost
    };
    return (
        <PostContext.Provider value={value}>
            <>{children}</>
        </PostContext.Provider>
    );
}
