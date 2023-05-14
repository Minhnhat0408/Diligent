import classNames from 'classnames/bind';
import styles from './FlashCard.module.scss';
import SideBarCard from '~/component/FlashCardComponents/SideBarCard';
import SpaceFlash from '~/component/FlashCardComponents/SpaceFlash';
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '~/firebase';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
const cx = classNames.bind(styles);

// const page

function FlashCard() {
    const [deck, setDeck] = useState();
    const { id } = useParams();
    const [cards, setCards] = useState({});
    const context = useContext(ThemeContext)
    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(db, 'flashcards', id, 'cards')), async (docs) => {
            let tmp = [];
            console.log(docs.docs)
            tmp = docs.docs
            const results =[]
             tmp.forEach((doc,ind) => {
                results.push({ id: doc.id, front: doc.data().front,order:ind+1, back: doc.data().back, pos: 0 });
            })
            setCards(results);
        });
        return () => unsubscribe();
    }, [id]);
    console.log(cards)
    useEffect(() => {
        // const fetchDeckInfo = async () => {
        //     const d = await getDoc(doc(db, 'flashcards', id));
        //     setDeck({ id: d.id, data: d.data() });
        // };
        // fetchDeckInfo();
        const unsubscribe = onSnapshot(query(doc(db, 'flashcards', id)), async (doc) => {
            setDeck({ id: doc.id, data: doc.data() });
        });
        return () => unsubscribe();
    }, [id]);

    return (
        <>
            {deck && (
                <div className={cx('wrapper',{dark:context.theme === 'dark'})}>
                    <SideBarCard deck={deck} cards={cards} />
                    <SpaceFlash cards={cards} />
                </div>
            )}
        </>
    );
}

export default FlashCard;
