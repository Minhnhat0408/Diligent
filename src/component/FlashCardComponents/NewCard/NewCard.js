import React from "react";
import classNames from "classnames/bind";
import styles from './NewCard.module.scss'
import { useState } from "react";

const cx = classNames.bind(styles);

const NewCard = ({creatCard, handleAdd}) => {
    const [nameCard, setNameCard] = useState('');


    const submitCard = (e) => {
        creatCard({age:19, name: nameCard})
        handleAdd();
        setNameCard('')
    }

    return (
        <>
        <div className={cx('contain')}>
            <form onSubmit={(e) => submitCard(e.preventDefault())}>

            <input type="text" className={cx('nameCard')}
            value={nameCard}
            placeholder="new card"
            onChange={(e) => setNameCard(e.target.value)}/>
            </form>

        </div>
        
        </>
    )
}

export default NewCard;