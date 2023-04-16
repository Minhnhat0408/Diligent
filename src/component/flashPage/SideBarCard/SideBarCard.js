import { useState } from "react";
import classNames from "classnames/bind";
import styles from './SideBarCard.module.scss';
import FaceCard from "../FaceCard";
const cx = classNames.bind(styles);

const SideBarCard = () => {

    let [listCard, setLisCard] = useState( [{age:10, name:'quyen'},
        {age:11, name: 'dung'},
        {age: 12, name:'phuong'},
        {age:14, name:'minh'},
        {age:16, name: 'khai'},
        {age: 15, name:'thuy'},
        {age:17, name:'ngoc'}]    ) 
    return (
        <>
        <div className={cx('sidebar')}>
            {listCard.map((item, index) => {
                return (
                    <div className={cx('boxcard')}>
                        <FaceCard key={index} child={item.name} />
                    </div> 
                )
            })}
        </div>
        </>
    )
}

export default SideBarCard;