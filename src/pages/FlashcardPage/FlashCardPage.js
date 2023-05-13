import classNames from 'classnames/bind';
import styles from './FlashCardPage.module.scss';
import { useContext, useEffect, useRef, useState } from 'react';
import { ThemeContext } from '~/contexts/Context';
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '~/firebase';
import { UserAuth } from '~/contexts/authContext';
import { Slide } from 'react-slideshow-image';
import {
    faCircle,
    faCircleXmark,
    faK,
    faMagnifyingGlass,
    faPlusCircle,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import { useDebounce } from '~/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import Button from '~/component/Button/Button';
const cx = classNames.bind(styles);

let fakeArr = new Array(15).fill(1);

function FlashCardPage() {
    const context = useContext(ThemeContext);
    const [userDecks, setUserDecks] = useState();
    const [fullDecks, setFullDecks] = useState({ origin: [], display: [] });
    const { user } = UserAuth();
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRef = useRef();
    const debounce = useDebounce(searchValue, 1000);
    const [filter, setFilter] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [animation, setAnimation] = useState(false);

    const onAnimationEnd = () => {
        if (!animation) setShowFilter(false);
    };

    useEffect(() => {
        if (animation) setShowFilter(true);
    }, [animation]);
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
            // let ind = 0
            // const a = await getDocs(collection(db, 'flashcards', '4WMgd0ofcCa8Tgv1nGCG', 'cards'));
            // a.forEach(async (d) => {

            //     await updateDoc(doc(db, 'flashcards', '4WMgd0ofcCa8Tgv1nGCG', 'cards', d.id), {
            //         order:ind+1,
            //     });

            //     ind = ind +1;
            // });
            full.forEach(async (doc) => {
                tmpfull.push({ id: doc.id, data: doc.data() });
                if (doc.data().learners.includes(user.uid)) {
                    tmpUser.push({ id: doc.id, data: doc.data() });
                }
            });
            setFullDecks({ origin: tmpfull, display: tmpfull });
            setUserDecks(tmpUser);
        };
        fetchDecks();
    }, []);

    useEffect(() => {
        if (searchValue.trim()) {
            setLoading(true);
            const fetchData = (value) => {
                const search = fullDecks.origin.filter((deck) => {
                    return deck.data.name.toLowerCase().includes(value.toLowerCase());
                });
                setTimeout(() => {
                    setFullDecks({ origin: fullDecks.origin, display: search });
                    setLoading(false);
                }, 500);
            };
            fetchData(debounce);
        } else {
            setFullDecks({ origin: fullDecks.origin, display: fullDecks.origin });
            setLoading(false);
        }
    }, [debounce]);
    const handleClear = () => {
        setSearchValue('');

        inputRef.current.focus();
    };
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
                        {grDeck.map((d, ind) => {
                            return (
                                <Link key={ind} className={cx('deck')} to={routes.flashcard + d.id}>
                                    <div className={cx('name')}>{d.data.name}</div>
                                    <div className={cx('info')}>
                                        <FontAwesomeIcon icon={faStar} className={cx('ratings')} />
                                        <span className={cx('num')}>{d.data.ratings.length}</span>
                                        <div className={cx('time')}>
                                            {new Date(d.data.createdAt.toMillis()).toLocaleDateString('en-GB')}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                );
            });
        }
    };
    const handleSearch = (e) => {
        const value = e.target.value;
        if (!value.startsWith(' ')) {
            setSearchValue(value);
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
                        {userDecks?.map((deck, ind) => {
                            return (
                                <Link key={ind} className={cx('deck')} to={routes.flashcard + deck.id}>
                                    <div className={cx('name')}>{deck.data.name}</div>
                                    <div className={cx('info')}>
                                        <FontAwesomeIcon icon={faStar} className={cx('ratings')} />
                                        <span className={cx('num')}>{deck.data.ratings.length}</span>
                                        <div className={cx('time')}>
                                            {new Date(deck.data.createdAt.toMillis()).toLocaleDateString('en-GB')}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
            <div className={cx('all')}>
                <div className={cx('options')}>
                    <div className={cx('search', { dark: context.theme === 'dark' })}>
                        <input
                            ref={inputRef}
                            value={searchValue}
                            placeholder="Search documents here"
                            spellCheck="false"
                            onChange={handleSearch}
                        ></input>

                        {loading && <FontAwesomeIcon icon={faSpinner} className={cx('spinner')}></FontAwesomeIcon>}
                        {!!searchValue && !loading && (
                            <button className={cx('clear')} onClick={handleClear}>
                                <FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon>
                            </button>
                        )}

                        <button className={cx('search-button')} onMouseDown={(e) => e.preventDefault()}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} className={cx('search-icon')}></FontAwesomeIcon>
                        </button>
                    </div>
                    <div className={cx('end')}>
                        <Button dark={context.theme === 'dark'} className={cx('btn')} primary leftIcon={<FontAwesomeIcon icon={faPlusCircle} />}>
                            Add Deck
                        </Button>
                        <Button outline  className={cx('filter')} dark={context.theme === 'dark'} onClick={() => setAnimation(!animation)}>
                            {filter ? <span>{filter}</span> : <span>Filter</span>}
                        </Button>
                        {showFilter && (
                            <div
                                className={cx('filter-opt', { show: animation, hide: !animation })}
                                onAnimationEnd={onAnimationEnd}
                            >
                                <div
                                    onClick={() => {
                                        setAnimation(!animation);
                                        setFilter('Latest Decks');
                                        // setComments((prev) =>
                                        //     prev.sort((a, b) => b.data.time.seconds - a.data.time.seconds),
                                        // );
                                    }}
                                >
                                    Latest Decks
                                </div>
                                <div
                                    onClick={() => {
                                        setAnimation(!animation);
                                        setFilter('Popular');
                                        // setComments((prev) => prev.sort((a, b) => b.data.like.count - a.data.like.count));
                                    }}
                                >
                                    Popular
                                </div>
                                <div
                                    onClick={() => {
                                        setAnimation(!animation);
                                        setFilter('Oldest Decks');
                                        // setComments((prev) =>
                                        //     prev.sort((a, b) => a.data.time.seconds - b.data.time.seconds),
                                        // );
                                    }}
                                >
                                    Oldest Decks
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={cx('all-decks')}>
                    {fullDecks?.display.map((deck, ind) => {
                        return (
                            <div key={ind} className={cx('deck-full')}>
                                <Link
                                    className={cx('deck')}
                                    to={routes.flashcard + deck.id}
                                    onClick={() => addDeckLearner(deck.id)}
                                >
                                    <div className={cx('name')}>{deck.data.name}</div>
                                    <div className={cx('info')}>
                                        <FontAwesomeIcon icon={faStar} className={cx('ratings')} />
                                        <span className={cx('num')}>{deck.data.ratings.length}</span>
                                        <div className={cx('time')}>
                                            {new Date(deck.data.createdAt.toMillis()).toLocaleDateString('en-GB')}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default FlashCardPage;
