import classNames from 'classnames/bind';
import styles from './FlashCard.module.scss';
import SideBarCard from '~/component/FlashCardComponents/SideBarCard';
import SpaceFlash from '~/component/FlashCardComponents/SpaceFlash';
import { useState } from 'react';
import { useSpringRef, useTransition, animated } from '@react-spring/web';
const cx = classNames.bind(styles);

// const page 

function FlashCard() {

    let [listCard, setLisCard] = useState( [{age:1, name:'quyen'},
        {age: 2, name: 'dung'},
        {age: 3, name:'phuong'},
        {age: 4, name:'minh'},
        {age: 5, name: 'khai'},
        {age: 6, name:'thuy'},
        {age: 7, name:'ngoc'}]   
    ) 

    const file1 = [
        {id: 1 , title: "day la the so 1", back: "mat sau the so 1", pos: 0 },
        {id: 2 , title: "day la the so 2", back: "mat sau the so 2", pos: 0 },
        {id: 3 , title: "day la the so 3", back: "mat sau the so 3", pos: 0 },
        {id: 4 , title: "day la the so 4", back: "mat sau the so 4", pos: 0 },
        {id: 5 , title: "day la the so 5", back: "mat sau the so 5", pos: 0 },
        {id: 6 , title: "day la the so 6", back: "mat sau the so 6", pos: 0 },
        {id: 7 , title: "day la the so 7", back: "mat sau the so 7", pos: 0 },
        {id: 8 , title: "day la the so 8", back: "mat sau the so 8", pos: 0 },
    ]

    const file2 = [
        {id: 1 , title: "day la the so 1.2", back: "mat sau the so 1", pos: 0 },
        {id: 2 , title: "day la the so 2.2", back: "mat sau the so 2", pos: 0 },
        {id: 3 , title: "day la the so 3.2", back: "mat sau the so 3", pos: 0 },
        
    ]

    const [card, setCard] = useState(0);
    const handlePick = (item) => {
        setCard(item.age -1);

    }

    
    const creatCard = (card) => {
        setLisCard([card, ...listCard])
        console.log(listCard)
    }
    

    return (
        <div className={cx('wrapper')}>

            <SideBarCard listCard={listCard} handlePick={handlePick} creatCard={creatCard}/>
            
            
            <SpaceFlash card={card}/>
            
        </div>
    );
}

export default FlashCard;
