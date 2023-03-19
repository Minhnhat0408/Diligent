import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';
import Image from '../Image';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
const cx = classNames.bind(styles);

function AccountItem({user,dark}) {
    return (
        <Link to={`/user/${user.id}`} className={cx('wrapper',{dark:dark})}>
        <Image src={user.data.user_avatar} alt="user" className={cx('avatar')} />
            <div className={cx('info')}>
                <h4 className={cx('name')}>
                    <span>{user.data.user_name}</span>
                </h4>
            </div>
        </Link>
    );
}

AccountItem.propTypes = {
    user: PropTypes.object.isRequired
}
export default AccountItem;
