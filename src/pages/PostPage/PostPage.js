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
import Post from '~/component/Post/Post';
import { Slide } from 'react-slideshow-image';
import { isImageUrl, isVideoUrl } from '~/utils/checkFile';
import 'react-slideshow-image/dist/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(styles);

function PostPage() {
    const navigate = useNavigate();
    const { posts } = UserAuth();
    const { id, num } = useParams();
    const [postData, setPostData] = useState();
    useEffect(() => {
        setPostData(
            posts.filter((post) => {
                return post.id === id;
            })[0].data,
        );
    }, [posts]);
    console.log(id, num);
    console.log(postData);
    return (
        <>
            {postData && (
                <PostProvider id={id} data={postData} page>
                    <div className={cx('wrapper')}>
                        <div className={cx('image-display')}>
                            {postData.files.media.length <= 1 ? (
                                <div className={cx('each-slide-effect')}>
                                    <Image src={postData.files.media[0]} alt="preview" className={cx('image')} />
                                </div>
                            ) : (
                                <Slide
                                    defaultIndex={Number(num)}
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
                                                    <video className={cx('image')}>
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
                        {console.log(postData, 'fefefe')}
                        <div className={cx('post-info')}>
                            <Post page />
                        </div>
                    </div>
                </PostProvider>
            )}
        </>
    );
}

export default PostPage;
