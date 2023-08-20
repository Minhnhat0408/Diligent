import classNames from 'classnames/bind';
import styles from './SideBarLeft.module.scss';
import SidebarMenuItems from 'src/layouts/components/SidebarMenuItems';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBoltLightning,
    faBook,
    faBoxArchive,
    faClipboardList,
    faGamepad,
    faNewspaper,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
import routes from '~/config/routes';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '~/contexts/authContext';
import 'src/Calendar.css';
import { Calendar } from 'react-calendar';

const cx = classNames.bind(styles);

function SideBarLeft() {
    const navigate = useNavigate();
    const context = useContext(ThemeContext);
    const { user } = UserAuth();
    const highlightedDates = [new Date('2023-07-17'), new Date('2023-07-18'), new Date('2023-07-19')];
    const dateHasHighlight = (date) => {
        return highlightedDates.some((highlightedDate) => {
            return (
                date.getDate() === highlightedDate.getDate() &&
                date.getMonth() === highlightedDate.getMonth() &&
                date.getFullYear() === highlightedDate.getFullYear()
            );
        });
    };
    return (
        <aside
            className={
                cx('wrapper', { [context.theme]: context.theme === 'dark' }) +
                ' mdx-max:ml-[calc((33vw-240px)/2)] mdl-max:hidden'
            }
        >
            {/* New feed  */}
            <div className={cx('menu-wrapper')}>
                <h4 className={cx('menu-header')}>Applications</h4>
                {/* prop backgroundcolor de xet background cho icon, color xet color cho icon */}
                <SidebarMenuItems
                    icon={<FontAwesomeIcon icon={faNewspaper} />}
                    title="Home"
                    backGroundColor="linear-gradient(to right, #0575e6, #021b79)"
                    color="#fff"
                    onClick={() => {
                        navigate(routes.home);
                    }}
                />
                <SidebarMenuItems
                    icon={<FontAwesomeIcon icon={faBook} />}
                    title="Documents"
                    backGroundColor="linear-gradient(to right,  #ffafbd,#ffc3a0)"
                    color="#fff"
                    onClick={() => {
                        navigate(routes.documents);
                    }}
                />
                <SidebarMenuItems
                    icon={<FontAwesomeIcon icon={faBoxArchive} />}
                    title="Saved Posts"
                    backGroundColor="linear-gradient(to right, #e44d26, #f16529)"
                    color="#fff"
                    onClick={() => {
                        navigate(routes.saves + user?.uid);
                    }}
                />
                <SidebarMenuItems
                    icon={<FontAwesomeIcon icon={faBoltLightning} />}
                    title="Explore Stories"
                    backGroundColor="linear-gradient(to right, #f2994a, #f2c94c)"
                    color="#fff"
                    onClick={() => {
                        navigate(routes.story + user?.uid);
                    }}
                />

                <SidebarMenuItems
                    icon={<FontAwesomeIcon icon={faClipboardList} />}
                    title="To-do List"
                    backGroundColor="linear-gradient(to right, #ee0979, #ff6a00)"
                    color="#fff"
                    onClick={() => {
                        context.setTodoList(true);
                    }}
                />
            </div>

            {/* More pages */}
            <div className={cx('menu-wrapper')}>
                <h4 className={cx('menu-header')}>Daily Learning</h4>
                <Calendar
                    tileClassName={({ date }) => (dateHasHighlight(date) ? 'highlight' : null)}
                    className={context.theme === 'dark' ? 'dark' :''}
                />
            </div>
        </aside>
    );
}

export default SideBarLeft;
