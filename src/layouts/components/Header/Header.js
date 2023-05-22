import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import routes from '~/config/routes';
import { Link } from 'react-router-dom';
import image from '~/assets/images';
import Search from '../Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEllipsisVertical,
    faEarthAsia,
    faCircleQuestion,
    faUser,
    faGear,
    faSignOut,
    faAddressCard,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import Button from '~/component/Button';
import { useContext, useState, useRef } from 'react';
import { ThemeContext } from '~/contexts/Context';
import Menu from '~/component/Popper/Menu';
import Image from '~/component/Image';
import { UserAuth } from '~/contexts/authContext';
import { Wrapper as PopperWrapper } from '~/component/Popper';
import Notification from '~/component/Notification';
import getTimeDiff from '~/utils/timeDiff';
import listLanguage from '~/config/languages';
const cx = classNames.bind(styles);

const MENU_ITEM = [
    {
        icon: <FontAwesomeIcon icon={faEarthAsia} />,
        title: 'English',
        children: {
            title: 'Language',
            data: listLanguage,
        },
    },
    { icon: <FontAwesomeIcon icon={faCircleQuestion} />, title: 'Feedback and help', to: '/feedback' },
];

let USER_MENU = [];
function Header() {
    const context = useContext(ThemeContext);
    const { user, logOut, userData, notifications, handleReadNoti } = UserAuth();
    const notif = useRef();
    USER_MENU = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: userData?.user_name || 'View Profile',
            to: routes.user + user?.uid,
        },
        { icon: <FontAwesomeIcon icon={faAddressCard} />, title: 'Update profile', to: routes.userUpdate },
        { icon: <FontAwesomeIcon icon={faGear} />, title: 'Settings', to: '/setting' },
        ...MENU_ITEM,
        { icon: <FontAwesomeIcon icon={faSignOut} />, title: 'Log out', separate: true, type: 'logOut' },
    ];

    const renderNotifications = (attrs) => (
        <div tabIndex="-1" {...attrs} className={cx('menu-lists')} ref={notif}>
            <PopperWrapper className={cx('menu-popper', { [context.theme]: context.theme === 'dark' })}>
                {notifications?.data.length > 0 ? (
                    notifications.data.map((data, ind) => {
                        return (
                            <Notification
                                onClick={() => {
                                    handleReadNoti(data);
                                }}
                                key={ind}
                                data={data}
                                time={getTimeDiff(Date.now(), data.time.toMillis()) + ' ago'}
                            />
                        );
                    })
                ) : (
                    <Image src={image.noContent} alt="nothing here" className={cx('no-content')} />
                )}
            </PopperWrapper>
        </div>
    );
    const handleMenuChange = (menuItem) => {
        // xu li khi 1 item trong menu khong co children
        switch (menuItem.type) {
            case 'logOut':
                logOut();
                break;

            default:
                break;
        }
    };

    return (
        <header className={cx('wrapper', { [context.theme]: context.theme === 'dark' })}>
            <div className={cx('inner')}>
                <Link to={routes.home} className={cx('start') + ' mdl-max:ml-3 sml-max:!hidden'}>
                    <img
                        src={context.theme === 'dark' ? image.logo : image.logoLight}
                        className={cx('logo') + ' md-max:!w-full'}
                        alt="tikTok"
                    ></img>
                </Link>
                <Link to={routes.home} className={cx('start') + ' hidden sml-max:ml-3 sml-max:flex sml-max:w-32'}>
                    <img src={image.noText} className={cx('logo') + ' md-max:!w-full'} alt="tikTok"></img>
                </Link>
                <div className={cx('middle')}>
                    <Search />
                    <Link
                        to={routes.home}
                        className={
                            cx('middle-btn', { active: window.location.pathname === routes.home }) +
                            ' sxl-max:hidden mdl-max:!flex mdl-max:!text-4xl mdl-max:!items-center mdl-max:!justify-center'
                        }
                    >
                        <i className={`${styles.icon} fa-regular fa-house`}></i>
                    </Link>
                    <Link
                        to={routes.documents}
                        className={
                            cx('middle-btn', { active: window.location.pathname === routes.documents }) +
                            ' sxl-max:hidden mdl-max:!flex mdl-max:!text-4xl mdl-max:!items-center mdl-max:!justify-center'
                        }
                    >
                        <i className={`${styles.icon} fa-regular fa-file`}></i>
                    </Link>
                    <Link
                        to={routes.flashcard}
                        className={
                            cx('middle-btn', { active: window.location.pathname === routes.flashcard }) +
                            ' sxl-max:hidden mdl-max:!flex mdl-max:!text-4xl mdl-max:!items-center mdl-max:!justify-center'
                        }
                    >
                        <i className={`${styles.icon} fa-regular fa-cards-blank`}></i>
                    </Link>
                    <Link
                        to={routes.story + user?.uid}
                        className={
                            cx('middle-btn', {
                                active: `/${window.location.pathname.split('/')[1]}/` === routes.story,
                            }) +
                            ' sxl-max:hidden mdl-max:!flex mdl-max:!text-4xl mdl-max:!items-center mdl-max:!justify-center'
                        }
                    >
                        <i className={`${styles.icon} fa-regular fa-bolt`}></i>
                    </Link>
                    <Link
                        to={routes.friend}
                        className={
                            cx('middle-btn', { active: window.location.pathname === routes.friend }) +
                            ' sxl-max:hidden mdl-max:!flex mdl-max:!text-4xl mdl-max:!items-center mdl-max:!justify-center'
                        }
                    >
                        <i className={`${styles.icon} fa-regular fa-user-group`}></i>
                    </Link>
                </div>

                <div className={cx('end')}>
                    {user ? (
                        <>
                            <span className={cx('end-btn')}>
                                <Tippy
                                    appendTo={document.body}
                                    interactive
                                    offset={[16, 30]} // chinh ben trai / chieu cao so vs ban dau
                                    placement="bottom"
                                    trigger="click"
                                    render={renderNotifications}
                                    animation={false}
                                >
                                    <i className="fa-solid fa-bell"></i>
                                </Tippy>
                                {notifications?.unread !== 0 && (
                                    <div className={cx('noti-count')}>{notifications?.unread}</div>
                                )}
                            </span>
                            <Link to={routes.chat} className={cx('end-btn')}>
                                <i className="fa-regular fa-message"></i>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Button
                                className={cx('login-btn')}
                                dark={context.theme === 'dark'}
                                primary
                                large
                                to={routes.login}
                            >
                                Log in
                            </Button>
                        </>
                    )}
                    <span onClick={context.toggleTheme} className={cx('end-btn')}>
                        {context.theme === 'dark' ? (
                            <i className={'fa-solid fa-sun'}></i>
                        ) : (
                            <i className="fa-duotone fa-moon"></i>
                        )}
                    </span>
                    <Menu
                        item={user ? USER_MENU : MENU_ITEM}
                        className={cx('menu', { [context.theme]: context.theme === 'dark' })}
                        onChange={handleMenuChange}
                    >
                        {user ? (
                            <Image
                                className={cx('user-avatar') + ' sm-max:mr-5'}
                                placement="bottom-end"
                                offset={[16, 30]}
                                src={userData?.user_avatar}
                                alt={userData?.user_name}
                            ></Image>
                        ) : (
                            <button className={cx('more-button')}>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                        )}
                    </Menu>
                </div>
            </div>
        </header>
    );
}

export default Header;
