import { faArrowLeft, faArrowRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { useState } from 'react';
import Story from '~/layouts/components/Story';

const cx = classNames.bind(styles);

// mô phỏng code array 
const arr = [
    {
        img: "https://media.istockphoto.com/id/688550958/vector/black-plus-sign-positive-symbol.jpg?s=612x612&w=0&k=20&c=0tymWBTSEqsnYYXWeWmJPxMotTGUwaGMGs6BMJvr7X4=",
        username: "Add Story"
    },
    {
        img: "https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/36412437_273721143203802_2074360962202206208_n.jpg?stp=dst-jpg_p320x320&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=Eb6QDbr2oG4AX-bJx3J&_nc_ht=scontent.fhan5-2.fna&oh=00_AfBLWT1gxiUiBn2OofknxOGlOR2Sg2TSrn99MYDTrmjVPw&oe=6436B37F",
        username: "ehehe"
    },
    {
        img: "https://scontent.fhan5-8.fna.fbcdn.net/v/t1.6435-9/73193899_527297831179464_3787718584461950976_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=174925&_nc_ohc=HuQ5h__-0bkAX-4_w3q&_nc_ht=scontent.fhan5-8.fna&oh=00_AfC_v3FGQmPlsbHYlYiPm676HWOHHMYufVlupj8xs3XvHg&oe=6436B180",
        username: "ehihi"
    },
    {
        img: "https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/51132488_1049848925197144_4209746563502702592_n.jpg?stp=dst-jpg_p320x320&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_ohc=D0l0v2-LRTQAX-m-0Vy&_nc_ht=scontent.fhan5-2.fna&oh=00_AfCR1s3kNejBEf5jFfl-zH0RFXqteRrtLbPh2_yP8h8NqQ&oe=6436D5BE",
        username: "Son"
    },
    {
        img: "https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/36412437_273721143203802_2074360962202206208_n.jpg?stp=dst-jpg_p320x320&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=Eb6QDbr2oG4AX-bJx3J&_nc_ht=scontent.fhan5-2.fna&oh=00_AfBLWT1gxiUiBn2OofknxOGlOR2Sg2TSrn99MYDTrmjVPw&oe=6436B37F",
        username: "ehehe"
    },
    {
        img: "https://scontent.fhan5-8.fna.fbcdn.net/v/t1.6435-9/73193899_527297831179464_3787718584461950976_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=174925&_nc_ohc=HuQ5h__-0bkAX-4_w3q&_nc_ht=scontent.fhan5-8.fna&oh=00_AfC_v3FGQmPlsbHYlYiPm676HWOHHMYufVlupj8xs3XvHg&oe=6436B180",
        username: "ehihi"
    },
    {
        img: "https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/51132488_1049848925197144_4209746563502702592_n.jpg?stp=dst-jpg_p320x320&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_ohc=D0l0v2-LRTQAX-m-0Vy&_nc_ht=scontent.fhan5-2.fna&oh=00_AfCR1s3kNejBEf5jFfl-zH0RFXqteRrtLbPh2_yP8h8NqQ&oe=6436D5BE",
        username: "Son"
    },
    {
        img: "https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/36412437_273721143203802_2074360962202206208_n.jpg?stp=dst-jpg_p320x320&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=Eb6QDbr2oG4AX-bJx3J&_nc_ht=scontent.fhan5-2.fna&oh=00_AfBLWT1gxiUiBn2OofknxOGlOR2Sg2TSrn99MYDTrmjVPw&oe=6436B37F",
        username: "ehehe"
    },
    {
        img: "https://scontent.fhan5-8.fna.fbcdn.net/v/t1.6435-9/73193899_527297831179464_3787718584461950976_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=174925&_nc_ohc=HuQ5h__-0bkAX-4_w3q&_nc_ht=scontent.fhan5-8.fna&oh=00_AfC_v3FGQmPlsbHYlYiPm676HWOHHMYufVlupj8xs3XvHg&oe=6436B180",
        username: "ehihi"
    },
    {
        img: "https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/51132488_1049848925197144_4209746563502702592_n.jpg?stp=dst-jpg_p320x320&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_ohc=D0l0v2-LRTQAX-m-0Vy&_nc_ht=scontent.fhan5-2.fna&oh=00_AfCR1s3kNejBEf5jFfl-zH0RFXqteRrtLbPh2_yP8h8NqQ&oe=6436D5BE",
        username: "Son"
    },
    {
        img: "https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/36412437_273721143203802_2074360962202206208_n.jpg?stp=dst-jpg_p320x320&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=Eb6QDbr2oG4AX-bJx3J&_nc_ht=scontent.fhan5-2.fna&oh=00_AfBLWT1gxiUiBn2OofknxOGlOR2Sg2TSrn99MYDTrmjVPw&oe=6436B37F",
        username: "ehehe"
    },
    {
        img: "https://scontent.fhan5-8.fna.fbcdn.net/v/t1.6435-9/73193899_527297831179464_3787718584461950976_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=174925&_nc_ohc=HuQ5h__-0bkAX-4_w3q&_nc_ht=scontent.fhan5-8.fna&oh=00_AfC_v3FGQmPlsbHYlYiPm676HWOHHMYufVlupj8xs3XvHg&oe=6436B180",
        username: "ehihi"
    },
    {
        img: "https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/51132488_1049848925197144_4209746563502702592_n.jpg?stp=dst-jpg_p320x320&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_ohc=D0l0v2-LRTQAX-m-0Vy&_nc_ht=scontent.fhan5-2.fna&oh=00_AfCR1s3kNejBEf5jFfl-zH0RFXqteRrtLbPh2_yP8h8NqQ&oe=6436D5BE",
        username: "Son"
    },
    {
        img: "https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/36412437_273721143203802_2074360962202206208_n.jpg?stp=dst-jpg_p320x320&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=Eb6QDbr2oG4AX-bJx3J&_nc_ht=scontent.fhan5-2.fna&oh=00_AfBLWT1gxiUiBn2OofknxOGlOR2Sg2TSrn99MYDTrmjVPw&oe=6436B37F",
        username: "ehehe"
    },
    {
        img: "https://scontent.fhan5-8.fna.fbcdn.net/v/t1.6435-9/73193899_527297831179464_3787718584461950976_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=174925&_nc_ohc=HuQ5h__-0bkAX-4_w3q&_nc_ht=scontent.fhan5-8.fna&oh=00_AfC_v3FGQmPlsbHYlYiPm676HWOHHMYufVlupj8xs3XvHg&oe=6436B180",
        username: "ehihi"
    },
    {
        img: "https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/51132488_1049848925197144_4209746563502702592_n.jpg?stp=dst-jpg_p320x320&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_ohc=D0l0v2-LRTQAX-m-0Vy&_nc_ht=scontent.fhan5-2.fna&oh=00_AfCR1s3kNejBEf5jFfl-zH0RFXqteRrtLbPh2_yP8h8NqQ&oe=6436D5BE",
        username: "Son"
    },
    {
        img: "https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/36412437_273721143203802_2074360962202206208_n.jpg?stp=dst-jpg_p320x320&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=Eb6QDbr2oG4AX-bJx3J&_nc_ht=scontent.fhan5-2.fna&oh=00_AfBLWT1gxiUiBn2OofknxOGlOR2Sg2TSrn99MYDTrmjVPw&oe=6436B37F",
        username: "ehehe"
    },
    {
        img: "https://scontent.fhan5-8.fna.fbcdn.net/v/t1.6435-9/73193899_527297831179464_3787718584461950976_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=174925&_nc_ohc=HuQ5h__-0bkAX-4_w3q&_nc_ht=scontent.fhan5-8.fna&oh=00_AfC_v3FGQmPlsbHYlYiPm676HWOHHMYufVlupj8xs3XvHg&oe=6436B180",
        username: "ehihi"
    },
    {
        img: "https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/51132488_1049848925197144_4209746563502702592_n.jpg?stp=dst-jpg_p320x320&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_ohc=D0l0v2-LRTQAX-m-0Vy&_nc_ht=scontent.fhan5-2.fna&oh=00_AfCR1s3kNejBEf5jFfl-zH0RFXqteRrtLbPh2_yP8h8NqQ&oe=6436D5BE",
        username: "Son"
    },
]

function Home() {
    const TRANSX = 150;

    const [transX, setTransX] = useState(0);

    const handleClickRight = function () {
        setTransX(transX - TRANSX);
    };

    const handleClickLeft = function() {
        setTransX(transX + TRANSX)
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('newsfeed')}>
                <div className={cx('stories')}>

                    {transX != 0 && <div className={cx('arrow-left', 'arrow')} onClick={handleClickLeft}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>}

                    <div className={cx('stories-wrapper')} style={{transform: `translateX(${transX}px)`}}>

                        {arr.map((a, index) => (
                            <Story img={a.img} username={a.username} key={index}/>
                        ))}

                    </div>

                    {-arr.length * 125 < transX && <div className={cx('arrow-right', 'arrow')} onClick={handleClickRight}>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </div>}
                </div>

                <div className={cx('create-post')}>
                    <div>
                        <img
                            src="https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/51132488_1049848925197144_4209746563502702592_n.jpg?stp=cp0_dst-jpg_p60x60&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_ohc=YqssQlfWBRMAX9aqJII&_nc_ht=scontent.fhan5-2.fna&oh=00_AfA-SLB3ehGS7-RZtGcl7UiYur-t62x70NDU0DaAvq4vVA&oe=6433C23E"
                            className={cx('avatar')}
                        />
                        <div className={cx('input')}>
                            <span>What's on your mind?</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('card-info')}></div>
        </div>
    );
}

export default Home;
