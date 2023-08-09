import classNames from 'classnames/bind';
import styles from './FlashCard.module.scss';
import SideBarCard from '~/component/FlashCardComponents/SideBarCard';
import SpaceFlash from '~/component/FlashCardComponents/SpaceFlash';
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
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
    const context = useContext(ThemeContext);
    useEffect(() => {
        const fetchCards = async () => {
            const a = await getDocs(collection(db, 'flashcards', id, 'cards'));
            const results = [];
            a.docs.forEach((doc, ind) => {
                results.push({ id: doc.id, front: doc.data().front, order: ind + 1, back: doc.data().back, pos: 0 });
            });
            setCards(results);
        };

        const fetchDeck = async () => {
            const d = await getDoc(doc(db, 'flashcards', id));

            setDeck({ id: d.id, data: d.data() });
        };
        fetchCards();
        fetchDeck();
    }, [id]);

    return (
        <>
            {deck && (
                <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
                    <SideBarCard deck={deck} cards={cards} />
                    <SpaceFlash cards={cards} />
                </div>
            )}
        </>
    );
}

export default FlashCard;
