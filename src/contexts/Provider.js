import { useReducer, useState } from "react";
import Context,{ThemeContext} from "./Context";



function ThemeProvider({children}) {
    const [theme, setTheme] = useState('light')

    const toggleTheme = () => {
        setTheme(theme ==='dark' ? 'light':'dark')
    }
    return (
        <ThemeContext.Provider value={{theme,toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
} 


export default ThemeProvider