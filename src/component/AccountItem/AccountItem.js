import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';
import Image from '../Image';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import routes from '~/config/routes';
const cx = classNames.bind(styles);

function AccountItem({user,search=false,chat=false,dark,...props}) {
    return (
        <Link to={(search && `/user/${user.id}`) ||(chat && routes.chat) } className={cx('wrapper',{dark:dark})}>
        <Image src={user.data.user_avatar} alt="user" className={cx('avatar')} />
            <div className={cx('info')}>
                <h4 className={cx('name')}>
                    <span>{user.data.user_name}</span>
                </h4>
                <span className={cx('icon',{[user.data.user_status]:true})}><FontAwesomeIcon icon={faCircle} /></span>
            </div>
        </Link>
    );
}

AccountItem.propTypes = {
    user: PropTypes.object.isRequired
}
export default memo(AccountItem);
