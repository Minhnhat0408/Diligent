import classNames from 'classnames/bind';
import Button from '~/component/Button';
import styles from './Profile.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
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
    faCheck,
    faCheckCircle,
    faMars,
    faMessage,
    faPhone,
    faUserFriends,
    faUserXmark,
    faVenus,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CreatePost from '~/component/CreatePost';
import Post from '~/component/Post';
import Image from '~/component/Image';
import { RingLoader } from 'react-spinners';
import { ThemeContext } from '~/contexts/Context';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Menu from '~/component/Popper/Menu';
import { isImage } from '~/utils/validator';
const cx = classNames.bind(styles);

const OPTIONS = [
    // {
    //     icon: <FontAwesomeIcon icon={faEarthAsia} />,
    //     title: 'English',
    //     children: {
    //         title: 'Language',
    //         data: listLanguage,
    //     },
    // },
    {
        icon: <FontAwesomeIcon icon={faFlag} />,
        title: 'Report',
        children: {
            title: 'Report',
            data: [
                {
                    type: 'report',
                    title: 'Fake account',
                    children: {
                        title: 'Success',
                        data: [
                            {
                                title: 'Not Working',
                            },
                        ],
                    },
                },
                {
                    type: 'report',
                    title: 'Harassment/Bully',
                    children: {
                        title: 'Success',
                        data: [
                            {
                                title: 'Not Working',
                            },
                        ],
                    },
                },
                {
                    type: 'report',
                    title: 'Inappropriate post',
                    children: {
                        title: 'Success',
                        data: [
                            {
                                title: 'Not Working',
                            },
                        ],
                    },
                },
            ],
        },
    },
    { icon: <FontAwesomeIcon icon={faUserXmark} />, title: 'Unfriend', type: 'unfriend' },
];
function Profile() {
    const { id } = useParams();
    const { user, userData, handleAccept, handleDecline, unFriend } = UserAuth();
    const [disabled, setDisabled] = useState('Add friend');
    const [pageUser, setPageUser] = useState(undefined);
    const [file, setFile] = useState();
    const [previewAvatar, setPreviewAvatar] = useState(false);
    const context = useContext(ThemeContext);
    const navigate = useNavigate();
    const storage = getStorage();
    const metadata = {
        contentType: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'],
    };
    // const time = new Date(userData.user_createdAt.toMillis()) ;
    // console.log(time.toLocaleString())
    // const a = Date.now() -userData.user_createdAt.toMillis()
    // console.log(getTimeDiff(Date.now(),userData.user_createdAt.toMillis()))

    useEffect(() => {
        console.log(user?.uid);

        console.log('rendrererer');
        if (user?.uid !== id) {
            getDoc(doc(db, 'users', id)).then((doc) => {
                const friendRq = doc.data().user_friendRequests;
                setPageUser(doc.data());
                if (user) {
                    const sent = friendRq.some((friendRequest) => {
                        return friendRequest.id === user.uid;
                    });
                    const friend = doc.data().user_friends.some((friend) => {
                        return friend.id === user.uid;
                    });
                    const request = userData.user_friendRequests.some((friend) => {
                        return friend.id === id;
                    });
                    if (sent) {
                        setDisabled('Requesting');
                    } else if (friend) {
                        setDisabled('Friend');
                    } else if (request) {
                        setDisabled('Accept');
                    } else {
                        setDisabled('Add Friend');
                    }
                }
            });
        } else {
            setPageUser(userData);
        }
    }, [id, userData?.user_friendRequests]);
    // useEffect(() => {
    //     console.log(file);
    //     if (file) {
    //         if (isImage(file)) {
    //             const storageRef = ref(storage, `images/${file.name}`);
    //             const uploadTask = uploadBytesResumable(storageRef, file, metadata.contentType);
    //             uploadTask.on(
    //                 'state_changed',
    //                 (snapshot) => {
    //                     const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    //                     console.log('Upload is ' + progress + '% done');
    //                     switch (snapshot.state) {
    //                         case 'paused':
    //                             console.log('Upload is paused');
    //                             break;
    //                         case 'running':
    //                             console.log('Upload is running');
    //                             break;
    //                         default:
    //                             break;
    //                     }
    //                 },
    //                 (error) => {
    //                     alert(error);
    //                 },
    //                 async () => {
    //                     await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //                         updateDoc(doc(db, 'users', user.uid), {
    //                             user_bg: downloadURL,
    //                         });
    //                     });
    //                 },
    //             );
    //         } else {
    //             setFile(null);
    //         }
    //     }
    // }, [file]);
    const handleBgAvatar = (e) => {
        const ava = e.target.files[0];
        setFile(ava);
    };

    const handleMenuChange = (menuItem) => {
        switch (menuItem.type) {
            case 'unfriend':
                const deleteMe = pageUser.user_friends.filter((friend) => {
                    return friend.id === user.uid;
                });

                unFriend({ data: deleteMe[0], id: id });
                break;

            default:
                break;
        }
    };
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
                type: 'addfr',
                time: serverTimestamp(),
                read: false,
            });

            setDisabled('Requesting');
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
                            {id === user?.uid && (
                                <>
                                    <label className={cx('bg-btn', { fail: file === null })} htmlFor="bg">
                                        <i className="fa-solid fa-pen" />
                                    </label>
                                    <input onClick={handleBgAvatar} type="file" id="bg" className={cx('d-none')} />
                                </>
                            )}
                            <div className={cx('represent')}>
                                <Image
                                    src={pageUser.user_avatar}
                                    alt="avatar"
                                    onClick={() => setPreviewAvatar(true)}
                                    className={cx('ava')}
                                />
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
                                        <Button
                                            className={cx('btn')}
                                            dark={context.theme === 'dark'}
                                            onClick={() => navigate(routes.flashcard)}
                                            primary
                                        >
                                            Create
                                        </Button>
                                        <Button
                                            xs
                                            dark={context.theme === 'dark'}
                                            onClick={() => navigate(routes.story)}
                                            outline
                                        >
                                            <i className={`fa-regular fa-bolt`}></i>
                                        </Button>
                                        <Button className={cx('btn')} dark={context.theme === 'dark'} outline>
                                            Edit
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        {disabled === 'Accept' ? (
                                            <>
                                                <Button
                                                    leftIcon={<FontAwesomeIcon icon={faCheck} />}
                                                    dark={context.theme === 'dark'}
                                                    primary
                                                    xl
                                                    onClick={() => {
                                                        handleAccept({
                                                            id: id,
                                                            name: pageUser.user_name,
                                                            ava: pageUser.user_avatar,
                                                        });
                                                    }}
                                                >
                                                    Accept Friend
                                                </Button>
                                                <Button
                                                    leftIcon={<FontAwesomeIcon icon={faXmark} />}
                                                    dark={context.theme === 'dark'}
                                                    outline
                                                    xl
                                                    onClick={() => {
                                                        handleDecline({
                                                            id: id,
                                                            name: pageUser.user_name,
                                                            ava: pageUser.user_avatar,
                                                        });
                                                    }}
                                                >
                                                    Decline Friend
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    disabled={disabled === 'Friend' || disabled === 'Requesting'}
                                                    leftIcon={
                                                        (disabled === 'Friend' && (
                                                            <FontAwesomeIcon icon={faCheckCircle} />
                                                        )) ||
                                                        (disabled === 'Requesting' && (
                                                            <FontAwesomeIcon icon={faCancel} />
                                                        )) || <FontAwesomeIcon icon={faUserFriends} />
                                                    }
                                                    dark={context.theme === 'dark'}
                                                    primary
                                                    small
                                                    onClick={handleAddfr}
                                                >
                                                    {disabled}
                                                </Button>
                                                <Button
                                                    xs
                                                    outline
                                                    dark={context.theme === 'dark'}
                                                    onClick={() => {
                                                        navigate(routes.chat);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faMessage} />
                                                </Button>
                                                <Button xs outline dark={context.theme === 'dark'}>
                                                    <Menu
                                                        offset={[0, 30]}
                                                        // chinh ben trai / chieu cao so vs ban dau
                                                        placement="right"
                                                        item={OPTIONS}
                                                        onChange={handleMenuChange}
                                                    >
                                                        <i className="fa-solid fa-ellipsis"></i>
                                                    </Menu>
                                                </Button>
                                            </>
                                        )}
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
                        {user && <CreatePost />}
                        <Post />
                        <Post />
                        <Post />
                    </div>
                    {previewAvatar && (
                        <div className={cx('pop-up')} onClick={() => setPreviewAvatar(false)}>
                            <Image src={pageUser.user_avatar} className={cx('preview')} alt="preview" />
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default Profile;
