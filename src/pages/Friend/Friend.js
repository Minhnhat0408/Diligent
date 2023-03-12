import classNames from 'classnames/bind';
import styles from './Friend.module.scss';
const cx = classNames.bind(styles);

function Friend() {
    return (
        <div className={cx('wrapper')}>
            <h2>Friend page</h2>
        </div>
    );
}

export default Friend;
