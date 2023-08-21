import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SideBarCard.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import Image from '~/component/Image/Image';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { collection, doc, updateDoc, serverTimestamp, addDoc, arrayRemove, deleteDoc } from 'firebase/firestore';
import { db } from '~/firebase';
import { UserAuth } from '~/contexts/authContext';
import Button from '~/component/Button/Button';
import { ThemeContext } from '~/contexts/Context';
import { useContext } from 'react';
import PopUp from '../PopUp/PopUp';
import Warning from '../Warning';
const cx = classNames.bind(styles);

function SideBarCard({ deck, cards }) {
    const [showList, setShowList] = useState(false);
    const { user } = UserAuth();
    const context = useContext(ThemeContext);
    const [updateCard, setUpdateCard] = useState(false);
    const [addCard, setAddCard] = useState(false);
    const [showWarning,setShowWarning] = useState(false)
    const handleUpRatings = async () => {
        if (deck.data.ratings.includes(user.uid)) {
            await updateDoc(doc(db, 'decks', deck.id), {
                ratings: arrayRemove(user.uid),
            });
        } else {
            await updateDoc(doc(db, 'decks', deck.id), {
                ratings: [...deck.data.ratings, user.uid],
            });
        }
    };
    const handleDeleteDeck = async (id) => {
        await deleteDoc(doc(db, 'decks', id));
     
    };
    const handleDeleteCards = async (id) => {
        await deleteDoc(doc(db, 'flashcards',id));
        await updateDoc(doc(db, 'decks', deck.id), {
            cardNumber: deck.data.cardNumber - 1,
        });
    };
    return (
        <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
            <div className={cx('info')}>
                <h4 className={cx('title')}>{deck.data.name}</h4>
                <p className={cx('description')}>"{deck.data.description}"</p>
                <div className={cx('contributor')}>
                    <p className={cx('name')}>{deck.data.contributor.name}</p>
                    <Image src={deck.data.contributor.ava} alt="ava" className={cx('avatar')} />
                </div>
                <div className={cx('stats')}>
                    <div className={cx('stats_num')}>
                        <h4>{deck.data.learners.length}</h4>
                        <p>Learners</p>
                    </div>
                    <div className={cx('stats_num')}>
                        <FontAwesomeIcon
                            icon={deck.data.ratings.includes(user?.uid) ? solidStar : regularStar}
                            onClick={handleUpRatings}
                            className={cx('stars', { active: deck.data.ratings.includes(user?.uid) })}
                        />
                        <p className={cx('number')}>{deck.data.ratings.length}</p>
                    </div>
                    <div className={cx('stats_num')}>
                        <h4>{deck.data.cardNumber}</h4>
                        <p>Cards</p>
                    </div>
                </div>
                <div className={cx('options')}>
                    <Button
                        disabled={user.uid !== deck.data.contributor.id}
                        className={cx('btn')}
                        dark={context.theme === 'dark'}
                        onClick={() => setAddCard(true)}
                        primary
                    >
                        Add
                    </Button>
                    <Button
                        className={cx('btn')}
                        onClick={() => setShowList(!showList)}
                        dark={context.theme === 'dark'}
                        outline
                    >
                        List
                    </Button>
                    <Button
                        disabled={user.uid !== deck.data.contributor.id}
                        className={cx('btn')}
                        onClick={() => setShowWarning(!showWarning)}
                        dark={context.theme === 'dark'}
                        outline
                    >
                        Delete
                    </Button>
                </div>
            </div>
            {showList && (
                <div className={cx('list')}>
                    {cards.map((card, id) => {
                        return (
                            <div className={cx('card')} key={id}>
                                <div className={cx('card-content')} onClick={() => setUpdateCard(true)}>
                                    <span className={cx('front')}>{card.front}</span>
                                    <span className={cx('back')}>{card.back.content}</span>
                                </div>
                                {user.uid === deck.data.contributor.id && (
                                    <FontAwesomeIcon
                                        icon={faXmark}
                                        onClick={() => handleDeleteCards(card.id)}
                                        className={cx('delete')}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
            {addCard && <PopUp setPopup={setAddCard} deck={deck} />}
            {updateCard && <PopUp setPopup={setUpdateCard} />}
            {showWarning && <Warning setShowWarning={setShowWarning} handleDelete={handleDeleteDeck} id={deck.id}/>}
        </div>
    );
}

export default SideBarCard;
