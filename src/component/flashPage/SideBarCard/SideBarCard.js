import { useState } from "react";
import classNames from "classnames/bind";
import styles from './SideBarCard.module.scss';
import FaceCard from "../FaceCard";
const cx = classNames.bind(styles);

const SideBarCard = () => {

    let [listCard, setLisCard] = useState( [
        {id:1, name:'quyen'},
        {id:2, name:'dung'},
        {id:3, name:'phuong'},
        {id:4, name:'minh'},
        {id:5, name:'khai'},
        {id:6, name:'thuy'},
        {id:7, name:'ngoc'}]   ) 

    const handleShow = (item) => {
        console.log(item);
    }

        
    return (
        <>
        <div className={cx('sidebar')}>
            {listCard.map((item, index) => {
                return (
                    <div className={cx('boxscroll')} >
                        <div className={cx('boxcard')} onClick={() => handleShow(item)} >
                        <FaceCard key={item.id} child={item.name} />
                        </div> 
                        
                        
                    </div>
                )
            })}
        </div>
        </>
    )
}

export default SideBarCard;