import { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SpaceFlash.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRotateLeft,
    faChevronLeft,
    faChevronRight,
    faFloppyDisk,
    faGear,
    faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

import { Toaster } from 'react-hot-toast';
import { ThemeContext } from '~/contexts/Context';
import FlipCard from '~/component/FlipCard';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '~/firebase';
import { UserAuth } from '~/contexts/authContext';
import { toast } from 'react-hot-toast';
import Guide from '../Guide';
import Tippy from '@tippyjs/react';

const cx = classNames.bind(styles);

const SpaceFlash = ({ cards }) => {
    const [displayCards, setDisplayCards] = useState(cards);
    const allCards = useRef(cards);
    const [queueCards, setQueueCards] = useState();
    const [animation, setAnimation] = useState('');
    const context = useContext(ThemeContext);
    const { user } = UserAuth();
    const [timers, setTimers] = useState([]);
    const change = useRef();
    const [showGuide, setShowGuide] = useState(false);

    const graduated = useRef([]);
    const good = useRef([]);

    useEffect(() => {
        setDisplayCards(cards);
        allCards.current = cards;
    }, [cards]);
    useEffect(() => {
        return () => {
            if (change.current > 2) {
                toast.promise(
                    handleSaveProgress(),
                    {
                        loading: 'Saving...',
                        success: <b>Progress saved</b>,
                        error: <b>Could not save</b>,
                    },
                    {
                        style: {
                            minWidth: '250px',
                            minHeight: '60px',
                            fontSize: '20px',
                            backgroundColor: 'var(--primary)',
                            color: 'var(--primary-light) ',
                        },
                        success: {
                            duration: 3000,
                            icon: '🔥',
                        },
                        error: {
                            duration: 3000,
                            icon: '❌',
                            style: {
                                minWidth: '250px',
                                minHeight: '60px',
                                fontSize: '20px',
                                backgroundColor: 'var(--primary)',
                                color: 'red',
                            },
                        },
                    },
                );
            }
        };
    }, []);
 
    //handle add or remove card when animation end
    const onAnimationEnd = () => {
        if (animation !== '') {
            if (displayCards.length > 1) {
                const a = displayCards.slice(0, -1);

                setDisplayCards(a);
            } else {
                if (queueCards) {
                    // console.log('scenario');
                    let a = [];
                    const b = displayCards.slice(0, -1);
                    timers.forEach((t) => {
                        clearTimeout(t.timerId);
                        a.push(t.card);
                    });
                    setDisplayCards([...a, ...b]);
                    setTimers([]);
                    setQueueCards(null);
                } else {
                    const a = displayCards.slice(0, -1);
                    setDisplayCards(a);
                }
            }

            setAnimation('');
        }
    };

    const handleSaveProgress = () => {
        return new Promise(async (resolve, reject) => {
            try {
                for (const card of graduated.current) {
                    allCards.current = allCards.current.filter((c) => c.id !== card.id);
                    if (card.progress) {
                        const interval = Math.round(card.progress.easeFactor * card.progress.interval);
                        card.reviewTime.setDate(card.reviewTime.getDate() + interval);

                        await updateDoc(doc(db, 'flashcards', card.id, 'progress', user.uid), {
                            easeFactor: card.progress.easeFactor,
                            interval: interval,
                            reviewTime: card.reviewTime,
                        });
                    } else {
                        const current = new Date();
                        current.setDate(current.getDate() + 1);
                        await setDoc(doc(db, 'flashcards', card.id, 'progress', user.uid), {
                            easeFactor: 2.5,
                            interval: 1,
                            reviewTime: current,
                        });
                    }
                }

                for (const card of allCards.current) {
                    if (card.reset) {
                        card.reviewTime.setDate(card.reviewTime.getDate() + 1);
                        await updateDoc(doc(db, 'flashcards', card.id, 'progress', user.uid), {
                            easeFactor: card.progress.easeFactor,
                            interval: 1,
                            reviewTime: card.reviewTime,
                        });
                    }
                }

                resolve('Progress saved!');
            } catch (error) {
                console.log(error);
                reject('Could not saved');
            }
        });
    };
    useEffect(() => {
        if (queueCards) {
            if (animation === 'left') {
                if (queueCards.progress) {
                    allCards.current.forEach((c) => {
                        if (c.id === queueCards.id) {
                            c.progress.easeFactor -= 0.2;
                            c.progress.reviewTime = new Date();
                            c.reset = true;
                            return;
                        }
                    });
                    const a = setTimeout(() => {
                        setDisplayCards((prev) => {
                            const newDCards = [...prev];
                            newDCards.splice(-2, 0, queueCards);
                            return newDCards;
                        });
                        setTimers((prev) => prev.filter((p) => p.timerId !== a));
                    }, 600000);
                    setTimers((prev) => [{ timerId: a, card: queueCards }, ...prev]);
                } else {
                    if (good.current.includes(queueCards)) {
                        good.current = good.current.filter((q) => q.id !== queueCards.id);
                    }
                    const a = setTimeout(() => {
                        // console.log(queueCards, 'queue');

                        setDisplayCards((prev) => {
                            const newDCards = [...prev];
                            newDCards.splice(-2, 0, queueCards);
                            return newDCards;
                        });
                        setTimers((prev) => prev.filter((p) => p.timerId !== a));
                    }, 60000);
                    setTimers((prev) => [{ timerId: a, card: queueCards }, ...prev]);
                }
            } else if (animation === 'right') {
                if (good.current.includes(queueCards) || queueCards.progress) {
                    // graduatede
                    if (queueCards.progress) {
                        let a = queueCards;
                        a.progress.reviewTime = new Date();
                        graduated.current = [a, ...graduated.current];
                    } else {
                        graduated.current = [queueCards, ...graduated.current];
                    }
                } else {
                    good.current.push(queueCards);
                    const a = setTimeout(() => {
                        setDisplayCards((prev) => {
                            const newDCards = [...prev];
                            newDCards.splice(-2, 0, queueCards);
                            return newDCards;
                        });
                        setTimers((prev) => prev.filter((p) => p.timerId !== a));
                    }, 600000);
                    setTimers((prev) => [{ timerId: a, card: queueCards }, ...prev]);
                }
            }
        }
        change.current++;
    }, [queueCards]);

    //handle keyboard
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.keyCode === 37) {
                if (animation !== 'left') {
                    setAnimation('left');
                    setQueueCards(displayCards.at(-1));
                }
            } else if (e.keyCode === 39) {
                if (animation !== 'right') {
                    setAnimation('right');
                    setQueueCards(displayCards.at(-1));
                }
            } else if (e.keyCode === 90) {
                if (queueCards) {
                    setDisplayCards((prev) => {
                        return [...prev, queueCards];
                    });
                    if (good.current.at(-1)?.id === queueCards.id) {
                        good.current.pop();
                    }
                    if (graduated.current[0]?.id === queueCards.id) {
                        graduated.current.shift();
                    }
                    if (timers[0].card.id === queueCards.id) {
                        timers.shift();
                    }
                    setQueueCards(null);
                } else {
                    toast.error('Can not undo', {
                        style: {
                            minWidth: '250px',
                            minHeight: '60px',
                            fontSize: '20px',
                            backgroundColor: 'var(--primary-light   )',
                            color: 'red ',
                        },
                    });
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        // Don't forget to clean up
        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [animation, displayCards, queueCards, timers]);

    return (
        <div
            className={
                'flex-1 h-[calc(100vh-var(--defaultLayout-header-height))] flex justify-center items-center ' +
                (context.theme === 'dark')
            }
        >
            <Toaster position="bottom-right" />
            {showGuide && <Guide setShowGuide={setShowGuide} />}

            {displayCards.length > 0 ? (
                <div className="w-[70%] h-[70%] rounded-2xl flex relative">
                    <Tippy content="remember" placement="right" delay={1000} theme={context.theme} animation={'scale'}>
                        <button //right button
                            className={
                                cx('gradient-r') +
                                ' absolute top-0 bottom-0 w-32 right-0 z-10  rounded-2xl cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-500 '
                            }
                            onClick={() => {
                                if (animation !== 'right') {
                                    setAnimation('right');
                                    setQueueCards(displayCards.at(-1));
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faChevronRight} className="text-3xl" />
                        </button>
                    </Tippy>
                    <Tippy content="forgot" placement="left" delay={1000} theme={context.theme} animation={'scale'}>
                        <button //left button
                            className={
                                cx('gradient-l') +
                                ' absolute top-0 bottom-0 w-32 left-0 z-10  rounded-2xl cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-500 '
                            }
                            onClick={() => {
                                if (animation !== 'left') {
                                    setAnimation('left');
                                    setQueueCards(displayCards.at(-1));
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} className="text-3xl" />
                        </button>
                    </Tippy>
                        {displayCards.map((a, ind) => {
                            return (
                                <div
                                    onAnimationEnd={onAnimationEnd}
                                    key={ind}
                                    className={
                                        'absolute top-0 left-0 right-0 bottom-0 cursor-pointer ' +
                                        (displayCards.length - 1 !== ind ? ' hidden ' : '') +
                                        cx({
                                            dark: context.theme === 'dark',
                                            // show: twoCards.length - 1 === ind,
                                            left: animation === 'left' && displayCards.length - 1 === ind,
                                            right: animation === 'right' && displayCards.length - 1 === ind,
                                        })
                                    }
                                >
                                    <FlipCard
                                        id={a.front}
                                        first={displayCards.length - 1 === ind}
                                        backColor="bisque"
                                        frontColor="bisque"
                                    >
                                        <h1 className="text-5xl">{a.front}</h1>
                                        <h1 className="text-5xl">{a.back}</h1>
                                    </FlipCard>
                                </div>
                            );
                        })}
                
                </div>
            ) : (
                <h1 className="w-[70%] h-[70%] rounded-2xl flex  justify-center items-center relative text-[var(--text-color-dark)]">
                    You have finished today deadline
                </h1>
            )}
            <div className="w-fit bg-transparent self-start mt-[calc((100vh-var(--defaultLayout-header-height))*15/100)] ml-10 h-fit flex flex-col">
                <Tippy content="Save" placement="right" theme={context.theme} animation={'scale'}>
                    <button
                        onClick={() => {
                            toast.promise(
                                handleSaveProgress(),
                                {
                                    loading: 'Saving...',
                                    success: <b>Progress saved</b>,
                                    error: <b>Could not save</b>,
                                },
                                {
                                    style: {
                                        minWidth: '250px',
                                        minHeight: '60px',
                                        fontSize: '20px',
                                        backgroundColor: 'var(--primary)',
                                        color: 'var(--primary-light) ',
                                    },
                                    success: {
                                        duration: 3000,
                                        icon: '🔥',
                                    },
                                    error: {
                                        duration: 3000,
                                        icon: '❌',
                                        style: {
                                            minWidth: '250px',
                                            minHeight: '60px',
                                            fontSize: '20px',
                                            backgroundColor: 'var(--primary)',
                                            color: 'red',
                                        },
                                    },
                                },
                            );
                        }}
                        className="w-12 h-12 cursor-pointer bg-[var(--primary)] text-[var(--primary-light)] text-2xl flex justify-center items-center rounded-full mb-6"
                    >
                        <FontAwesomeIcon icon={faFloppyDisk} />
                    </button>
                </Tippy>
                <Tippy content="Undo" placement="right" theme={context.theme} animation={'scale'}>
                    <button
                        onClick={() => {
                            if (queueCards) {
                                setDisplayCards((prev) => {
                                    return [...prev, queueCards];
                                });
                                if (good.current.at(-1)?.id === queueCards.id) {
                                    good.current.pop();
                                }
                                if (graduated.current[0]?.id === queueCards.id) {
                                    graduated.current.shift();
                                }
                                if (timers[0].card.id === queueCards.id) {
                                    timers.shift();
                                }
                                setQueueCards(null);
                            } else {
                                toast.error('Can not undo', {
                                    style: {
                                        minWidth: '250px',
                                        minHeight: '60px',
                                        fontSize: '20px',
                                        backgroundColor: 'var(--primary-light   )',
                                        color: 'red ',
                                    },
                                });
                            }
                        }}
                        className="w-12 h-12     cursor-pointer bg-[var(--primary)] text-[var(--primary-light)] text-2xl  flex justify-center items-center rounded-full mb-6"
                    >
                        <FontAwesomeIcon icon={faArrowRotateLeft} />
                    </button>
                </Tippy>
                <Tippy content="How to use" placement="right" theme={context.theme} animation={'scale'}>
                    <button
                        onClick={() => {
                            setShowGuide(true);
                        }}
                        className="w-12 h-12 cursor-pointer bg-[var(--primary)] text-[var(--primary-light)] text-2xl flex justify-center items-center rounded-full mb-6"
                    >
                        <FontAwesomeIcon icon={faInfoCircle} />
                    </button>
                </Tippy>
            </div>
        </div>
    );
};

export default SpaceFlash;
