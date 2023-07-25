import classNames from 'classnames/bind';
import styles from './CommentLoading.module.scss';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
const cx = classNames.bind(styles);

function CommentLoading() {
    const context = useContext(ThemeContext);
    return (
        <div className={cx('wrapper', { dark: context.theme === 'dark' }) + ' animate-pulse'}>
            <div>
                <div className={cx('ava')}></div>
            </div>
            <div>
                <div className={cx('name')}></div>
                <div className={cx('content')}></div>
                <div className={cx('row')}>
                    <div className={cx('btn')}></div>
                    <div className={cx('btn')}></div>
                </div>
            </div>
        </div>
    );
}

export default CommentLoading;
