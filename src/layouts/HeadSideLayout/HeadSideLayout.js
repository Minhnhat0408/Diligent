import { useContext } from "react";
import classNames from 'classnames/bind'
import styles from './HeadSideLayout.module.scss'
import SideBarRight from "../components/SideBarRight";
import { ThemeContext } from "~/contexts/Context";
const cx = classNames.bind(styles)

function HeadSideLayout({children}) {
    const context = useContext(ThemeContext)
  return (

      <div className={cx('container')}>
        <div className={cx('content',{'dark':context.theme === 'dark'})}>
          {children}
          </div>
        <SideBarRight />
      </div>
 
  );
}

export default HeadSideLayout;
