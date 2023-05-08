import classNames from 'classnames/bind';
import styles from './Stories.module.scss';
import { useState, useRef, useContext, useEffect } from 'react';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Story from '../Story';
import { ThemeContext } from '~/contexts/Context';
import { collection, getDocs, query, serverTimestamp } from 'firebase/firestore';
import { db } from '~/firebase';

const cx = classNames.bind(styles);

function Stories() {
    // 133 là width một story + margin
    const TRANSX = 133;
    let currentIndex = useRef(0);
    const context = useContext(ThemeContext);
    const [transX, setTransX] = useState(0);

    const handleClickRight = function () {
        // Tính toán vị trí mới của stories
        const newTransX = transX - TRANSX;
        // Tăng currentIndex lên 1
        currentIndex.current = Math.min(currentIndex.current + 1, stories.length - 1);
        setTransX(newTransX);
    };

    const handleClickLeft = function () {
        // Tính toán vị trí mới của stories
        const newTransX = transX + TRANSX;
        // Giảm currentIndex xuống 1
        currentIndex.current = Math.max(currentIndex.current - 1, 0);
        setTransX(newTransX);
    };

    //get stories
    const [stories, setStories] = useState([]);
    const [storiesData, setStoriesData] = useState([])

    useEffect(() => {
        async function getStories() {
            const q = query(collection(db, 'stories'));
            const querySnapshot = await getDocs(q);
            const docs = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setStoriesData(docs);
            const storyByUserId = Object.values(
                docs.reduce((acc, story) => {
                    const val = {
                        userId: story.user.id,
                        username: story.user.name,
                        avatar: story.user.avatar,
                        img: story.type === 'image' ? story.media[0] : ''
                    };
                    if (!acc[val.userId]) {
                        acc[val.userId] = val;
                    }
        
                    return acc;
                }, {}),
            );
            setStories(storyByUserId)
        }
        getStories()
    }, [])

    console.log(stories);

    return (
        <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
            {/* Nếu vị trí stories hiện tại không phải là vị trí đầu tiên, hiển thị nút điều hướng sang trái */}
            {transX !== 0 && (
                <div className={cx('arrow-left', 'arrow')} onClick={handleClickLeft}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
            )}

            {/* Hiển thị các stories */}
            <div className={cx('stories-wrapper')} style={{ transform: `translateX(${transX}px)` }}>
                <Story icon="faPlus" username="Add story" to="/createStory"/>
                {stories != null && stories.map((story) => (
                    <Story img={story.avatar} username={story.username} bg={story.img} to="/story"/>
                ))}
            </div>

            {/* Nếu vị trí stories hiện tại không phải là vị trí cuối cùng, hiển thị nút điều hướng sang phải */}
            {currentIndex.current < stories.length - 4 && (
                <div className={cx('arrow-right', 'arrow')} onClick={handleClickRight}>
                    <FontAwesomeIcon icon={faArrowRight} />
                </div>
            )}
        </div>
    );
}

export default Stories;
