import classNames from "classnames/bind";
import styles from  './FaceCard.module.scss';
const cx = classNames.bind(styles);

const FaceCard = ({child}) => {
    
    return (
        <div className={cx('faceCard')}>
            {child}
        </div>
    )
}

export default FaceCard;