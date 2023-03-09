import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import routes from '~/config/routes';
import { Link } from 'react-router-dom';
import image from '~/assets/images';
import Search from '../Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faHouseChimney, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import { useState } from 'react';
const cx = classNames.bind(styles);

function Header() {
    const [currentUser, setCurrentUser] = useState(true);

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link to={routes.home} className={cx('start')}>
                    <img src={image.logo} className={cx('logo')} alt="tikTok"></img>
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
                            <span className={cx('end-btn')}>
                            <i class="fa-brands fa-affiliatetheme"></i>
                            </span>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
