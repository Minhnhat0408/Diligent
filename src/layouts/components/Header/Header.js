import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import routes from '~/config/routes';
import { Link, useLocation } from 'react-router-dom';
import image from '~/assets/images';
import Search from '../Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEllipsisVertical,
    faEarthAsia,
    faKeyboard,
    faCircleQuestion,
    faUser,
    faCoins,
    faGear,
    faSignOut,
    faAddressCard,
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
import { db } from '~/firebase';
import { getDocs, collection, updateDoc, query, where, getDoc, onSnapshot, doc, orderBy } from 'firebase/firestore';
import getTimeDiff from '~/utils/timeDiff';
const cx = classNames.bind(styles);

const languages = [
    'English',
    'العربية',
    'বাঙ্গালি (ভারত)',
    'Cebuano (Pilipinas)',
    'Čeština (Česká republika)',
    'Deutsch',
    'Ελληνικά (Ελλάδα)',
    'Español',
    'Suomi (Suomi)',
    'Filipino (Pilipinas)',
    'Français',
    '(ישראל) עברית',
    'हिंदी',
    'Magyar (Magyarország)',
    'Bahasa Indonesia (Indonesia)',
    'Italiano (Italia)',
    '日本語（日本）',
    'Basa Jawa (Indonesia)',
    'ខ្មែរ (កម្ពុជា)',
    '한국어 (대한민국)',
    'Bahasa Melayu (Malaysia)',
    'မြန်မာ (မြန်မာ)',
    'Nederlands (Nederland)',
    'Polski  (Polska)',
    'Português (Brasil)',
    'Română (Romania)',
    'Русский (Россия)',
    'Svenska  (Sverige)',
    'ไทย (ไทย)',
    'Türkçe (Türkiye)',
    'Українська (Україна)',
    'اردو',
    'Tiếng Việt (Việt Nam)',
    '简体中文',
    '繁體中文',
];
const listLanguage = languages.map((lang) => {
    return {
        code: 'en',
        type: 'language',
        title: lang,
        children: {
            title: 'Success',
            data: [
                {
                    title: 'Not Working',
                },
            ],
        },
    };
});
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
    const currentRoute = useLocation();
    const { user, logOut, userData } = UserAuth();
    const [notifications, setNotifications] = useState();
    const notif = useRef();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        console.log('effect');
        if (user) {
            const q = query(collection(db, 'users', user?.uid, 'notifications'),orderBy('time','desc'))
            getDocs(q).then((docs) => {
                let data1 = [];
                let readNoti = 0;
                docs.forEach((doc) => {
                    data1.push(doc.data());
                    if(!doc.data().read) {
                        readNoti++;
                    }
                });
                setNotifications({data:data1,unread:readNoti});
            });
        }
    }, [userData?.user_friendRequests]);
    
    USER_MENU = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: userData?.user_name || 'View Profile',
            to: routes.user + user?.uid,
        },
        { icon: <FontAwesomeIcon icon={faAddressCard}/>, title: 'Update profile',to:routes.updateInfo},
        { icon: <FontAwesomeIcon icon={faGear} />, title: 'Settings', to: '/setting' },
        ...MENU_ITEM,
       { icon: <FontAwesomeIcon icon={faSignOut} />, title: 'Log out', separate: true, type: 'logOut' },
    ];
    const handleReadNoti = async (data) => {
        const q = query(collection(db, 'users', user?.uid, 'notifications'), where('sender.id', '==', data.sender.id));
        const docs = await getDocs(q);
        await updateDoc(doc(db, 'users', user?.uid, 'notifications', docs.docs[0].id), {
            read: true,
        });
        await getDocs(collection(db, 'users', user?.uid, 'notifications')).then((docs) => {
            let data1 = [];
            let readNoti = 0;
            docs.forEach((doc) => {
                data1.push(doc.data());
                if(!doc.data().read) {
                    readNoti++;
                }
            });
            setNotifications({data:data1,unread:readNoti});
        });
    };
    console.log(notifications)
    const renderNotifications = (attrs) => (
        <div tabIndex="-1" {...attrs} className={cx('menu-lists')} ref={notif}>
            <PopperWrapper className={cx('menu-popper', { [context.theme]: context.theme === 'dark' })}>
                {notifications?.data.map((data) => {
                    return (
                        <Notification
                            onClick={() => {
                                handleReadNoti(data);
                            }}
                            key={data.sender.id}
                            data={data}
                            time={getTimeDiff(Date.now(), data.time.toMillis())}
                        />
                    );
                })}
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
                <Link to={routes.home} className={cx('start')}>
                    <img
                        src={context.theme === 'dark' ? image.logo : image.logoLight}
                        className={cx('logo')}
                        alt="tikTok"
                    ></img>
                </Link>
                <div className={cx('middle')}>
                    <Search />
                    <Link
                        to={routes.home}
                        className={cx('middle-btn', { active: currentRoute.pathname === routes.home })}
                    >
                        <i className={`${styles.icon} fa-regular fa-house`}></i>
                    </Link>
                    <Link
                        to={routes.friend}
                        className={cx('middle-btn', { active: currentRoute.pathname === routes.friend })}
                    >
                        <i className={`${styles.icon} fa-regular fa-user-group`}></i>
                    </Link>
                    <Link
                        to={routes.flashcard}
                        className={cx('middle-btn', { active: currentRoute.pathname === routes.flashcard })}
                    >
                        <i className={`${styles.icon} fa-regular fa-cards-blank`}></i>
                    </Link>
                    <Link
                        to={routes.story}
                        className={cx('middle-btn', { active: currentRoute.pathname === routes.story })}
                    >
                        <i className={`${styles.icon} fa-regular fa-folder-arrow-up`}></i>
                    </Link>
                </div>

                <div className={cx('end')}>
                    {user ? (
                        <>
                            <span className={cx('end-btn')}>
                                <Tippy
                                    visible={visible}
                                    offset={[16, 30]} // chinh ben trai / chieu cao so vs ban dau
                                    placement="bottom"
                                    render={renderNotifications}
                                    animation={false}
                                    onClickOutside={() => setVisible(false)}
                                >
                                    <i className="fa-solid fa-bell" onClick={() => setVisible(true)} >
                                        
                                    </i>
                                </Tippy>
                                {notifications?.unread !== 0 && <div className={cx('noti-count')}>{notifications?.unread}</div>}
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
                            <i className="fa-solid fa-sun"></i>
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
                                className={cx('user-avatar')}
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
