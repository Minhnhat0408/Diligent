import classNames from 'classnames/bind';
import styles from './Chat.module.scss';
import Image from '~/component/Image/Image';
import { Link, useParams } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '~/firebase';
import { useState } from 'react';
import { UserAuth } from '~/contexts/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt, faCircle, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import routes from '~/config/routes';
import ChatItem from '~/component/ChatComponents/ChatItem/ChatItem';
import ChatInput from '~/component/ChatComponents/ChatInput/ChatInput';
import { useRef } from 'react';
import { ThemeContext } from '~/contexts/Context';
import { GlobalProps } from '~/contexts/globalContext';

const cx = classNames.bind(styles);

function Chat() {
    const { roomId } = useParams();
    const chat = useRef();
    const [loading, setLoading] = useState(false);
    const { user, userData,usersStatus } = UserAuth();
    const [correspondent, setCorrespondent] = useState();
    const [roomData, setRoomData] = useState();
    const lastView = useRef(0);
    const [messages, setMessages] = useState();
    const context = useContext(ThemeContext);
    useEffect(() => {
        const fetchRoom = async () => {
            const a = await getDoc(doc(db, 'chats', roomId));
            if (a.data()) {
                setRoomData(a.data());
                if (a.data().user1.id === user.uid) {
                    setCorrespondent({...a.data().user2,status:usersStatus[a.data().user2.id]?.user_status});
                } else {
                    setCorrespondent({...a.data().user1,status:usersStatus[a.data().user1.id]?.user_status});
                }
            } else {
                setCorrespondent(null);
                setRoomData(null);
            }

            //update view Time
        };

        fetchRoom();
    }, [roomId]);
    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'chats', roomId, 'messages'), orderBy('time')),
            async (docs) => {
                let tmp = [];

                docs.forEach((doc) => {
                    tmp.push({ id: doc.id, data: doc.data() });
                });

                let otherMsg = tmp.filter((obj) => obj.data.sender !== user.uid && obj.data.seen === false);
                otherMsg.forEach((msg) => {
                    updateDoc(doc(db, 'chats', roomId, 'messages', msg.id), {
                        seen: true,
                    });
                });
                setMessages(tmp);
                if(tmp.length > 0) {
                    if (tmp.at(-1).data.sender === user.uid) {
                        lastView.current++;
                    }
                }
                

                if (lastView.current === 2) {
            
                    await updateDoc(doc(db, 'chats', roomId), {
                        lastView: serverTimestamp(),
                    });
                }
            },
        );
        lastView.current = 0;
        return () => unsubscribe();
    }, [roomId]);
    useEffect(() => {
        if (correspondent) {
            chat.current.scrollTop = chat.current.scrollHeight;
        }
    }, [correspondent, messages]);
    return (
        <>
            {correspondent ? (
                <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
                    <div className={cx('user-info')}>
                        <Image src={correspondent.ava} className={cx('avatar')} alt="avatar" />
                        <div className={cx('column')}>
                            <span className={cx('name')}>{correspondent.name}</span>
                            <div className={cx('row')}>
                                <span className={cx('status')}>{correspondent.status}</span>
                                <FontAwesomeIcon
                                    icon={faCircle}
                                    className={cx('icon', { [correspondent.status]: true })}
                                />
                            </div>
                        </div>

                        <a href={`mailto:${correspondent.email}`} className={cx('user-options')}>
                            <FontAwesomeIcon icon={faAt} />
                        </a>
                        <Link to={routes.user + correspondent.id} className={cx('user-options')}>
                            <FontAwesomeIcon icon={faCircleInfo} />
                        </Link>
                    </div>
                    <div className={cx('chat-box')} ref={chat}>
                        <span className={cx('first-text')}>Chat with {correspondent.name} now</span>
                        {messages?.map((msg, id) => {
                            const me = msg.data.sender === user.uid;
                            let data = null;
                            if (me) {
                                data = { ...msg.data, name: userData.user_name, ava: userData.user_avatar };
                            } else {
                                data = {
                                    ...msg.data,
                                    name: correspondent.name,
                                    ava: correspondent.ava,
                                };
                            }
                            return <ChatItem key={id} data={data} me={me} />;
                        })}
                        {loading && (
                            <ChatItem
                                loading={true}
                                data={{ name: userData.user_name, ava: userData.user_avatar }}
                                me={true}
                            />
                        )}
                    </div>
                    <div className={cx('input')}>
                        <ChatInput roomId={roomId} setLoading={setLoading} />
                    </div>
                </div>
            ) : (
                <h1 className="text-center text-[var(--text-color-dark)] italic mt-[20%]">Select a friend to chat</h1>
            )}
        </>
    );
}

export default Chat;
