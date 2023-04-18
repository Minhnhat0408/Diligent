import classNames from 'classnames/bind';
import styles from './FlashCard.module.scss';
import SideBarCard from '~/component/FlashCardComponents/SideBarCard';
import SpaceFlash from '~/component/FlashCardComponents/SpaceFlash';
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
