import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Story.module.scss';

const cx = classNames.bind(styles);

const icons = {
    faPlus: faPlus,
}

function Story({ img, username, icon }) {
    const iconObj = icon ? icons[icon] : null;
    return (
        <div className={cx('wrapper')}>
            {iconObj ? (
                <div className={cx('icon-wrap')}>
                    <FontAwesomeIcon icon={iconObj} className={cx('icon')} />
                </div>
            ) : (
                <img className={cx('avatar')} src={img} />
            )}
            <h4 className={cx('username')}>{username}</h4>
        </div>
    );
}

export default Story;
