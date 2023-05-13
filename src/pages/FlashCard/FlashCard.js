import classNames from 'classnames/bind';
import styles from './FlashCard.module.scss';
import SideBarCard from '~/component/FlashCardComponents/SideBarCard';
import SpaceFlash from '~/component/FlashCardComponents/SpaceFlash';
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '~/firebase';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
const cx = classNames.bind(styles);

// const page

function FlashCard() {
    const [deck, setDeck] = useState();
    const { id } = useParams();
    const [cards, setCards] = useState({});
    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(db, 'flashcards', id, 'cards'),orderBy('order')), async (docs) => {
            let tmp = [];
            docs.forEach((doc) => {
                tmp.push({ id: doc.id, front: doc.data().front,order:doc.data().order, back: doc.data().back, pos: 0 });
            });
            setCards(tmp);
        });
        return () => unsubscribe();
    }, [id]);
    useEffect(() => {
        // const fetchDeckInfo = async () => {
        //     const d = await getDoc(doc(db, 'flashcards', id));
        //     setDeck({ id: d.id, data: d.data() });
        // };
        // fetchDeckInfo();
        const unsubscribe = onSnapshot(query(doc(db, 'flashcards', id)), async (doc) => {
            setDeck({ id: doc.id, data: doc.data() });
            console.log('change')
        });
        return () => unsubscribe();
    }, [id]);

    return (
        <>
            {deck && (
                <div className={cx('wrapper')}>
                    <SideBarCard deck={deck} cards={cards} />
                    <SpaceFlash cards={cards} />
                </div>
            )}
        </>
    );
}

export default FlashCard;
