import classNames from 'classnames/bind';
import styles from './FriendItem.module.scss';
import Image from '~/component/Image';
import Button from '~/component/Button';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
import { arrayRemove, arrayUnion, doc, serverTimestamp, updateDoc,addDoc,collection } from 'firebase/firestore';
import { db } from '~/firebase';
import { UserAuth } from '~/contexts/authContext';
import type from '~/config/typeNotification';
import routes from '~/config/routes';

const cx = classNames.bind(styles);

function FriendItem({ data }) {
    const context = useContext(ThemeContext);
    const { user, userData } = UserAuth();
    const handleDecline = () => {};

    const handleAccept = async () => {
        await updateDoc(doc(db, 'users', data.id), {
            user_friends: arrayUnion({
                id: user.uid,
                ava: userData.user_avatar,
                name: userData.user_name,
                time: new Date(),
            }),
        });
        await addDoc(collection(db, 'users', data.id, 'notifications'), {
            title: type.accfr,
            url: routes.user + user.uid,
            sender: {
                id: user.uid,
                name: userData.user_name,
                avatar: userData.user_avatar,
            },
            type: 'accfr',
            time: serverTimestamp(),
            read: false,
        });

        await updateDoc(doc(db, 'users', user.uid), {
            user_friends: arrayUnion({
                id: data.id,
                ava: data.ava,
                name: data.name,
                time: new Date(),
            }),
            user_friendRequests: arrayRemove({
                id: data.id,
                ava: data.ava,
                name: data.name,
            }),
        });
    };
    return (
        <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
            <div className={cx('body')}>
                <Image src={data?.ava} className={cx('avatar')} alt="avatar" />
                <div className={cx('info')}>
                    <h4 className={cx('name')}>{data?.name}</h4>
                    <span className={cx('mutual')}>18 mutual friend</span>
                </div>
            </div>
            <div className={cx('btn')}>
                <Button onClick={handleAccept} small rounded primary dark={context.theme === 'dark'}>
                    Confirm
                </Button>
                <Button onClick={handleDecline} small rounded>
                    delete
                </Button>
            </div>
        </div>
    );
}

export default FriendItem;
