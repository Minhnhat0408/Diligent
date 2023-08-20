import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';
import Image from '../Image';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { memo } from 'react';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import routes from '~/config/routes';
import { addDoc, collection, getDocs, onSnapshot, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from '~/firebase';
import { useState } from 'react';
import { UserAuth } from '~/contexts/authContext';
const cx = classNames.bind(styles);

function AccountItem({ room, acc, search = false, chat = false, dark, ...props }) {
    const { user, usersStatus } = UserAuth();
    const [noti, setNoti] = useState(0);
    useEffect(() => {
        if (chat) {
            const unsubscribe = onSnapshot(
                query(
                    collection(db, 'chats', room.id, 'messages'),
                    where('seen', '==', false),
                    where('sender', '!=', user.uid),
                ),
                async (docs) => {
                    setNoti(docs.size);
                },
            );

            return () => unsubscribe();
        }
    }, [user]);

    return (
   
                <Link
                    to={(search && `/user/${acc.id}`) || (chat && routes.chatroom + room.id)}
                    className={cx('wrapper', { dark: dark })}
                >
                    <Image src={acc.data.user_avatar} alt="user" className={cx('avatar')} />
                    <div className={cx('info') + ' lg-max:overflow-visible lgbw-max:!overflow-visible'}>
                        <h4 className={cx('name') + ' lg-max:hidden lgbw-max:!hidden'}>{acc.data.user_name}</h4>
                        {chat && noti > 0 ? (
                            <div className={cx('msg-noti')}>{noti}</div>
                        ) : (
                            <span className={cx('icon', { [usersStatus[acc.id]?.user_status]: true })}>
                                <FontAwesomeIcon icon={faCircle} />
                            </span>
                        )}
                    </div>
                </Link>
        
    );
}

AccountItem.propTypes = {
    acc: PropTypes.object.isRequired,
};
export default memo(AccountItem);
