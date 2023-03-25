import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import Image from '../Image';
import styles from './StoryItem.module.scss';

const cx = classNames.bind(styles);

function StoryItem({ avatar, title, detail }) {
    return (
        <div className={cx('wrapper')}>
            {avatar == undefined ? (
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
        </div>
    );
}

export default StoryItem;
