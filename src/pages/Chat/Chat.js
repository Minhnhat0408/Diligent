import classNames from 'classnames/bind';
import styles from './Chat.module.scss';
import Image from '~/component/Image/Image';
import { Link, useParams } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { collection, doc, getDoc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '~/firebase';
import { useState } from 'react';
import { UserAuth } from '~/contexts/authContext';
import image from '~/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt, faCircle, faCircleInfo, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Button from '~/component/Button/Button';
import routes from '~/config/routes';
import ChatItem from '~/component/ChatItem/ChatItem';
import Mentions from '~/component/Mentions/Mentions';
import ChatInput from '~/component/ChatInput/ChatInput';
import { useRef } from 'react';
import { ThemeContext } from '~/contexts/Context';
const cx = classNames.bind(styles);

function Chat() {
    const { roomId } = useParams();
    const chat = useRef();
    const { user,usersList,userData } = UserAuth();
    const [correspondent, setCorrespondent] = useState();
    const [roomData, setRoomData] = useState();
    const [text, setText] = useState();
    const [messages,setMessages]  = useState();
    const context = useContext(ThemeContext)
    useEffect(() => {
        const fetchRoom = async () => {
            const a = await getDoc(doc(db, 'chats', roomId));
            setRoomData(a.data());
            if (a.data().id1 === user.uid) {
                setCorrespondent(usersList.filter((obj) => obj.id === a.data().id2)[0]);
            } else {
                setCorrespondent(usersList.filter((obj) => obj.id === a.data().id1)[0]);
            }
        };
       
        fetchRoom();
    }, [roomId,usersList]);
    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'chats', roomId, 'messages'),orderBy('time')), async (docs) => {
                let tmp = [];

                docs.forEach((doc) => {
                    tmp.push({id:doc.id,data:doc.data()});
                });
                
                let otherMsg = tmp.filter((obj) => obj.data.sender !== user.uid && obj.data.seen === false)
                otherMsg.forEach((msg) => {
                    updateDoc(doc(db,'chats',roomId,'messages',msg.id), {
                        seen:true
                    })
                })
                console.log(tmp)
                setMessages(tmp);
            },
        );
        console.log('rerender')
        return () => unsubscribe();
    }, [roomId]);
    useEffect(() => {
        if(correspondent) {
             chat.current.scrollTop = chat.current.scrollHeight;
        }
    },[correspondent,messages]  )
    return (
        <>
            {correspondent && (
                <div className={cx('wrapper',{dark:context.theme === 'dark'})}>
                    <div className={cx('user-info')}>
                        <Image src={correspondent.data.user_avatar} className={cx('avatar')} alt="avatar" />
                        <div className={cx('column')}>
                            <span className={cx('name')}>{correspondent.data.user_name}</span>
                            <div className={cx('row')}>
                                <span className={cx('status')}>{correspondent.data.user_status}</span>
                                <FontAwesomeIcon icon={faCircle} className={cx('icon', { [correspondent.data.user_status]: true })} />
                            </div>
                        </div>

                        <a href={`mailto:${correspondent.data.user_email}`} className={cx('user-options')}>
                            <FontAwesomeIcon icon={faAt} />
                        </a>
                        <Link to={routes.user + correspondent.id} className={cx('user-options')}>
                            <FontAwesomeIcon icon={faCircleInfo} />
                        </Link>
                    </div>
                    <div className={cx('chat-box')} ref={chat}>
                        <span className={cx('first-text')}>Chat with {correspondent.data.user_name} now</span>
                        {
                            messages?.map((msg,id) =>{
                                const me = msg.data.sender === user.uid
                                let data = null
                                if(me){
                                    data = {...msg.data,name:userData.user_name,ava:userData.user_avatar}
                                }else{
                                    data = {...msg.data,name:correspondent.data.user_name,ava:correspondent.data.user_avatar}
                                }
                                return <ChatItem key={id} data={data} me={me}/>
                            })
                        }
                    </div>
                    <div className={cx('input')}>
                        <ChatInput roomId={roomId}/>
                    </div>
                </div>
            )}
        </>
    );
}

export default Chat;
