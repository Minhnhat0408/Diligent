import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
const cx = classNames.bind(styles);

function Profile() {
    return (
        <div className={cx('wrapper')}>
            <h2>Profile page</h2>
        </div>
    );
}

export default Profile;
