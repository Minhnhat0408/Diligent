import classNames from 'classnames/bind'
import styles from './FriendItem.module.scss'
import Image from '~/component/Image';
import image from '~/assets/images';
import Button from '~/component/Button';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
const cx = classNames.bind(styles)

function FriendItem({user}) {
    const context = useContext(ThemeContext)
    return ( 
        <div className={cx('wrapper',{dark:context.theme === "dark"})}>
            <div className={cx('body')}>
                <Image src={user?.ava} className={cx('avatar')} alt='avatar' />
                <div className={cx('info')}>
                    <h4 className={cx('name')}>{user?.name}</h4>
                    <span className={cx('mutual')}>18 mutual friend</span>
                </div>
                
            </div>
            <div className={cx('btn')}> 
                <Button small rounded primary dark={context.theme === 'dark'} >Confirm</Button>
                <Button small rounded >delete</Button>
            </div>
        </div>
     );
}

export default FriendItem;