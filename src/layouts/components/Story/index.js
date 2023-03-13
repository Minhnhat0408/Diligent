import classNames from 'classnames/bind';
import styles from './Story.module.scss';

const cx = classNames.bind(styles);

function Story({ img, username}) {
    return (
        <div className={cx('wrapper')}>
            <img className={cx('avatar')} src={img} />
            <h4 className={cx('username')}>{username}</h4>
        </div>
    );
}

export default Story;
