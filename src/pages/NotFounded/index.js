import { useContext } from "react";
import { ThemeContext } from "~/contexts/Context";

function NotFounded() {
  const context = useContext(ThemeContext)
  return (
    <div className={"mt-[20vh] w-full flex flex-col items-center justify-center " + (context.theme == 'dark' && ' text-[var(--text-color-dark)]') }>
      <h1 className="text-[100px]">404</h1>
      <h3 className="text-[60px]">Page Not Found</h3>
    </div>
  );
}

export default NotFounded;
