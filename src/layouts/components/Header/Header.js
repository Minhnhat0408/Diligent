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
    faKeyboard,
    faCircleQuestion,
    faUser,
    faCoins,
    faGear,
    faSignOut,
    faPlus,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import Button from '~/component/Button';
import { useContext, useState } from 'react';
import { ThemeContext } from '~/contexts/Context';
import Menu from '~/component/Popper/Menu';
import Image from '~/component/Image';
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
    { icon: <FontAwesomeIcon icon={faKeyboard} />, title: 'Keyboard shortcuts' },
];

const USER_MENU = [
    { icon: <FontAwesomeIcon icon={faUser} />, title: 'View profile', to: '/@hoa' },
    { icon: <FontAwesomeIcon icon={faGear} />, title: 'Settings', to: '/settings' },
    ...MENU_ITEM,
    { icon: <FontAwesomeIcon icon={faSignOut} />, title: 'Log out', separate: true, type: 'logOut' },
];
function Header() {
    const [currentUser, setCurrentUser] = useState(false);
    const context = useContext(ThemeContext);
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
                    <Link to={routes.home} className={cx('middle-btn')}>
                        <i className={`${styles.icon} fa-regular fa-house`}></i>
                    </Link>
                    <Link to={routes.home} className={cx('middle-btn')}>
                        <i className={`${styles.icon} fa-regular fa-user-group`}></i>
                    </Link>
                    <Link to={routes.home} className={cx('middle-btn')}>
                        <i className={`${styles.icon} fa-regular fa-cards-blank`}></i>
                    </Link>
                    <Link to={routes.home} className={cx('middle-btn')}>
                        <i className={`${styles.icon} fa-regular fa-folder-arrow-up`}></i>
                    </Link>
                </div>

                <div className={cx('end')}>
                    
                    {currentUser ? (
                        <>
                            <span className={cx('end-btn')}>
                                <Tippy content="notification" placement="bottom">
                                    <i className="fa-solid fa-bell"></i>
                                </Tippy>
                            </span>
                            <Link className={cx('end-btn')}>
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
                                onClick={() => setCurrentUser(true)}
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
                    <Menu item={currentUser ? USER_MENU : MENU_ITEM} className={cx('menu',{ [context.theme]: context.theme === 'dark' })} >
                        {currentUser ? (
                            <Image
                                className={cx('user-avatar')}
                                src="https://scontent.fhan14-3.fna.fbcdn.net/v/t39.30808-1/277751572_1315302068964376_895612620486881878_n.jpg?stp=dst-jpg_p240x240&_nc_cat=109&ccb=1-7&_nc_sid=7206a8&_nc_ohc=tQd0KyAhsr8AX9e_Lj_&_nc_ht=scontent.fhan14-3.fna&oh=00_AfAuh1k4QyqFLu9ZRjTAQJkDGeDAbEinzhIs5xq5X9pacw&oe=63FB6280"
                                alt="Nguyen Nhat Minh"
                            ></Image>
                        ): (
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
