import classNames from 'classnames/bind';
import styles from './Ban.module.scss';
import getTimeDiff from '~/utils/timeDiff';
import { UserAuth } from '~/contexts/authContext';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Ban({ children, onXmark, noPopup }) {
    const { user,usersStatus } = UserAuth();

    const context = useContext(ThemeContext);
    return (
        <>
            {noPopup ? (
                <>
                    <div className={cx('row')}>
                        <FontAwesomeIcon icon={faClock} className={cx('ban-icon')} />
                        <span className={cx('timer')}>
                            {getTimeDiff(usersStatus[user.uid]?.user_banUntil.toMillis(), new Date())} left
                        </span>
                    </div>
                    <span className={cx('text')}>{children}</span>
                </>
            ) : (
                <div className={cx('pop-up')}>
                    <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
                        <div className={cx('out')} onClick={() => onXmark(false)}>
                            <FontAwesomeIcon icon={faXmark} />
                        </div>
                        <div className={cx('row')}>
                            <FontAwesomeIcon icon={faClock} className={cx('ban-icon')} />
                            <span className={cx('timer')}>
                                {getTimeDiff(usersStatus[user.uid]?.user_banUntil.toMillis(), new Date())} left
                            </span>
                        </div>
                        <span className={cx('text')}>{children}</span>
                    </div>
                </div>
            )}
        </>
    );
}

export default Ban;
