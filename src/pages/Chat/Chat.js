import classNames from 'classnames/bind';
import styles from './Chat.module.scss';
import Image from '~/component/Image/Image';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '~/firebase';
import { useState } from 'react';
import { UserAuth } from '~/contexts/authContext';
const cx = classNames.bind(styles);

function Chat() {
    const { roomId } = useParams();
    const { user } = UserAuth();
    const [correspondent, setCorrespondent] = useState();
    const [roomData,setRoomData] = useState()
    useEffect(() => {
        const fetchRoom = async () => {
            const a = await getDoc(doc(db, 'chats', roomId));
            setRoomData(a.data())
            if (a.data().user1.id === user.uid) {
                setCorrespondent({ role: 'user2', data: a.data().user2 });
            } else {
                setCorrespondent({ role: 'user1', data: a.data().user1 });
            }
        };
        fetchRoom();
    }, [roomId]);
    return (
        <>
            {correspondent && (
                <div className={cx('wrapper')}>
                    <div className={cx('user-info')}>
                        <span>{correspondent.name}</span>
                        <Image src={correspondent.ava} className={cx('avatar')} alt="avatar" />
                    </div>
                    <div className={cx('chat-box')}></div>
                    <div className={cx('input')}></div>
                </div>
            )}
        </>
    );
}

export default Chat;
