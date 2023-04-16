import classNames from 'classnames/bind';
import styles from './FlashCard.module.scss';
import SpaceFlash from '~/component/flashPage/SpaceFlash';
import SideBarCard from '~/component/flashPage/SideBarCard';
const cx = classNames.bind(styles);

function FlashCard() {
    return (
        <div className={cx('wrapper')}>
            <SideBarCard/>
            <SpaceFlash/>
        </div>
    );
}

export default FlashCard;
