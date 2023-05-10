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
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '~/firebase';
import { useState } from 'react';
import { UserAuth } from '~/contexts/authContext';
const cx = classNames.bind(styles);

function AccountItem({ acc, search = false, chat = false, dark, ...props }) {
    const { user, userData } = UserAuth();
    const [roomId, setRoomId] = useState();
    const [noti, setNoti] = useState(0);
    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const q = query(
                    collection(db, 'chats'),
                    where('id1', 'in', [user.uid, acc.id]),
                    where('id2', 'in', [user.uid, acc.id]),
                );
                const a = await getDocs(q);
                let tmp = a.docs[0]?.id;

                if (!tmp) {
                    const a = await addDoc(collection(db, 'chats'), {
                        id1: user.uid,
                        id2: acc.id,
                    });
                    tmp = a.id;
                } else {
                    const unseen = await getDocs(
                        query(
                            collection(db, 'chats', tmp, 'messages'),
                            where('seen', '==', false),
                            where('sender', '!=', user.uid),
                        ),
                    );
                    setNoti(unseen.docs.length);
                }

                setRoomId(tmp);
            } catch (err) {
                console.log(err);
            }
        };
        if (chat) {
            fetchRoom();
        }
    }, []);
    return (
        <Link
            to={(search && `/user/${acc.id}`) || (chat && routes.chatroom + roomId)}
            className={cx('wrapper', { dark: dark })}
        >
            <Image src={acc.data.user_avatar} alt="user" className={cx('avatar')} />
            <div className={cx('info')}>
                <h4 className={cx('name')}>
                    <span>{acc.data.user_name}</span>
                </h4>
                {chat && noti > 0 ? (
                    <div className={cx('msg-noti')}>{noti}</div>
                ) : (
                    <span className={cx('icon', { [acc.data.user_status]: true })}>
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
