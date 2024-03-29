import classNames from 'classnames/bind';
import styles from './Notification.module.scss';
import { useContext, useRef } from 'react';
import { ThemeContext } from '~/contexts/Context';
import Image from '../Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircle,
    faCircleCheck,
    faComment,
    faFlag,
    faQuoteRight,
    faStar,
    faThumbsDown,
    faThumbsUp,
    faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
const cx = classNames.bind(styles);

function Notification({ data, time, ...props }) {
    const context = useContext(ThemeContext);
    const icon = useRef(faUserFriends);
    useEffect(() => {
        if (data.type === 'comment'|| data.type === 'reply') {
            icon.current = faComment;
        } else if (data.type === 'like' || data.type === 'likecmt') {
            icon.current = faThumbsUp;
        } else if (data.type === 'dislike') {
            icon.current = faThumbsDown;
        } else if (data.type === 'report') {
            icon.current = faFlag;
        } else if(data.type === 'menCmt' || data.type === 'mention' ){
            icon.current = faQuoteRight
        } else if(data.type === 'correct'){
            icon.current = faCircleCheck
        } else if(data.type === 'rating'){
            icon.current = faStar
        }
    }, [data.type]);

    return (
        <Link to={data.url} {...props} className={cx('wrapper', { dark: context.theme === 'dark' })}>
            <div className={cx('img')}>
                <Image src={data.sender.avatar} className={cx('avatar') + " 2xl-max:!w-10 2xl-max:!h-10"} alt="avatar" />
                <FontAwesomeIcon icon={icon.current} className={cx('icon') + " 2xl-max:!w-3 + 2xl-max:!h-3 2xl-max:!p-1 2xl-max:!text-[10px] "} />
            </div>
            <div className={cx('info')}>
                <h4 className={cx('content') + " 2xl-max:!text-[14px]"}>
                    <span className={cx('name') }>{data.sender.name}</span> {data.title}
                </h4>
                <span className={cx('time') + " 2xl-max:!text-[12px]"}>{time}</span>
            </div>
            <span className={cx('status', { read: data.read }) + " 2xl-max:!text-[8px]"}>
                <FontAwesomeIcon icon={faCircle} />
            </span>
        </Link>
    );
}

export default Notification;
