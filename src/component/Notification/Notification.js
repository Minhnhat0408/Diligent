import classNames from 'classnames/bind';
import styles from './Notification.module.scss';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
import Image from '../Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faComment, faThumbsDown, faThumbsUp, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);

function Notification({ data,time,...props }) {
    const context = useContext(ThemeContext);
    let icon = faUserFriends;
    if(data.type === "comment" || data.type ==="mention" || data.type === "reply"){
        icon = faComment;
    }else if(data.type === "like"){
        icon = faThumbsUp
    }else if(data.type === "dislike"){
        icon = faThumbsDown
}
 
    return (
        <Link to={data.url} {...props} className={cx('wrapper', { dark: context.theme === 'dark' })}>
            <div className={cx('img')}>
                <Image src={data.sender.avatar} className={cx('avatar')} alt="avatar" />
                <FontAwesomeIcon icon={icon} className={cx('icon')}/>
            </div>
            <div className={cx('info')}>
                <h4 className={cx('content')}>
                    <span className={cx('name')}>{data.sender.name}</span> {data.title}
                </h4>
                <span className={cx('time')}>{time}</span>
            </div>
            <span className={cx('status', { read: data.read })}>
                <FontAwesomeIcon icon={faCircle} />
            </span>
        </Link>
    );
}

export default Notification;
