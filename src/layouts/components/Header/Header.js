import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import routes from '~/config/routes';
import { Link, useNavigate } from 'react-router-dom';
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
    faListCheck,
    faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import Button from '~/component/Button';
import { useContext, useState, useRef, useEffect } from 'react';
import { ThemeContext } from '~/contexts/Context';
import Menu from '~/component/Popper/Menu';
import Image from '~/component/Image';
import { UserAuth } from '~/contexts/authContext';
import { Wrapper as PopperWrapper } from '~/component/Popper';
import Notification from '~/component/Notification';
import getTimeDiff from '~/utils/timeDiff';
import listLanguage from '~/config/languages';
import { GlobalProps } from '~/contexts/globalContext';
import toast, { Toaster } from 'react-hot-toast';
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
    {
        icon: <FontAwesomeIcon icon={faQuestionCircle} />,
        title: 'Policy and Support',
    },
];

let USER_MENU = [];
function Header() {
    const context = useContext(ThemeContext);
    const { user, logOut, userData } = UserAuth();
    const { handleReadNoti, notifications } = GlobalProps();
    const notif = useRef();
    const navigate = useNavigate();
    const change = useRef(0);
    const [notis, setNotis] = useState();
    useEffect(() => {
        setNotis(notifications);
        if (notifications && notifications?.unread !== 0 && change.current > 2) {
            toast('You got unread notifications!', {
                icon: '🔔',
                style: {
                    minWidth: '250px',
                    minHeight: '60px',
                    fontSize: '20px',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-light) ',
                },
            });
        }
        change.current++
   
    }, [notifications]);
    
    USER_MENU = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: userData?.user_name || 'View Profile',
            to: routes.user + user?.uid,
        },
        { icon: <FontAwesomeIcon icon={faListCheck} />, title: 'Todo List', type: 'todo' },
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
            case 'todo':
                if(user) {
                    context.setTodoList(true)
                }else{
                    navigate(routes.login)
                }
                
                break;

            default:
                break;
        }
    };

    return (
        <header className={cx('wrapper', { [context.theme]: context.theme === 'dark' }) + ' sml-max:h-16'}>
            <Toaster position="bottom-right" />
            <div className={cx('inner') + ' smu-max:justify-between'}>
                <div
                    onClick={() => {
                        if (window.location.pathname === routes.home) {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                            navigate(routes.home);
                        }
                    }}
                    className={cx('start') + ' relative mdl-max:ml-3 smu-max:!ml-6'}
                >
                    <img
                        src={context.theme === 'dark' ? image.logo : image.logoLight}
                        className={cx('logo') + ' md-max:!w-full '}
                        alt="tikTok"
                    ></img>
                </div>
                <div className={cx('middle') + ' smu-max:hidden'}>
                    <Search />
                    <Tippy content="Home" theme={context.theme} animation={'scale'}>
                        <Link
                            to={routes.home}
                            preventScrollReset={true}
                            className={
                                cx('middle-btn', { active: window.location.pathname === routes.home }) +
                                ' sxl-max:hidden mdl-max:!flex mdl-max:!text-xl mdl-max:!items-center mdl-max:!justify-center'
                            }
                        >
                            <i className={`${styles.icon} fa-regular fa-house`}></i>
                        </Link>
                    </Tippy>
                    <Tippy content="Documents" theme={context.theme} animation={'scale'}>
                        <Link
                            to={routes.documents}
                            className={
                                cx('middle-btn', { active: window.location.pathname === routes.documents }) +
                                ' sxl-max:hidden mdl-max:!flex mdl-max:!text-xl mdl-max:!items-center mdl-max:!justify-center'
                            }
                        >
                            <i className={`${styles.icon} fa-regular fa-file`}></i>
                        </Link>
                    </Tippy>
                    <Tippy content="Flashcard" theme={context.theme} animation={'scale'}>
                        <Link
                            to={routes.flashcard}
                            className={
                                cx('middle-btn', { active: window.location.pathname === routes.flashcard }) +
                                ' sxl-max:hidden mdl-max:!flex mdl-max:!text-xl mdl-max:!items-center mdl-max:!justify-center'
                            }
                        >
                            <i className={`${styles.icon} fa-regular fa-cards-blank`}></i>
                        </Link>
                    </Tippy>
                    <Tippy content="Story" theme={context.theme} animation={'scale'}>
                        <Link
                            to={routes.story + user?.uid}
                            className={
                                cx('middle-btn', {
                                    active: `/${window.location.pathname.split('/')[1]}/` === routes.story,
                                }) +
                                ' sxl-max:hidden mdl-max:!flex mdl-max:!text-xl mdl-max:!items-center mdl-max:!justify-center'
                            }
                        >
                            <i className={`${styles.icon} fa-regular fa-bolt`}></i>
                        </Link>
                    </Tippy>
                    <Tippy content="Friends" theme={context.theme} animation={'scale'}>
                        <Link
                            to={routes.friend}
                            className={
                                cx('middle-btn', { active: window.location.pathname === routes.friend }) +
                                ' sxl-max:hidden mdl-max:!flex mdl-max:!text-xl mdl-max:!items-center mdl-max:!justify-center'
                            }
                        >
                            <i className={`${styles.icon} fa-regular fa-user-group`}></i>
                        </Link>
                    </Tippy>
                </div>

                <div className={cx('end') + ' smu-max:w-[210px] mdl-max:justify-end'}>
                    {user ? (
                        <>
                            <Tippy content="Notifications" theme={context.theme} animation="scale">
                                <span className={cx('end-btn') + ' mdl-max:hidden'}>
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
                            </Tippy>
                            <Tippy content="Chat" theme={context.theme} animation="scale">
                                <Link to={routes.chatroom + 'none'} className={cx('end-btn') + ' mdl-max:hidden'}>
                                    <i className="fa-regular fa-message"></i>
                                </Link>
                            </Tippy>
                        </>
                    ) : (
                        <>
                            <Button
                                className={cx('login-btn') + ' mr-0 h-10 !w-16'}
                                dark={context.theme === 'dark'}
                                primary
                                large
                                responsive
                                to={routes.login}
                            >
                                Log in
                            </Button>
                        </>
                    )}
                    <Tippy content="Theme" theme={context.theme} animation="scale">
                        <span onClick={context.toggleTheme} className={cx('end-btn') + ' mdl-max:hidden'}>
                            {context.theme === 'dark' ? (
                                <i className="fa-solid fa-brightness"></i>
                            ) : (
                                <i className="fa-duotone fa-moon"></i>
                            )}
                        </span>
                    </Tippy>

                    <Menu
                        item={user ? USER_MENU : MENU_ITEM}
                        className={cx('menu', { [context.theme]: context.theme === 'dark' })}
                        onChange={handleMenuChange}
                        placement="bottom"
                        offset={[0, 10]}
                    >
                        {user ? (
                            <Image
                                className={cx('user-avatar') + ' sm-max:mr-5 '}
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
