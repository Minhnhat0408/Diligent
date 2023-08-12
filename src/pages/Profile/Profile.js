import classNames from 'classnames/bind';
import Button from '~/component/Button';
import styles from './Profile.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import {
    collection,
    doc,
    updateDoc,
    serverTimestamp,
    addDoc,
    arrayRemove,
    query,
    where,
    getDocs,
    orderBy,
    limit,
    or,
    startAfter,
    getDoc,
} from 'firebase/firestore';
import { db } from '~/firebase';
import { UserAuth } from '~/contexts/authContext';
import { arrayUnion } from 'firebase/firestore';
import type from '~/config/typeNotification';
import routes from '~/config/routes';
import { useContext, useEffect, useState } from 'react';
import {
    faAddressCard,
    faAt,
    faBan,
    faCalendar,
    faCancel,
    faCheck,
    faCheckCircle,
    faKey,
    faMars,
    faMessage,
    faPhone,
    faUserFriends,
    faVenus,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import Menu from '~/component/Popper/Menu';
import { PROFILE_ADMIN_OPTIONS, PROFILE_FRIEND_OPTIONS, PROFILE_OPTIONS } from '~/utils/constantValue';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CreatePost from '~/component/PostComponents/CreatePost';
import Post from '~/component/PostComponents/Post';
import Image from '~/component/Image';
import { RingLoader } from 'react-spinners';
import { ThemeContext } from '~/contexts/Context';
import { PostProvider } from '~/contexts/Provider';
import Ban from '~/component/Ban/Ban';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostLoading from '~/component/PostComponents/PostLoading/PostLoading';
import { GlobalProps } from '~/contexts/globalContext';

const cx = classNames.bind(styles);

function Profile() {
    const { id } = useParams();
    const { user, userData, unbanUser, fileUpload, banUser,sendReport } = UserAuth();
    const { handleAccept, handleDecline, unFriend,handleAddfr } = GlobalProps();
    const [disabled, setDisabled] = useState('Add friend');
    const [pageUser, setPageUser] = useState(undefined);
    const [previewAvatar, setPreviewAvatar] = useState(false);
    const [userPosts, setUserPosts] = useState([]);
    const [ban, setBan] = useState(userData?.user_status === 'ban');
    const context = useContext(ThemeContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [createBoxVisible, setCreateBoxVisible] = useState(false);
    const [lastPost, setLastPost] = useState(null);
    const [refresh, setReFresh] = useState(false);
    const [star,setStar] = useState(false)
    useEffect(() => {
        if (user?.uid !== id) {
            async function fetchPageUser() {
                const u = await getDoc(doc(db, 'users', id));
                if (!u?.id) {
                    navigate(routes.notFound);
                }
                const friendRq = u.data().user_friendRequests;
                setPageUser(u.data());
                if (user) {
                    const sent = friendRq.some((friendRequest) => {
                        return friendRequest.id === user.uid;
                    });
                    const friend = u.data().user_friends.some((friend) => {
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
                setStar((prev) => {return u.data().user_ratings.includes(user.uid)})
            }
            if(userData) {
                fetchPageUser();
            }
       
        } else {
            setPageUser(userData);
        }
    }, [id, userData]);
    useEffect(() => {
        const fetchUserPosts = async () => {
            const q = query(
                collection(db, 'posts'),
                or(where('user.id', '==', id), where('mentions', 'array-contains', id)),
                orderBy('time', 'desc'),
                limit(5),
            );
            const docs = await getDocs(q);
            const newData = docs.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
            setUserPosts(newData);

            // Update the last post for pagination

            if (docs.docs.length > 0) {
                setLastPost(docs.docs[docs.docs.length - 1]);
            }
            if (docs.docs.length < 5) {
                setLastPost(null);
            }
        };
        fetchUserPosts();
    }, [id]);
    const fetchMorePosts = async () => {
        if (lastPost) {
            let q = query(
                collection(db, 'posts'),
                or(where('user.id', '==', id), where('mentions', 'array-contains', id)),
                orderBy('time', 'desc'),
                startAfter(lastPost),
                limit(5),
            );
            const docs = await getDocs(q);
            const newData = docs.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
            setUserPosts((prevPosts) => [...prevPosts, ...newData]);
            // Update the last post for pagination
            if (docs.docs.length > 0) {
                setLastPost(docs.docs[docs.docs.length - 1]);
            } else {
                // No more documents available
                setLastPost(null);
            }
        }
    };

    const handleBgAvatar = async (e) => {
        const ava = e.target.files[0];
        setLoading(true);
        const newNameFile = `${user.uid}_bg` + ava.name.substring(ava.name.indexOf('.'));

        fileUpload({ file: ava, name: newNameFile, bg_upload: true }).then((res) => {
            setLoading(false);
        });
    };
    const handleUpRatings = async () => {
        if (pageUser.user_ratings.includes(user.uid)) {
            await updateDoc(doc(db, 'users', id), {
                user_ratings: arrayRemove(user.uid),
            });
            setStar(false)
        } else {
            setStar(true)
            await updateDoc(doc(db, 'users', id), {
                user_ratings: [...pageUser.user_ratings, user.uid],
            });
            if (id !== user.uid) {
                const q = query(
                    collection(db, 'users', id, 'notifications'),
                    where('sender.id', '==', user.uid),
                    where('type', '==', 'rating'),
                );
                getDocs(q).then(async (result) => {
                    if (result.docs.length === 0) {
                        await addDoc(collection(db, 'users', id, 'notifications'), {
                            title: type.rating,
                            url: routes.user + user.uid,
                            sender: {
                                id: user.uid,
                                name: userData.user_name,
                                avatar: userData.user_avatar,
                            },
                            type: 'rating',
                            time: serverTimestamp(),
                            read: false,
                        });
                    } else {
                        await updateDoc(doc(db, 'users', id, 'notifications', result.docs[0].id), {
                            time: serverTimestamp(),
                            read: false,
                        });
                    }
                });
            }
        }
    };
    const handleMenuChange = (menuItem) => {
        switch (menuItem.type) {
            case 'unfriend':
                const deleteMe = pageUser.user_friends.filter((friend) => {
                    return friend.id === user.uid;
                });

                unFriend({ data: deleteMe[0], id: id });
                break;
            case 'ban':
                banUser({ id, duration: menuItem.duration });
                break;
            case 'unban':
                unbanUser({ id });
                break;
            case 'report':
                sendReport(menuItem.title, id, 'user');
                break;
            default:
                break;
        }
    };
    
    const handleNavigateChat = async () => {
        const q = query(
            collection(db, 'chats'),
            where('user1.id', 'in', [user.uid, id]),
            where('user2.id', 'in', [user.uid, id]),
        );
        const a = await getDocs(q);
        let tmp = a.docs[0]?.id;
        if (!tmp) {
            const a = await addDoc(collection(db, 'chats'), {
                user1: {
                    id: user.uid,
                    ava: userData.user_avatar,
                    name: userData.user_name,
                    email: userData.user_email,
                },
                user2: {
                    id: id,
                    ava: pageUser.user_avatar,
                    name: pageUser.user_name,
                    email: pageUser.user_email,
                },
                lastView: serverTimestamp(),
            });
            tmp = a.id;
        }
        navigate(routes.chatroom + tmp);
    };

    console.log(((pageUser?.user_status === 'ban' && !user?.isAdmin) || ban) || !user,'fefe')
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
                            <Image
                                src={pageUser?.user_bg || 'ds'}
                                alt="background-image"
                                className={cx('background-ava')}
                            />
                            {id === user?.uid && (
                                <>
                                    <label className={cx('bg-btn')} htmlFor="bg">
                                        <i className="fa-solid fa-pen" />
                                    </label>
                                    <input
                                        onChange={handleBgAvatar}
                                        accept="image/*"
                                        type="file"
                                        id="bg"
                                        className={cx('d-none')}
                                    />
                                </>
                            )}
                            <div className={cx('represent')}>
                                <Image
                                    src={pageUser.user_avatar}
                                    alt="avatar"
                                    onClick={() => setPreviewAvatar(true)}
                                    className={cx('ava')}
                                />
                                <h4 className={cx('name') + ' '}>
                                    {pageUser.user_name}{' '}
                                    {pageUser.user_gender === 'male' ? (
                                        <FontAwesomeIcon icon={faMars} className='text-blue-500'/>
                                    ) : (
                                        <FontAwesomeIcon icon={faVenus} className='text-pink-500' />
                                    )}
                                </h4>
                                <p className={cx('bio')}>{pageUser.user_bio}</p>
                            </div>
                            <div className={cx('stats')}>
                                <div className={cx('stats_num')}>
                                    <h4>{pageUser.user_postNumber}</h4>
                                    <p>Posts</p>
                                </div>
                                <div className={cx('stats_num')}>
                                    <FontAwesomeIcon
                                        icon={star ? solidStar : regularStar}
                                        onClick={handleUpRatings}
                                        className={cx('stars', { active: star   })}
                                    />
                                    <p className={cx('number')}>{pageUser.user_ratings.length}</p>
                                </div>

                                <div className={cx('stats_num')}>
                                    <h4>{pageUser.user_decks}</h4>
                                    <p>Decks</p>
                                </div>
                            </div>
                            <div className={cx('options')}>
                                {id === user?.uid ? (
                                    <>
                                        <Button
                                            disabled={ban}
                                            className={cx('btn')}
                                            dark={context.theme === 'dark'}
                                            onClick={() => setCreateBoxVisible(true)}
                                            primary
                                        >
                                            Post
                                        </Button>
                                        <Button
                                            xs
                                            disabled={ban}
                                            dark={context.theme === 'dark'}
                                            onClick={() => navigate(routes.story + user.uid)}
                                            outline
                                        >
                                            <i className={`fa-regular fa-bolt`}></i>
                                        </Button>
                                        <Button
                                            disabled={ban}
                                            className={cx('btn')}
                                            dark={context.theme === 'dark'}
                                            onClick={() => navigate(routes.flashcard)}
                                            outline
                                        >
                                            Learn
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
                                                    disabled={pageUser.user_status === 'ban' || ban ||!user}
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
                                                    disabled={pageUser.user_status === 'ban' || ban || !user}
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
                                                    disabled={disabled === 'Friend' || disabled === 'Requesting' || ban || !user}
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
                                                    onClick={() => {handleAddfr({id:id,setDisabled:setDisabled})}}
                                                >
                                                    {disabled}
                                                </Button>
                                                <Button
                                                    xs
                                                    disabled={
                                                        disabled !== 'Friend' || pageUser.user_status === 'ban' || ban || !user
                                                    }
                                                    outline
                                                    dark={context.theme === 'dark'}
                                                    onClick={handleNavigateChat}
                                                    className={cx('btn')}
                                                >
                                                    <FontAwesomeIcon icon={faMessage} />
                                                </Button>

                                                <Menu
                                                    offset={[0, 30]}
                                                    
                                                    disabled={((pageUser.user_status === 'ban' && !user?.isAdmin) || ban) || !user}
                                                    // chinh ben trai / chieu cao so vs ban dau
                                                    placement="right"
                                                    item={
                                                        user?.isAdmin
                                                            ? pageUser.user_status === 'ban'
                                                                ? [
                                                                      {
                                                                          type: 'unban',
                                                                          icon: <FontAwesomeIcon icon={faKey} />,
                                                                          title: 'Unban',
                                                                      },
                                                                  ]
                                                                : PROFILE_ADMIN_OPTIONS
                                                            : disabled === 'Friend'
                                                            ? PROFILE_FRIEND_OPTIONS
                                                            : PROFILE_OPTIONS
                                                    }
                                                    small
                                                    onChange={handleMenuChange}
                                                >
                                                    <Button
                                                        xs
                                                        ml
                                                        outline
                                                        className={cx('btn')}
                                                        dark={context.theme === 'dark'}
                                                        disabled={
                                                            (pageUser.user_status === 'ban' && !user?.isAdmin) || ban || !user
                                                        }
                                                    >
                                                        <i className="fa-solid fa-ellipsis"></i>
                                                    </Button>
                                                </Menu>
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

                    {pageUser.user_status === 'ban' ? (
                        user?.uid !== id ? (
                            <div className={cx('ban')}>
                                <FontAwesomeIcon icon={faBan} className={cx('ban-icon')} />
                                <span> This user is currently being banned</span>
                            </div>
                        ) : (
                            <div className={cx('ban')}>
                                <Ban noPopup={true}>You have been banned for inappropriate behaviours</Ban>
                            </div>
                        )
                    ) : (
                        <div className={cx('content')}>
                            {user && (
                                <CreatePost
                                    show={createBoxVisible}
                                    setShow={setCreateBoxVisible}
                                    setReFresh={setReFresh}
                                />
                            )}

                            {userPosts ? (
                                <InfiniteScroll
                                    dataLength={userPosts.length}
                                    next={fetchMorePosts}
                                    style={{ overflow: null }}
                                    hasMore={lastPost !== null}
                                    loader={<PostLoading />}
                                >
                                    {userPosts.map((post) => {
                                        return (
                                            <PostProvider
                                                key={post.id}
                                                id={post.id}
                                                setUpdate={setUserPosts}
                                                data={post.data}
                                            >
                                                <Post />
                                            </PostProvider>
                                        );
                                    })}
                                </InfiniteScroll>
                            ) : (
                                <PostLoading />
                            )}
                        </div>
                    )}

                    {previewAvatar && (
                        <div className={cx('pop-up')} onClick={() => setPreviewAvatar(false)}>
                            <Image src={pageUser.user_avatar} className={cx('preview')} alt="preview" />
                        </div>
                    )}
                    {loading && (
                        <div className="pop-up loader">
                            <RingLoader color="#367fd6" size={150} speedMultiplier={0.5} />
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default Profile;
