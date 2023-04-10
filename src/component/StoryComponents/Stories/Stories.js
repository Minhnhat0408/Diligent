import classNames from 'classnames/bind';
import styles from './Stories.module.scss';
import { useState, useRef, useContext } from 'react';
import { faArrowLeft, faArrowRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Story from '../Story';
import { ThemeContext } from '~/contexts/Context';

const cx = classNames.bind(styles);

// mô phỏng code array
const arr = [
    {
        icon: 'faPlus',
        username: 'Add Story',
    },
    {
        img: 'https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/36412437_273721143203802_2074360962202206208_n.jpg?stp=dst-jpg_p320x320&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=Eb6QDbr2oG4AX-bJx3J&_nc_ht=scontent.fhan5-2.fna&oh=00_AfBLWT1gxiUiBn2OofknxOGlOR2Sg2TSrn99MYDTrmjVPw&oe=6436B37F',
        username: 'ehehe',
    },
    {
        img: 'https://scontent.fhan5-8.fna.fbcdn.net/v/t1.6435-9/73193899_527297831179464_3787718584461950976_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=174925&_nc_ohc=HuQ5h__-0bkAX-4_w3q&_nc_ht=scontent.fhan5-8.fna&oh=00_AfC_v3FGQmPlsbHYlYiPm676HWOHHMYufVlupj8xs3XvHg&oe=6436B180',
        username: 'ehihi',
    },
    {
        img: 'https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/51132488_1049848925197144_4209746563502702592_n.jpg?stp=dst-jpg_p320x320&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_ohc=D0l0v2-LRTQAX-m-0Vy&_nc_ht=scontent.fhan5-2.fna&oh=00_AfCR1s3kNejBEf5jFfl-zH0RFXqteRrtLbPh2_yP8h8NqQ&oe=6436D5BE',
        username: 'Son',
    },
    {
        img: 'https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/36412437_273721143203802_2074360962202206208_n.jpg?stp=dst-jpg_p320x320&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=Eb6QDbr2oG4AX-bJx3J&_nc_ht=scontent.fhan5-2.fna&oh=00_AfBLWT1gxiUiBn2OofknxOGlOR2Sg2TSrn99MYDTrmjVPw&oe=6436B37F',
        username: 'ehehe',
    },
    {
        img: 'https://scontent.fhan5-8.fna.fbcdn.net/v/t1.6435-9/73193899_527297831179464_3787718584461950976_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=174925&_nc_ohc=HuQ5h__-0bkAX-4_w3q&_nc_ht=scontent.fhan5-8.fna&oh=00_AfC_v3FGQmPlsbHYlYiPm676HWOHHMYufVlupj8xs3XvHg&oe=6436B180',
        username: 'ehihi',
    },
    {
        img: 'https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/51132488_1049848925197144_4209746563502702592_n.jpg?stp=dst-jpg_p320x320&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_ohc=D0l0v2-LRTQAX-m-0Vy&_nc_ht=scontent.fhan5-2.fna&oh=00_AfCR1s3kNejBEf5jFfl-zH0RFXqteRrtLbPh2_yP8h8NqQ&oe=6436D5BE',
        username: 'Son',
    },
    {
        img: 'https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/36412437_273721143203802_2074360962202206208_n.jpg?stp=dst-jpg_p320x320&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=Eb6QDbr2oG4AX-bJx3J&_nc_ht=scontent.fhan5-2.fna&oh=00_AfBLWT1gxiUiBn2OofknxOGlOR2Sg2TSrn99MYDTrmjVPw&oe=6436B37F',
        username: 'ehehe',
    },
    {
        img: 'https://scontent.fhan5-8.fna.fbcdn.net/v/t1.6435-9/73193899_527297831179464_3787718584461950976_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=174925&_nc_ohc=HuQ5h__-0bkAX-4_w3q&_nc_ht=scontent.fhan5-8.fna&oh=00_AfC_v3FGQmPlsbHYlYiPm676HWOHHMYufVlupj8xs3XvHg&oe=6436B180',
        username: 'ehihi',
    },
    {
        img: 'https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/51132488_1049848925197144_4209746563502702592_n.jpg?stp=dst-jpg_p320x320&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_ohc=D0l0v2-LRTQAX-m-0Vy&_nc_ht=scontent.fhan5-2.fna&oh=00_AfCR1s3kNejBEf5jFfl-zH0RFXqteRrtLbPh2_yP8h8NqQ&oe=6436D5BE',
        username: 'Son',
    },
    {
        img: 'https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/36412437_273721143203802_2074360962202206208_n.jpg?stp=dst-jpg_p320x320&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=Eb6QDbr2oG4AX-bJx3J&_nc_ht=scontent.fhan5-2.fna&oh=00_AfBLWT1gxiUiBn2OofknxOGlOR2Sg2TSrn99MYDTrmjVPw&oe=6436B37F',
        username: 'ehehe',
    },
    {
        img: 'https://scontent.fhan5-8.fna.fbcdn.net/v/t1.6435-9/73193899_527297831179464_3787718584461950976_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=174925&_nc_ohc=HuQ5h__-0bkAX-4_w3q&_nc_ht=scontent.fhan5-8.fna&oh=00_AfC_v3FGQmPlsbHYlYiPm676HWOHHMYufVlupj8xs3XvHg&oe=6436B180',
        username: 'ehihi',
    },
    {
        img: 'https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/51132488_1049848925197144_4209746563502702592_n.jpg?stp=dst-jpg_p320x320&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_ohc=D0l0v2-LRTQAX-m-0Vy&_nc_ht=scontent.fhan5-2.fna&oh=00_AfCR1s3kNejBEf5jFfl-zH0RFXqteRrtLbPh2_yP8h8NqQ&oe=6436D5BE',
        username: 'Son',
    },
    {
        img: 'https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/36412437_273721143203802_2074360962202206208_n.jpg?stp=dst-jpg_p320x320&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=Eb6QDbr2oG4AX-bJx3J&_nc_ht=scontent.fhan5-2.fna&oh=00_AfBLWT1gxiUiBn2OofknxOGlOR2Sg2TSrn99MYDTrmjVPw&oe=6436B37F',
        username: 'ehehe',
    },
    {
        img: 'https://scontent.fhan5-8.fna.fbcdn.net/v/t1.6435-9/73193899_527297831179464_3787718584461950976_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=174925&_nc_ohc=HuQ5h__-0bkAX-4_w3q&_nc_ht=scontent.fhan5-8.fna&oh=00_AfC_v3FGQmPlsbHYlYiPm676HWOHHMYufVlupj8xs3XvHg&oe=6436B180',
        username: 'ehihi',
    },
    {
        img: 'https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/51132488_1049848925197144_4209746563502702592_n.jpg?stp=dst-jpg_p320x320&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_ohc=D0l0v2-LRTQAX-m-0Vy&_nc_ht=scontent.fhan5-2.fna&oh=00_AfCR1s3kNejBEf5jFfl-zH0RFXqteRrtLbPh2_yP8h8NqQ&oe=6436D5BE',
        username: 'Son',
    },
    {
        img: 'https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/36412437_273721143203802_2074360962202206208_n.jpg?stp=dst-jpg_p320x320&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=Eb6QDbr2oG4AX-bJx3J&_nc_ht=scontent.fhan5-2.fna&oh=00_AfBLWT1gxiUiBn2OofknxOGlOR2Sg2TSrn99MYDTrmjVPw&oe=6436B37F',
        username: 'ehehe',
    },
    {
        img: 'https://scontent.fhan5-8.fna.fbcdn.net/v/t1.6435-9/73193899_527297831179464_3787718584461950976_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=174925&_nc_ohc=HuQ5h__-0bkAX-4_w3q&_nc_ht=scontent.fhan5-8.fna&oh=00_AfC_v3FGQmPlsbHYlYiPm676HWOHHMYufVlupj8xs3XvHg&oe=6436B180',
        username: 'ehihi',
    },
    {
        img: 'https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/51132488_1049848925197144_4209746563502702592_n.jpg?stp=dst-jpg_p320x320&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_ohc=D0l0v2-LRTQAX-m-0Vy&_nc_ht=scontent.fhan5-2.fna&oh=00_AfCR1s3kNejBEf5jFfl-zH0RFXqteRrtLbPh2_yP8h8NqQ&oe=6436D5BE',
        username: 'Son',
    },
    {
        img: 'https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/36412437_273721143203802_2074360962202206208_n.jpg?stp=dst-jpg_p320x320&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=Eb6QDbr2oG4AX-bJx3J&_nc_ht=scontent.fhan5-2.fna&oh=00_AfBLWT1gxiUiBn2OofknxOGlOR2Sg2TSrn99MYDTrmjVPw&oe=6436B37F',
        username: 'ehehe',
    },
    {
        img: 'https://scontent.fhan5-8.fna.fbcdn.net/v/t1.6435-9/73193899_527297831179464_3787718584461950976_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=174925&_nc_ohc=HuQ5h__-0bkAX-4_w3q&_nc_ht=scontent.fhan5-8.fna&oh=00_AfC_v3FGQmPlsbHYlYiPm676HWOHHMYufVlupj8xs3XvHg&oe=6436B180',
        username: 'ehihi',
    },
    {
        img: 'https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/51132488_1049848925197144_4209746563502702592_n.jpg?stp=dst-jpg_p320x320&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_ohc=D0l0v2-LRTQAX-m-0Vy&_nc_ht=scontent.fhan5-2.fna&oh=00_AfCR1s3kNejBEf5jFfl-zH0RFXqteRrtLbPh2_yP8h8NqQ&oe=6436D5BE',
        username: 'Son',
    },
    {
        img: 'https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/36412437_273721143203802_2074360962202206208_n.jpg?stp=dst-jpg_p320x320&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=Eb6QDbr2oG4AX-bJx3J&_nc_ht=scontent.fhan5-2.fna&oh=00_AfBLWT1gxiUiBn2OofknxOGlOR2Sg2TSrn99MYDTrmjVPw&oe=6436B37F',
        username: 'ehehe',
    },
    {
        img: 'https://scontent.fhan5-8.fna.fbcdn.net/v/t1.6435-9/73193899_527297831179464_3787718584461950976_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=174925&_nc_ohc=HuQ5h__-0bkAX-4_w3q&_nc_ht=scontent.fhan5-8.fna&oh=00_AfC_v3FGQmPlsbHYlYiPm676HWOHHMYufVlupj8xs3XvHg&oe=6436B180',
        username: 'ehihi',
    },
    {
        img: 'https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/51132488_1049848925197144_4209746563502702592_n.jpg?stp=dst-jpg_p320x320&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_ohc=D0l0v2-LRTQAX-m-0Vy&_nc_ht=scontent.fhan5-2.fna&oh=00_AfCR1s3kNejBEf5jFfl-zH0RFXqteRrtLbPh2_yP8h8NqQ&oe=6436D5BE',
        username: 'Son',
    },
    {
        img: 'https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/36412437_273721143203802_2074360962202206208_n.jpg?stp=dst-jpg_p320x320&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=Eb6QDbr2oG4AX-bJx3J&_nc_ht=scontent.fhan5-2.fna&oh=00_AfBLWT1gxiUiBn2OofknxOGlOR2Sg2TSrn99MYDTrmjVPw&oe=6436B37F',
        username: 'ehehe',
    },
    {
        img: 'https://scontent.fhan5-8.fna.fbcdn.net/v/t1.6435-9/73193899_527297831179464_3787718584461950976_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=174925&_nc_ohc=HuQ5h__-0bkAX-4_w3q&_nc_ht=scontent.fhan5-8.fna&oh=00_AfC_v3FGQmPlsbHYlYiPm676HWOHHMYufVlupj8xs3XvHg&oe=6436B180',
        username: 'ehihi',
    },
    {
        img: 'https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/51132488_1049848925197144_4209746563502702592_n.jpg?stp=dst-jpg_p320x320&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_ohc=D0l0v2-LRTQAX-m-0Vy&_nc_ht=scontent.fhan5-2.fna&oh=00_AfCR1s3kNejBEf5jFfl-zH0RFXqteRrtLbPh2_yP8h8NqQ&oe=6436D5BE',
        username: 'Son',
    },
    {
        img: 'https://scontent.fhan5-8.fna.fbcdn.net/v/t1.6435-9/73193899_527297831179464_3787718584461950976_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=174925&_nc_ohc=HuQ5h__-0bkAX-4_w3q&_nc_ht=scontent.fhan5-8.fna&oh=00_AfC_v3FGQmPlsbHYlYiPm676HWOHHMYufVlupj8xs3XvHg&oe=6436B180',
        username: 'ehihi',
    },
    {
        img: 'https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/51132488_1049848925197144_4209746563502702592_n.jpg?stp=dst-jpg_p320x320&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_ohc=D0l0v2-LRTQAX-m-0Vy&_nc_ht=scontent.fhan5-2.fna&oh=00_AfCR1s3kNejBEf5jFfl-zH0RFXqteRrtLbPh2_yP8h8NqQ&oe=6436D5BE',
        username: 'Son',
    },
    {
        img: 'https://scontent.fhan5-8.fna.fbcdn.net/v/t1.6435-9/73193899_527297831179464_3787718584461950976_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=174925&_nc_ohc=HuQ5h__-0bkAX-4_w3q&_nc_ht=scontent.fhan5-8.fna&oh=00_AfC_v3FGQmPlsbHYlYiPm676HWOHHMYufVlupj8xs3XvHg&oe=6436B180',
        username: 'ehihi',
    },
    {
        img: 'https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/51132488_1049848925197144_4209746563502702592_n.jpg?stp=dst-jpg_p320x320&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_ohc=D0l0v2-LRTQAX-m-0Vy&_nc_ht=scontent.fhan5-2.fna&oh=00_AfCR1s3kNejBEf5jFfl-zH0RFXqteRrtLbPh2_yP8h8NqQ&oe=6436D5BE',
        username: 'Son',
    },
];

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
        currentIndex.current = Math.min(currentIndex.current + 1, arr.length - 1);
        setTransX(newTransX);
    };

    const handleClickLeft = function () {
        // Tính toán vị trí mới của stories
        const newTransX = transX + TRANSX;
        // Giảm currentIndex xuống 1
        currentIndex.current = Math.max(currentIndex.current - 1, 0);
        setTransX(newTransX);
    };

    // Tạo một mảng JSX của các stories
    const stories = arr.map((a, index) => {
        return <Story img={a.img} username={a.username} icon={a.icon} key={index} />;
    });
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
                {stories}
            </div>

            {/* Nếu vị trí stories hiện tại không phải là vị trí cuối cùng, hiển thị nút điều hướng sang phải */}
            {currentIndex.current < arr.length - 4 && (
                <div className={cx('arrow-right', 'arrow')} onClick={handleClickRight}>
                    <FontAwesomeIcon icon={faArrowRight} />
                </div>
            )}
        </div>
    );
}

export default Stories;
