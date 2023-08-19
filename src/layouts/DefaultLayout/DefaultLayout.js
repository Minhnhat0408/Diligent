import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import SideBarLeft from './SideBarLeft';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
import SideBarRight from '../components/SideBarRight';


const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    const context = useContext(ThemeContext);
    return (
        <div className={cx('container') + ' sml-max:mt-16'}>
            <SideBarLeft />
            <div className={cx('content', { dark: context.theme === 'dark' })}>{children}</div>
            <SideBarRight />
        </div>
    );
}
DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
export default DefaultLayout;
