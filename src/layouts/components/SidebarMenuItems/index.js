import { faTelevision, faTv, faTvAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import styles from './SidebarMenuItems.module.scss'

const cx = classNames.bind(styles)

function SidebarMenuItems({icon, title, backGroundColor, color, numsNotify}) {
    return ( 
        <div className={cx('wrapper')}>
            <div>
                <div className={cx('icon-wrapper')} style={{background: backGroundColor, color: color}}>
                    {icon}
                </div>
    
                <span className={cx('title')}>{title}</span>
            </div >

            { numsNotify > 0 && <div className={cx('notification')}>{numsNotify}</div>}
        </div>
     );
}

export default SidebarMenuItems;