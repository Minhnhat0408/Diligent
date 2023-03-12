import classNames from 'classnames/bind';
import styles from './Story.module.scss';
const cx = classNames.bind(styles);

function Story() {
    return (
        <div className={cx('wrapper')}>
            <h2>Story page</h2>
        </div>
    );
}

export default Story;
