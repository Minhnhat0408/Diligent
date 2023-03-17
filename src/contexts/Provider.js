import {  useState } from 'react';
import { UserAuth } from './authContext';
import  { ThemeContext } from './Context';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '~/firebase';

function ThemeProvider({ children }) {
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

export default ThemeProvider;
