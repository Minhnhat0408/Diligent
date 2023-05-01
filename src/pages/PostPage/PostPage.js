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
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
const cx = classNames.bind(styles);

function PostPage() {
    const navigate = useNavigate();
    const { posts } = UserAuth();
    const { id, num } = useParams();
    const [postData, setPostData] = useState();
    const context = useContext(ThemeContext)
    useEffect(() => {
        let count = 0;
        const data = posts.filter((post) => {
            
            return post.id === id;
        })
        if(data.length === 0) {
            navigate(routes.notFound)
        }else{
            setPostData(
            data[0].data
                );
        }
    }, [posts,id]);

    return (
        <>
            {postData && (
                <PostProvider id={id} data={postData} page>
                    <div className={cx('wrapper',{dark: context.theme === 'dark'})}>
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
                                                        <video controls  className={cx('image')}>
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
