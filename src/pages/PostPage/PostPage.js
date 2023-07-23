import classNames from 'classnames/bind';
import styles from './PostPage.module.scss';
import Image from '~/component/Image/Image';
import { useNavigate, useParams } from 'react-router-dom';
import routes from '~/config/routes';
import { POST_OPTIONS, USER_POST_OPTIONS, getIdInMentions, regex } from '~/utils/constantValue';
import { UserAuth } from '~/contexts/authContext';
import { useEffect } from 'react';
import { useState } from 'react';
import { PostProvider } from '~/contexts/Provider';
import Post from '~/component/PostComponents/Post/Post';
import { Slide } from 'react-slideshow-image';
import { isImageUrl, isVideoUrl } from '~/utils/checkFile';
import 'react-slideshow-image/dist/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '~/firebase';
const cx = classNames.bind(styles);

function PostPage() {
    const navigate = useNavigate();
    const { id, num } = useParams();
    const { user } = UserAuth();
    const [postData, setPostData] = useState();
    const context = useContext(ThemeContext);
    useEffect(() => {
        getDoc(doc(db, 'posts', id)).then((post) => {
            if (!post?.data()) {
                navigate(routes.notFound);
            } else {
                if (user) {
                    console.log('hello');
                    if (
                        post.data().like.list.some((u) => {
                            return u.id === user.uid;
                        })
                    ) {
                        setPostData({ ...post.data(), react: 1 }); // 1 mean like
                    } else if (
                        post.data().dislike.list.some((u) => {
                            return u.id === user.uid;
                        })
                    ) {
                        setPostData({ ...post.data(), react: -1 }); // -1 mean dislike
                    } else {
                        setPostData({ ...post.data(), react: 0 }); // 0 mean neutral
                    }
                } else {
                    setPostData(post.data());
                }
            }
        });
    }, [id]);
    console.log(postData);
    return (
        <>
            {postData && (
                <PostProvider id={id} data={postData} page>
                    <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
                        {postData.files.media.length > 0 && (
                            <div className={cx('image-display')}>
                                {postData.files.media.length <= 1 ? (
                                    <div className={cx('each-slide-effect')}>
                                        <Image src={postData.files.media[0]} alt="preview" className={cx('image')} />
                                    </div>
                                ) : (
                                    <Slide
                                        defaultIndex={num ? Number(num) : 0}
                                        transitionDuration={500}
                                        indicators={true}
                                        autoplay={false}
                                        canSwipe={false}
                                    >
                                        {postData.files.media.map((url, id) => {
                                            let result = undefined;
                                            if (isImageUrl(url)) {
                                                result = (
                                                    // trao doi vi tri anh
                                                    <div className={cx('each-slide-effect')}>
                                                        <Image src={url} alt="preview" className={cx('image')} />
                                                    </div>
                                                );
                                            } else if (isVideoUrl(url)) {
                                                result = (
                                                    <div className={cx('each-slide-effect')}>
                                                        <video controls className={cx('image')}>
                                                            <source src={url} />
                                                        </video>
                                                    </div>
                                                );
                                            }
                                            return result;
                                        })}
                                    </Slide>
                                )}
                                <div className={cx('icon')} onClick={() => navigate(-1)}>
                                    {' '}
                                    <FontAwesomeIcon icon={faXmark} />
                                </div>
                            </div>
                        )}

                        <div className={cx('post-info')}>
                            <Post />
                        </div>
                    </div>
                </PostProvider>
            )}
        </>
    );
}

export default PostPage;
