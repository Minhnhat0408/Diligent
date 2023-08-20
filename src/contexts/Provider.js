import {useState } from 'react';
import { UserAuth } from './authContext';
import { PostContext, ThemeContext } from './Context';
import { arrayUnion, deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '~/firebase';
import TodoList from '~/component/TodoList/TodoList';

export function ThemeProvider({ children }) {

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') ? localStorage.getItem('theme') : 'dark'
    });
    const [todoList,setTodoList] = useState(false)
 
    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };
    return (
        <ThemeContext.Provider value={{ theme:  theme, toggleTheme,todoList,setTodoList }}>
            {todoList && <TodoList/>}
            {children}
        </ThemeContext.Provider>
    );
}

export function PostProvider({ id, data, children,setUpdate,setReFresh, page = false }) {
    const [loading, setLoading] = useState(false);
    const [cmtLoading,setCmtLoading]  = useState(false)
    const { user } = UserAuth();
  

    const deletePost = async (id,uid) => {

        await deleteDoc(doc(db, 'posts', id));
        const pnum = await getDoc(doc(db,'users',uid))
     
        await updateDoc(doc(db, 'users', uid), {
            user_postNumber: pnum.data().user_postNumber -1,
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
        cmtLoading,
        setCmtLoading,
        setLoading,
        setUpdate,
        setReFresh,
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
