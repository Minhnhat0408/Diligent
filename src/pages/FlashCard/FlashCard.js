import classNames from 'classnames/bind';
import styles from './FlashCard.module.scss';
import SideBarCard from '~/component/FlashCardComponents/SideBarCard';
import SpaceFlash from '~/component/FlashCardComponents/SpaceFlash';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '~/firebase';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
import { UserAuth } from '~/contexts/authContext';
const cx = classNames.bind(styles);

// const page

function FlashCard() {
    const [deck, setDeck] = useState();
    const { id } = useParams();
    const [cards, setCards] = useState({});
    const { user } = UserAuth();
    const context = useContext(ThemeContext);
    useEffect(() => {
        const fetchCards = async () => {
            const a = await getDocs(
                query(collection(db, 'flashcards'), where('deckId', '==', id), orderBy('time', 'desc')),
            );
            const cardData = await Promise.all(
                a.docs.map(async (d) => {
                    const userProgress = await getDoc(doc(db, 'flashcards', d.id, 'progress', user.uid));
                    if (userProgress.data()) {
                  
                            return {
                                id: d.id,
                                front: d.data().front,
                                back: d.data().back,
                                progress: userProgress.data(),
                            };
                       
                    } else {
                        return { id: d.id, front: d.data().front, back: d.data().back, progress: undefined };
                    }
                }),
            );

            const graduated = cardData
                .filter((item) => item.progress !== undefined)
                .filter((item) => new Date(item.progress.reviewTime.toMillis()) < new Date())
                .sort((a, b) => a.progress.reviewTime - b.progress.reviewTime);
            const learning = cardData.filter((item) => item.progress === undefined);

            setCards([...learning, ...graduated]);
        };

        const fetchDeck = async () => {
            const d = await getDoc(doc(db, 'decks', id));

            setDeck({ id: d.id, data: d.data() });
        };
        fetchCards();
        fetchDeck();
    }, [id]);

    console.log(cards);
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
