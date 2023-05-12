import classNames from 'classnames/bind';
import styles from './FlashCardPage.module.scss';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '~/contexts/Context';
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '~/firebase';
import { UserAuth } from '~/contexts/authContext';
import { Slide } from 'react-slideshow-image';
import { faK } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
const cx = classNames.bind(styles);

let fakeArr = new Array(15).fill(1);

function FlashCardPage() {
    const context = useContext(ThemeContext);
    const [userDecks, setUserDecks] = useState();
    const [fullDecks, setFullDecks] = useState();
    const { user, userData } = UserAuth();

    //add userid into deck's learners
    const addDeckLearner = async (id) => {
        try {
            await updateDoc(doc(db, 'flashcards', id), {
                learners: arrayUnion(user.uid),
            });
        } catch (err) {
            console.log(err);
        }
    };

    //fetch decks for page
    useEffect(() => {
        const fetchDecks = async () => {
            const q = query(collection(db, 'flashcards'));
            const full = await getDocs(q);
            const tmpfull = [];
            const tmpUser = [];
            full.forEach(async (doc) => {
                // await updateDoc(doc(db,'flashcards',doc.id),{
                //     contributor:{
                //         id:user.uid,
                //         name:userData.users_name,
                //         ava: userDat
                //     },
                //     cardNumber:0,
                //     ratings:0,
                //     description:'This is my deck',
                //     createdAt:serverTimestamp(),
                //     name:'Tu vung N3',
                //     learners:arrayUnion(user.uid),

                // })
                tmpfull.push({ id: doc.id, data: doc.data() });
                if (doc.data().learners.includes(user.uid)) {
                    tmpUser.push({ id: doc.id, data: doc.data() });
                }
            });
            setFullDecks(tmpfull);
            setUserDecks(tmpUser);
        };
        fetchDecks();
    }, []);
    const renderUserDeck = () => {
        if (userDecks) {
            const result = [];
            const length = userDecks.length;
            const numOfSubArrays = Math.ceil(length / 4);
            for (let i = 0; i < numOfSubArrays; i++) {
                const subArray = userDecks.slice(i * 4, (i + 1) * 4);
                result.push(subArray);
            }
            return result.map((grDeck, ind) => {
                return (
                    <div className={cx('row')}>
                        {grDeck.map((d) => {
                            return (
                                <Link className={cx('deck')} to={routes.flashcard + d.id}>
                                    <div className={cx('name')}>{d.data.name}</div>
                                </Link>
                            );
                        })}
                    </div>
                );
            });
        }
    };

    return (
        <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
            <div className={cx('user-decks')}>
                {userDecks?.length > 4 ? (
                    <Slide transitionDuration={500} indicators={false} autoplay={false} canSwipe={true}>
                        {renderUserDeck()}
                    </Slide>
                ) : (
                    <div className={cx('row')}>
                        {userDecks?.map((deck) => {
                            return (
                                <Link className={cx('deck')} to={routes.flashcard + deck.id}>
                                    <div className={cx('name')}>{deck.data.name}</div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
            <div className={cx('all')}>
                {fullDecks?.map((deck) => {
                    return (
                        <div className={cx('deck-full')}>
                           <Link className={cx('deck')} to={routes.flashcard + deck.id} onClick={() => addDeckLearner(deck.id)}>
                                    <div className={cx('name')}>{deck.data.name}</div> 
                                </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default FlashCardPage;
