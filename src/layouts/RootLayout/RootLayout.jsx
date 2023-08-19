import { useContext } from "react";
import Header from "../components/Header";
import { ThemeContext } from "~/contexts/Context";
import { Outlet } from "react-router-dom";

function RootLayout() {
    
    const context = useContext(ThemeContext)
    return ( 
        <div className={'flex flex-col transition-colors duration-[0.8s]'  +  (context.theme ==='dark' ? ' bg-[var(--bg-dark-theme)]' : ' bg-[var(--bg-light-theme)]')} >
        <Header/>
        <Outlet/>
        </div>
     );
}

export default RootLayout;