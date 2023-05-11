import classNames from 'classnames/bind';
import styles from './FlashCard.module.scss';
import SideBarCard from '~/component/FlashCardComponents/SideBarCard';
import SpaceFlash from '~/component/FlashCardComponents/SpaceFlash';
import {
    collection,
    onSnapshot,
    query,
    where,
} from 'firebase/firestore';
import { db } from '~/firebase';
import { useState,useEffect } from 'react';
import { useParams } from 'react-router';
import { useSpringRef, useTransition, animated } from '@react-spring/web';
const cx = classNames.bind(styles);

// const page 

function FlashCard() {

    const {id} = useParams();
    const [cards,setCards] = useState({});
    let [listDeck, setLisDeck] = useState( [{age:1, name:'quyen'},
        {age: 2, name: 'dung'},
        {age: 3, name:'phuong'},
        {age: 4, name:'minh'},
        {age: 5, name: 'khai'},
        {age: 6, name:'thuy'},
        {age: 7, name:'ngoc'}]   
    ) 

    // useEffect(() => {
    //     const unsubscribe = onSnapshot(
    //         query(collection(db, 'flashcards', id, 'cards')), async (docs) => {
    //             let tmp = [];
    //             docs.forEach((doc) => {
    //                 return {id:doc.id,front:doc.data().front, back:doc.data().back,pos:0}
    //             });
    //             setCards(tmp);
    //         },
    //     );
    //     return () => unsubscribe();
    // },[id])
    // const file1 = [
    //     {id: 1 , title: "day la the so 1", back: "mat sau the so 1", pos: 0 },
    //     {id: 2 , title: "day la the so 2", back: "mat sau the so 2", pos: 0 },
    //     {id: 3 , title: "day la the so 3", back: "mat sau the so 3", pos: 0 },
    //     {id: 4 , title: "day la the so 4", back: "mat sau the so 4", pos: 0 },
    //     {id: 5 , title: "day la the so 5", back: "mat sau the so 5", pos: 0 },
    //     {id: 6 , title: "day la the so 6", back: "mat sau the so 6", pos: 0 },
    //     {id: 7 , title: "day la the so 7", back: "mat sau the so 7", pos: 0 },
    //     {id: 8 , title: "day la the so 8", back: "mat sau the so 8", pos: 0 },
    // ]

        // const file2 = [
        //     {id: 1 , title: "day la the so 1.2", back: "mat sau the so 1", pos: 0 },
        //     {id: 2 , title: "day la the so 2.2", back: "mat sau the so 2", pos: 0 },
        //     {id: 3 , title: "day la the so 3.2", back: "mat sau the so 3", pos: 0 },
            
        // ]

    const [idDeck, setIdDeck] = useState(0);
    const handlePick = (item) => {
        setIdDeck(item.age -1);

    }
    const creatDeck = (deck) => {
        setLisDeck([deck, ...listDeck])
        console.log(listDeck)
    }
    return (
        <div className={cx('wrapper')}>

            <SideBarCard listDeck={listDeck} handlePick={handlePick} creatDeck={creatDeck}/>
            <SpaceFlash idDeck={idDeck}/>
            
        </div>
    );
}

export default FlashCard;
