import classNames from 'classnames/bind';
import styles from './FlashCard.module.scss';
const cx = classNames.bind(styles);

function FlashCard() {
    return (
        <div className={cx('wrapper')}>
            <h2>FlashCard page</h2>
        </div>
    );
}

export default FlashCard;
