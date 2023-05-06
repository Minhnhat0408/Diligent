import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Story.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

const icons = {
    faPlus: faPlus,
}

function Story({ img, username, icon, to, bg }) {
    const iconObj = icon ? icons[icon] : null;
    return (
        <Link className={cx('wrapper')} to={to} style={{backgroundImage: bg && `url(${bg})`}}>
            {iconObj ? (
                <div className={cx('icon-wrap')}>
                    <FontAwesomeIcon icon={iconObj} className={cx('icon')} />
                </div>
            ) : (
                <img className={cx('avatar')} src={img} />
            )}
            <h4 className={cx('username')}>{username}</h4>
        </Link>
    );
}

export default Story;
