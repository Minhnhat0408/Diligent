import classNames from 'classnames/bind';
import { useContext } from 'react';
import image from '~/assets/images';
import AccountItem from '~/component/AccountItem';
import { UserAuth } from '~/contexts/authContext';
import { ThemeContext } from '~/contexts/Context';
import FriendItem from '~/layouts/components/FriendItem';
import Image from '~/component/Image';
import styles from './SideBarRight.module.scss';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
const cx = classNames.bind(styles);

function SideBarRight() {
    const context = useContext(ThemeContext);
    const { usersList, user, userData } = UserAuth();
    
    return (
        <aside className={cx('wrapper', { [context.theme]: context.theme === 'dark' })}>
            {user && userData ? (
                <>
                    {(userData?.user_friendRequests.length !== 0) ? (
                        <div className={cx('menu-wrapper')}>
                            <div className={cx('options')}>
                                <h4 className={cx('menu-header')}>Friend request</h4>
                                <Link to={routes.friend} className={cx('more')}>
                                    See all
                                </Link>
                            </div>

                            {userData.user_friendRequests.map((user) => {
                                return <FriendItem key={user.id} data={user} />;
                            })}
                        </div>
                    ) : (
                        <div className={cx('menu-wrapper')}>
                            <div className={cx('options')}>
                                <h4 className={cx('menu-header')}>Suggested friends</h4>
                                <Link to={routes.friend} className={cx('more')}>
                                    See all
                                </Link>
                            </div>
                            {usersList?.map((u) => {
                                return (
                                    user.uid !== u.id &&
                                    !u.friend && (
                                        <AccountItem search key={u.id} dark={context.theme === 'dark'} user={u} />
                                    )
                                );
                            })}
                        </div>
                    )}

                    {userData?.user_friends.length !== 0 && (
                        <div className={cx('menu-wrapper')}>
                            <div className={cx('options')}>
                                <h4 className={cx('menu-header')}>Contacts</h4>
                            </div>
                            {usersList?.map((u) => {
                         
                                return (
                                    user.uid !== u.id &&
                                    u.friend && <AccountItem chat key={u.id} dark={context.theme === 'dark'} user={u} />
                                );
                            })}
                        </div>
                    )}
                </>
            ) : (
                <div className={cx('menu-wrapper')}>
                    <Image src={image.social} className={cx('media')} alt="media" />
                </div>
            )}
        </aside>
    );
}

export default SideBarRight;
