import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import SidebarMenuItems from 'src/layouts/components/SidebarMenuItems';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBoxArchive,
    faClock,
    faEnvelope,
    faGear,
    faIdBadge,
    faInbox,
    faLightbulb,
    faMessage,
    faTv,
    faTvAlt,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';

const cx = classNames.bind(styles);

function Sidebar() {
    const context = useContext(ThemeContext);
    return (
        <aside className={cx('wrapper',{ [context.theme]: context.theme === 'dark' })}>
            {/* New feed  */}
            <div className={cx('menu-wrapper')}>
                <h4 className={cx('menu-header')}>New Feeds</h4>
                {/* prop color de xet background cho icon  */}
                <SidebarMenuItems
                    icon={<FontAwesomeIcon icon={faTvAlt} />}
                    title="Newsfeed"
                    backGroundColor="linear-gradient(to right, #0575e6, #021b79)"
                    color="#fff"
                    numsNotify={590}
                />
                <SidebarMenuItems
                    icon={<FontAwesomeIcon icon={faIdBadge} />}
                    title="Badges"
                    backGroundColor="linear-gradient(to right, #e44d26, #f16529)"
                    color="#fff"
                />
                <SidebarMenuItems
                    icon={<FontAwesomeIcon icon={faBoxArchive} />}
                    title="Explore Stories"
                    backGroundColor="linear-gradient(to right, #f2994a, #f2c94c)"
                    color="#fff"
                />
                <SidebarMenuItems
                    icon={<FontAwesomeIcon icon={faLightbulb} />}
                    title="Groups"
                    backGroundColor="linear-gradient(to right, #ee0979, #ff6a00)"
                    color="#fff"
                />
                <SidebarMenuItems
                    icon={<FontAwesomeIcon icon={faUser} />}
                    title="Author Profile"
                    backGroundColor="linear-gradient(135deg, #05f, #09f)"
                    color="#fff"
                />
            </div>

            {/* More pages */}
            <div className={cx('menu-wrapper')}>
                <h4 className={cx('menu-header')}>More pages</h4>
                <SidebarMenuItems
                    icon={<FontAwesomeIcon icon={faInbox} />}
                    title="Email Box"
                    backGroundColor="linear-gradient(to right, #DECBA4, #3E5151)"
                    color="#fff"
                />
                <SidebarMenuItems
                    icon={<FontAwesomeIcon icon={faInbox} />}
                    title="Email Box"
                    backGroundColor="linear-gradient(to right, #8360c3, #2ebf91)"
                    color="#fff"
                />
                <SidebarMenuItems
                    icon={<FontAwesomeIcon icon={faInbox} />}
                    title="Email Box"
                    backGroundColor="linear-gradient(to right, #8e2de2, #4a00e0)"
                    color="#fff"
                />
                
            </div>

            {/* Account  */}
            <div className={cx('menu-wrapper')}>
                <h4 className={cx('menu-header')}>Account</h4>
                <SidebarMenuItems
                    icon={<FontAwesomeIcon icon={faGear} />}
                    title="Settings"
                    backGroundColor="linear-gradient(to right, #fc5c7d, #6a82fb)"
                    color="#fff"
                />
                <SidebarMenuItems
                    icon={<FontAwesomeIcon icon={faMessage} />}
                    title="Chat"
                    backGroundColor="linear-gradient(-20deg, #00cdac 0%, #8ddad5 100%)"
                    color="#fff"
                />
            </div>
        </aside>
    );
}

export default Sidebar;
