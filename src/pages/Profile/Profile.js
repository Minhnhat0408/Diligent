import classNames from 'classnames/bind';
import Button from '~/component/Button';
import styles from './Profile.module.scss';
import { useParams } from 'react-router-dom';
import { collection, getDoc, doc, updateDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '~/firebase';
import { UserAuth } from '~/contexts/authContext';
import { arrayUnion } from 'firebase/firestore';
import type from '~/config/typeNotification';
import routes from '~/config/routes';
import { useContext, useEffect, useState } from 'react';
import {
    faAddressCard,
    faAt,
    faCalendar,
    faCancel,
    faEllipsis,
    faMars,
    faMessage,
    faPhone,
    faUserFriends,
    faVenus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CreatePost from '~/component/CreatePost';
import Post from '~/component/Post';
import Image from '~/component/Image';
import { RingLoader } from 'react-spinners';
import { ThemeContext } from '~/contexts/Context';
const cx = classNames.bind(styles);

function Profile() {
    const { id } = useParams();
    const { user, userData } = UserAuth();
    const [disabled, setDisabled] = useState(false);
    const [pageUser, setPageUser] = useState(undefined);
    const [previewAvatar,setPreviewAvatar] = useState(false)
    const context = useContext(ThemeContext);
    // const time = new Date(userData.user_createdAt.toMillis()) ;
    // console.log(time.toLocaleString())
    // const a = Date.now() -userData.user_createdAt.toMillis()
    // console.log(getTimeDiff(Date.now(),userData.user_createdAt.toMillis()))

    useEffect(() => {
        
        console.log(user?.uid)
        if (user?.uid !== id) {
                getDoc(doc(db, 'users', id)).then((doc) => {
                    const friendRq = doc.data().user_friendRequests;
                    setPageUser(doc.data());
                    if(user) {
                        const sent = friendRq.some((friendRequest) => {
                            return friendRequest.id === user.uid;
                        });
                        const friend = doc.data().user_friends.some((friend) => {
                            return friend.id === user.uid;
                        });
                        setDisabled(sent || friend);
                    }
                });
        } else {
                setPageUser(userData);
        }
      
        
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
                type: 'addfr',
                time: serverTimestamp(),
                read: false,
            });

            setDisabled(true);
            await addDoc(collection(db, 'users', id, 'notifications'), {
                title: type.addfr,
                url: routes.user + user.uid,
                sender: {
                    id: user.uid,
                    name: userData.user_name,
                    avatar: userData.user_avatar,
                },
                type: 'addfr',
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
        <>
            {!pageUser ? (
                <div className="pop-up loader">
                    <RingLoader color="#367fd6" size={150} speedMultiplier={0.5} />
                </div>
            ) : (
         
                <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
                    <div className={cx('infor')}>
                        <div className={cx('section')}>
                            <Image src="fesf" alt="background-image" className={cx('background-ava')} />
                            <div className={cx('represent')}>
                                <Image src={pageUser.user_avatar} alt="avatar" onClick={() => setPreviewAvatar(true)} className={cx('ava')} />
                                <h4 className={cx('name')}>
                                    {pageUser.user_name}{' '}
                                    {pageUser.user_gender === 'male' ? (
                                        <FontAwesomeIcon icon={faMars} />
                                    ) : (
                                        <FontAwesomeIcon icon={faVenus} />
                                    )}
                                </h4>
                                <p className={cx('bio')}>{pageUser.user_bio}</p>
                            </div>
                            <div className={cx('stats')}>
                                <div className={cx('stats_num')}>
                                    <h4>452</h4>
                                    <p>Posts</p>
                                </div>
                                <div className={cx('stats_num')}>
                                    <h4>{pageUser.user_friends.length}</h4>
                                    <p>Friends</p>
                                </div>

                                <div className={cx('stats_num')}>
                                    <h4>10</h4>
                                    <p>Decks</p>
                                </div>
                            </div>
                            <div className={cx('options')}>
                                {id === user?.uid ? (
                                    <>
                                        <Button className={cx('btn')} dark={context.theme === 'dark'} primary>
                                            Create
                                        </Button>
                                        <Button xs dark={context.theme === 'dark'} outline>
                                            <i className={`fa-regular fa-bolt`}></i>
                                        </Button>
                                        <Button className={cx('btn')} dark={context.theme === 'dark'} outline>
                                            Edit
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            disabled={disabled}
                                            leftIcon={
                                                !disabled ? (
                                                    <FontAwesomeIcon icon={faUserFriends} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faCancel} />
                                                )
                                            }
                                            dark={context.theme === 'dark'}
                                            primary
                                            small
                                            onClick={handleAddfr}
                                        >
                                            {disabled ? 'Requesting' : 'Add friend'}
                                        </Button>
                                        <Button xs outline dark={context.theme === 'dark'}>
                                            <FontAwesomeIcon icon={faMessage} />
                                        </Button>
                                        <Button xs outline dark={context.theme === 'dark'}>
                                            <FontAwesomeIcon icon={faEllipsis} />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className={cx('section')}>
                            <h4 className={cx('title')}>About</h4>
                            <div className={cx('about')}>
                                <FontAwesomeIcon className={cx('icon')} icon={faCalendar} />
                                <div>
                                    <p className={cx('about_title')}>Date of Birth</p>
                                    <p className={cx('about_info')}>{pageUser.user_dob} </p>
                                </div>
                            </div>
                            <div className={cx('about')}>
                                <FontAwesomeIcon className={cx('icon')} icon={faAt} />
                                <div>
                                    <p className={cx('about_title')}>Email</p>
                                    <p className={cx('about_info')}>{pageUser.user_email} </p>
                                </div>
                            </div>
                            <div className={cx('about')}>
                                <FontAwesomeIcon className={cx('icon')} icon={faPhone} />
                                <div>
                                    <p className={cx('about_title')}>Phone</p>
                                    <p className={cx('about_info')}>{pageUser.user_phone} </p>
                                </div>
                            </div>
                            <div className={cx('about')}>
                                <FontAwesomeIcon className={cx('icon')} icon={faAddressCard} />
                                <div>
                                    <p className={cx('about_title')}>Address</p>
                                    <p className={cx('about_info')}>{pageUser.user_address} </p>
                                </div>
                            </div>
                        </div>
                        {/* Flash card recently used */}
                    </div>

                    <div className={cx('content')}>
                        {user &&   <CreatePost/> }
                        <Post />
                        <Post />
                        <Post />
                    </div>
                    {previewAvatar && <div className={cx('pop-up')} onClick={() => setPreviewAvatar(false)}>
                        <Image src={pageUser.user_avatar} className={cx('preview')} alt="preview"/>
                    </div> }
                </div>
           
            )}
        </>
    );
}

export default Profile;
