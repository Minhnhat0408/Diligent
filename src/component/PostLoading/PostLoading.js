import classNames from 'classnames/bind';
import styles from './PostLoading.module.scss';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
const cx = classNames.bind(styles);

function PostLoading() {
    const context = useContext(ThemeContext);
    return (
        <div
            className={
                cx('wrapper', { dark: context.theme === 'dark' }) +
                ' sml-max:!min-w-[100%] sml-max:!max-w-[100%] animate-pulse'
            }
        >
            <div className={cx('header')}>
                <div className={cx('info')}>
                    <div className={cx('avatar')}></div>
                    <div className={cx('user')}>
                        <p className={cx('username')}></p>
                        <p className={cx('time')}></p>
                    </div>
                </div>
            </div>
            <div className={cx('options')}>
                <div className={cx('slot')}></div>
                <div className={cx('slot')}></div>
                <div className={cx('slot')}></div>
            </div>
        </div>
    );
}

export default PostLoading;
