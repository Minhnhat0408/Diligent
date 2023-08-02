import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';
import image from '~/assets/images';
import AccountItem from '~/component/AccountItem';
import { UserAuth } from '~/contexts/authContext';
import { ThemeContext } from '~/contexts/Context';
import FriendItem from '~/layouts/components/FriendItem';
import Image from '~/component/Image';
import styles from './SideBarRight.module.scss';
import { Link, useLocation } from 'react-router-dom';
import routes from '~/config/routes';
import { GlobalProps } from '~/contexts/globalContext';
const cx = classNames.bind(styles);

function SideBarRight() {
    const context = useContext(ThemeContext);
    const { usersList, user, userData } = UserAuth();
    const { contacts } = GlobalProps();
    const location = useLocation();
    console.log(contacts?.length > 0);
    return (
        <aside
            className={
                cx('wrapper', { [context.theme]: context.theme === 'dark' }) +
                ' sxl-max:mr-1 lg-max:max-w-[125px] lgbw-max:max-w-[125px] lg-max:!mr-4 lgs-max:hidden'
            }
        >
            {user && userData ? (
                <>
                    {!location.pathname.includes(routes.chatroom) &&
                        (userData?.user_friendRequests.length !== 0 ? (
                            <div className={cx('menu-wrapper') + ' xl-max:hidden'}>
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
                                    <h4 className={cx('menu-header') + ' lg-max:text-xl'}>Suggested friends</h4>
                                    <Link to={routes.friend} className={cx('more') + ' lg-max:hidden lgbw-max:hidden'}>
                                        See all
                                    </Link>
                                </div>
                                {usersList?.map((u, ind) => {
                                    return (
                                        user.uid !== u.id &&
                                        ind < 8 &&
                                        !u.friend && (
                                            <AccountItem
                                                search
                                                key={u.id}
                                                dark={context.theme === 'dark'}
                                                acc={user.isAdmin ? { ...u, isAdmin: true } : { ...u, isAdmin: false }}
                                            />
                                        )
                                    );
                                })}
                            </div>
                        ))}

                    {userData?.user_friends.length !== 0 && contacts?.length > 0 && (
                        <div className={cx('menu-wrapper')}>
                            <div className={cx('options')}>
                                <h4 className={cx('menu-header') + ' lg-max:text-xl'}>Contacts</h4>
                            </div>
                            {
                                location.pathname.includes(routes.chatroom)
                                    ? contacts?.map((c) => {
                                          return (
                                              <AccountItem
                                                  chat
                                                  key={c.id}
                                                  dark={context.theme === 'dark'}
                                                  acc={
                                                      c.data.user1.id === user.uid
                                                          ? {
                                                                id: c.data.user2.id,
                                                                data: {
                                                                    user_name: c.data.user2.name,
                                                                    user_avatar: c.data.user2.ava,
                                                                },
                                                            }
                                                          : {
                                                                id: c.data.user1.id,
                                                                data: {
                                                                    user_name: c.data.user1.name,
                                                                    user_avatar: c.data.user1.ava,
                                                                },
                                                            }
                                                  }
                                                  room={c}
                                              />
                                          );
                                      })
                                    : contacts?.slice(0, 5).map((c, key) => {
                                          return (
                                              <AccountItem
                                                  chat
                                                  key={c.id}
                                                  dark={context.theme === 'dark'}
                                                  acc={
                                                      c.data.user1.id === user.uid
                                                          ? {
                                                                id: c.data.user2.id,
                                                                data: {
                                                                    user_name: c.data.user2.name,
                                                                    user_avatar: c.data.user2.ava,
                                                                },
                                                            }
                                                          : {
                                                                id: c.data.user1.id,
                                                                data: {
                                                                    user_name: c.data.user1.name,
                                                                    user_avatar: c.data.user1.ava,
                                                                },
                                                            }
                                                  }
                                                  room={c}
                                              />
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
