import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from './CardFlip.module.scss';
import FaceCard from "../FaceCard";
const cx = classNames.bind(styles);

const CardFlip = ({titile, getOldPos0}) => {
    const [flip, setFlip] = useState(true);
    const [pos0, setPos0] = useState(true);
    const [pos1, setPos1] = useState(false);
    const [pos2, setPos2] = useState(false);


    const handFlip = () => {
        setFlip(!flip);
    }

    const handleClick = (titile) => {
        if(pos1 || pos2) {
            getOldPos0(titile);
        }else{
           handFlip(); 
        }
        
    }

    useEffect(() => {
        setPos0(titile.pos === 0);
        setPos1(titile.pos === 1);
        setPos2(titile.pos === 2);

    },[titile.pos])

    return (
        <>
        <div className={cx("card", 
        'card0',
        {'cardmoveon': pos1},
        {'cardmoveunder' : pos2},
        {'cardflip':!flip})} 
        onClick= {() => handleClick(titile)}
            >
            <div className={cx('front')}>
                <FaceCard child = {titile.title}/>
            </div>
            <div className={cx('back')}>
                <FaceCard child = {titile.back}/>
            </div>
        </div>

       
        </>
    )
}

export default CardFlip;