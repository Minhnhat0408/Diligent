import { faSave } from "@fortawesome/free-regular-svg-icons";
import { faBookBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import styles from './FuncItem.module.scss'

const cx = classNames.bind(styles)

function FuncItem({icon, title, detail}) {
    return ( 
        <div className={cx('wrapper')}>
            <div className={cx('icon')}>
                {icon}
            </div>
            <div className={cx('info')}>
                <h5 className={cx('title')}>{title}</h5>
                <p className={cx('detail')}>{detail}</p>
            </div>
        </div>
     );
}

export default FuncItem;