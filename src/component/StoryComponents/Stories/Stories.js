import classNames from 'classnames/bind';
import styles from './Stories.module.scss';
import { useState, useRef, useContext, useEffect } from 'react';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Story from '../Story';
import { ThemeContext } from '~/contexts/Context';
import { collection, getDocs, query, serverTimestamp } from 'firebase/firestore';
import { db } from '~/firebase';
import { UserAuth } from '~/contexts/authContext';
import routes from '~/config/routes';

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
    const { stories } = UserAuth();

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
                <Story icon="faPlus" username="Add Shorts" to={routes.createStory}/>
                {Object.keys(stories).map((key, i) => {
                    return <Story img={stories[key][0].data.user.avatar} username={stories[key][0].data.user.name} bg={stories[key][0].data.media[0]} bgColor={stories[key][0].data.content.bgColor} to={routes.story + key} />;
                })}
        </div>
            {/*  */}
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
