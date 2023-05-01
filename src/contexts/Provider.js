import { useState } from 'react';
import { UserAuth } from './authContext';
import { PostContext, ThemeContext } from './Context';
import { addDoc, arrayUnion, collection, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '~/firebase';

export function ThemeProvider({ children }) {
    const { userData, user } = UserAuth();
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
    const { user, userData } = UserAuth();
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

    const deletePost = async (id) => {
        await deleteDoc(doc(db, 'posts', id));
        await updateDoc(doc(db, 'users', user.uid), {
            user_postNumber: userData.user_postNumber - 1,
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
        createPost,
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
