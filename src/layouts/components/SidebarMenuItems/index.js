import { faTelevision, faTv, faTvAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import styles from './SidebarMenuItems.module.scss'
import { memo, useContext } from "react";
import { ThemeContext } from "~/contexts/Context";

const cx = classNames.bind(styles)

function SidebarMenuItems({onClick,icon, title, backGroundColor, color, numsNotify}) {
    const context = useContext(ThemeContext)
    return ( 
        <div  onClick={onClick} className={cx('wrapper',{dark:context.theme === 'dark'})}>
            <div className={cx('row')}>
                <div className={cx('icon-wrapper') + ' 2xl-max:text-[14px]'} style={{background: backGroundColor, color: color}}>
                    {icon}
                </div>
                <span className={cx('title') + " 2xl-max:text-[14px]"}>{title}</span>
            </div >

            { numsNotify > 0 && <div className={cx('notification')}>{numsNotify}</div>}
        </div>
     );
}

export default memo(SidebarMenuItems);