import classNames from 'classnames/bind';
import styles from './ChatItem.module.scss';

const cx = classNames.bind(styles);

function ChatItem({ userId, userAva, userName, content, timestamp }) {
    return ( 
        <div className={cx('chat-item')}>
            
        </div>
    );
}

export default ChatItem;