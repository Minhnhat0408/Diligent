import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import Image from '../../Image';
import styles from './StoryItem.module.scss';

const cx = classNames.bind(styles);

function StoryItem({ avatar, title, detail, to }) {
    return (
        <Link className={cx('wrapper')} to={to}>
            {avatar === undefined ? (
                <div className={cx('add')}>
                    <i class="fa-light fa-plus"></i>
                </div>
            ) : (
                <Image src={avatar} alt="avatar" className={cx('avatar')} />
            )}
            <div className={cx('info')}>
                <h5 className={cx('title')}>{title}</h5>
                {detail && <p className={cx('detail')}>{detail}</p>}
            </div>
        </Link>
    );
}

export default StoryItem;
