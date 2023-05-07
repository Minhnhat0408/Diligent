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
import {
    addDoc,
    collection,
    doc,
    getDocs,
    setDoc,
    serverTimestamp,
    query,
    where,
    getDoc,
    onSnapshot,
    orderBy,
    updateDoc,
    arrayRemove,
    arrayUnion,
    deleteDoc,
    deleteField,
} from 'firebase/firestore';
import { db } from '~/firebase';
import { useState } from 'react';
import { UserAuth } from '~/contexts/authContext';
import Button from '../Button/Button';
const cx = classNames.bind(styles);

function AccountItem({ acc, search = false, chat = false, dark, ...props }) {
    const { user, userData } = UserAuth();
    const [roomId, setRoomId] = useState();
    useEffect(() => {
        const fetchRoom = async () => {
            const q = query(
                collection(db, 'chats'),
                where('user1.id', 'in', [user.uid, acc.id]),
                where('user2.id', 'in', [user.uid, acc.id]),
            );
            const a = await getDocs(q);
            let tmp = a.docs[0]?.id;

            if (!tmp) {
                const a = await addDoc(collection(db, 'chats'), {
                    user1: {
                        name: userData.user_name,
                        id: user.uid,
                        ava: userData.user_avatar,
                    },
                    user2: {    
                        name: acc.data.user_name,
                        id: acc.id,
                        ava: acc.data.user_avatar,
                    },
                });
                tmp = a.id;
            }
            setRoomId(tmp);
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
                <span className={cx('icon', { [acc.data.user_status]: true })}>
                    <FontAwesomeIcon icon={faCircle} />
                </span>
            </div>
        </Link>
    );
}

AccountItem.propTypes = {
    acc: PropTypes.object.isRequired,
};
export default memo(AccountItem);
