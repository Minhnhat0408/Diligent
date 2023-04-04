import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import Header from '../components/Header';
import SideBarLeft from './SideBarLeft';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
import SideBarRight from '../components/SideBarRight';
const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    const context = useContext(ThemeContext);
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <SideBarLeft />
                <div className={cx('content', { dark: context.theme === 'dark' })}>{console.log('rerender')}{children}</div>
                <SideBarRight />
            </div>
        </div>
    );
}
DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
export default DefaultLayout;
