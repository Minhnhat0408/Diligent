import Header from '../components/Header';
import classNames from 'classnames/bind';
import styles from './HeaderOnly.module.scss';
import { ThemeContext } from "~/contexts/Context";
import { useContext } from "react";

const cx = classNames.bind(styles)

function HeaderOnly({ children }) {
  const context = useContext(ThemeContext)
  return (
    <div className={cx('wrapper')}>
      <Header />
      <div className={cx('container')}>
        <div className={cx('content',{'dark':context.theme === 'dark'})}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default HeaderOnly;