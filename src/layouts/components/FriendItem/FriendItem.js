import classNames from 'classnames/bind';
import styles from './FriendItem.module.scss';
import Image from '~/component/Image';
import Button from '~/component/Button';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
import { UserAuth } from '~/contexts/authContext';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '~/config/routes';
import { GlobalProps } from '~/contexts/globalContext';


const cx = classNames.bind(styles);

function FriendItem({ data }) {
    const context = useContext(ThemeContext);
    const {handleAccept,handleDecline } = GlobalProps();
    const navigate = useNavigate()  
    return (
        <div className={cx('wrapper', { dark: context.theme === 'dark' }) }>
            <div className={cx('body')} onClick={() => navigate(routes.user + data.id)}>
                <Image src={data?.ava} className={cx('avatar') + " 2xl-max:h-9 2xl-max:w-9"}  alt="avatar" />
                <div className={cx('info')}>
                    <h4 className={cx('name') + " 2xl-max:text-[14px]" }>{data?.name}</h4>
                    <span className={cx('mutual')  + " 2xl-max:text-[12px]"}>18 mutual friend</span>
                </div>
            </div>
            <div className={cx('btn') }>
                <Button onClick={() => {handleAccept(data)}} small className={' 2xl-max:text-[12px] 2xl-max:min-w-[60px]'} rounded primary dark={context.theme === 'dark'}>
                    Confirm
                </Button>
                <Button onClick={() => {handleDecline(data)}} className={"2xl-max:text-[12px] 2xl-max:min-w-[60px]"} small rounded>
                    delete
                </Button>
            </div>
        </div>
    );
}

export default memo(FriendItem);
