import { useContext } from "react";
import { ThemeContext } from "~/contexts/Context";

function DocumentLoading() {
    const context = useContext(ThemeContext)
    return (  <div className={"bg-[var(--light-theme)] p-5 mb-5 rounded-[20px] flex flex-col animate-pulse relative shadow-md" + (context.theme === 'dark' ? " !bg-[var(--dark-theme)] " :'')}>
        <div className="flex max-w-[95%] mb-5 ">
            <div className={"bg-[#999] h-7 rounded-xl w-72 " + (context.theme === 'dark' && " !bg-[var(--bg-dark-theme)] ")}>

            </div>
        </div>
        <div className="flex ">
            <div className={"bg-[#999] h-5 rounded-xl w-32 mr-4 " + (context.theme === 'dark' && " !bg-[var(--bg-dark-theme)] ")}>

            </div>
            <div className={"bg-[#999] h-5 rounded-xl w-32  " + (context.theme === 'dark' && " !bg-[var(--bg-dark-theme)] ")}>

            </div>
        </div>
        <div className={"absolute right-8 top-[30%] rounded-full w-12 h-12 bg-[#999] " + (context.theme === 'dark' && " !bg-[var(--bg-dark-theme)] ")}> 
            
        </div>
    </div>  );
}

export default DocumentLoading;