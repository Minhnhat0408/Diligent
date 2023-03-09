import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import SidebarMenuItems from '../components/SidebarMenuItems';

const cx = classNames.bind(styles);

function Sidebar() {
    return (
        <aside className={cx('wrapper')}>
            <div className={cx('menu-wrapper')}>
                <h4 className={cx('menu-header')}>New Feeds</h4>
                <SidebarMenuItems/>
            </div>
        </aside>
    );
}

export default Sidebar;
