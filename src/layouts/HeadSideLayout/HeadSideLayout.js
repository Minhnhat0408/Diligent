import { useContext } from "react";
import classNames from 'classnames/bind'
import styles from './HeadSideLayout.module.scss'
import Header from "../components/Header";
import SideBarRight from "../components/SideBarRight";
import { ThemeContext } from "~/contexts/Context";
const cx = classNames.bind(styles)

function HeadSideLayout({children}) {
    const context = useContext(ThemeContext)
  return (
    <div className={cx('wrapper',{dark:context.theme === 'dark'})}>
      <Header />
      <div className={cx('container')}>
        <div className={cx('content',{'dark':context.theme === 'dark'})}>
          {children}
          </div>
        <SideBarRight />
      </div>
    </div>
  );
}

export default HeadSideLayout;
