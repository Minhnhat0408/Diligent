import classNames from 'classnames/bind';
import Button from '~/component/Button';
import styles from './Profile.module.scss';
import { useParams } from 'react-router-dom';
import {
    collection,
    query,
    where,
    getDoc,
    doc,
    updateDoc,
    FieldValue,
    serverTimestamp,
    setDoc,
    addDoc,
} from 'firebase/firestore';
import { db } from '~/firebase';
import { UserAuth } from '~/contexts/authContext';
import { arrayUnion } from 'firebase/firestore';
import type from '~/config/typeNotification';
import routes from '~/config/routes';
import { useEffect, useState } from 'react'
import { faCancel, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CreatePost from '~/component/CreatePost';
import Post from '~/component/Post';
import Image from '~/component/Image';
const cx = classNames.bind(styles);

function Profile() {
    const { id } = useParams();
    const { user, userData } = UserAuth();
    const [ disabled, setDisabled ] = useState();
    // const time = new Date(userData.user_createdAt.toMillis()) ;
    // console.log(time.toLocaleString())
    // const a = Date.now() -userData.user_createdAt.toMillis()
    // console.log(getTimeDiff(Date.now(),userData.user_createdAt.toMillis()))

    useEffect(() => {
       getDoc(doc(db, 'users', id)).then((doc) => {
            const friendRq = doc.data().user_friendRequests;
            const sent = friendRq.some((friendRequest) => {
                return friendRequest.id === user.uid;
            });
            const friend = doc.data().user_friends.some((friend) => {
                return friend.id === user.uid;
            });
            setDisabled(sent || friend);
        });
    }, [id]);
    const handleAddfr = async () => {
        try {
                await updateDoc(doc(db, 'users', id), {
                    user_friendRequests: arrayUnion({
                        id: user.uid,
                        name: userData.user_name,
                        ava: userData.user_avatar,
                    }),
                });

                await addDoc(collection(db, 'users', id, 'notifications'), {
                    title: type.addfr,
                    url: routes.user + user.uid,
                    sender: {
                        id: user.uid,
                        name: userData.user_name,
                        avatar: userData.user_avatar,
                    },
                    type:'addfr',
                    time: serverTimestamp(),
                    read: false,
                });
              
                setDisabled(true);
            
        } catch (err) {
            console.log(err);
            alert(err);
        }
    };
    return (
        <div className={cx('wrapper')}>
            {/* <Button disabled={disabled} leftIcon={!disabled ?<FontAwesomeIcon icon={faUserFriends}/> : <FontAwesomeIcon icon={faCancel}/>} large primary onClick={handleAddfr}>
                {disabled ? 'Requesting' : 'Add friend'}
            </Button> */}
            <div className={cx('infor')}></div>
                <div className={cx('user')}>
                    <Image src="fesf"alt="background-image"/>
                </div>
            <div className={cx('content')}>
                <CreatePost/>
                <Post />
                <Post />
                <Post />
            </div>
        </div>
    );
}

export default Profile;
