import classNames from 'classnames/bind';
import styles from './Chat.module.scss';
const cx = classNames.bind(styles);

function Chat() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('user-info')}>
                
            </div>
            <div className={cx('chat-box')}></div>
            <div className={cx('input')}>

            </div>
        </div>
    );
}

export default Chat;
