import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import Image from '../../Image';
import styles from './StoryItem.module.scss';
import { ThemeContext } from '~/contexts/Context';
import { useContext } from 'react';

const cx = classNames.bind(styles);

function StoryItem({ avatar, title, detail, to }) {
    const context = useContext(ThemeContext)
    return (
        <Link className={cx('wrapper', { dark: context.theme === 'dark' })} to={to}>
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
