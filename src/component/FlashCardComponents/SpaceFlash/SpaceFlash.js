import { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SpaceFlash.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faFloppyDisk, faGear, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Toaster } from 'react-hot-toast';
import { ThemeContext } from '~/contexts/Context';
import FlipCard from '~/component/FlipCard';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '~/firebase';
import { UserAuth } from '~/contexts/authContext';
import { toast } from 'react-hot-toast';
const cx = classNames.bind(styles);

const SpaceFlash = ({ cards }) => {
    const [displayCards, setDisplayCards] = useState(cards);
    const allCards = useRef(cards);
    const [queueCards, setQueueCards] = useState();
    const [animation, setAnimation] = useState('');
    const context = useContext(ThemeContext);
    const { user } = UserAuth();
    const [timers, setTimers] = useState([]);
    const notify = () => toast('Here is your toast.');
    const [showGuide, setShowGuide] = useState(false);
    const [showSetting, setShowSetting] = useState(false);

    const graduated = useRef([]);
    const good = useRef([]);

    useEffect(() => {
        setDisplayCards(cards);
        allCards.current = cards;
    }, [cards]);
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

    // const handleSaveProgress = async () => {

    //     graduated.current.forEach(async (card) => {
    //         allCards.current = allCards.current.filter((c) => c.id !== card.id);
    //         if (card.progress) {
    //             const interval = Math.round(card.progress.easeFactor * card.progress.interval);
    //             card.currentTime.setDate(card.currentTime.getDate() + interval)

    //             await updateDoc(doc(db, 'flashcards', card.id, 'progress', user.uid), {
    //                 easeFactor: card.progress.easeFactor,
    //                 interval: interval,
    //                 reviewTime: card.currentTime,

    //             });
    //             } else {
    //                 const current = new Date();
    //                 current.setDate(current.getDate() + 1)
    //                 await setDoc(doc(db, 'flashcards', card.id, 'progress', user.uid), {
    //                     easeFactor: 2.5,
    //                     interval: 1,
    //                 reviewTime:current,

    //             });
    //         }
    //     });
    //     allCards.current.forEach(async (card) => {
    //         if(card.reset) {
    //             card.currentTime.setDate(card.currentTime.getDate() + 1)
    //             await updateDoc(doc(db, 'flashcards', card.id, 'progress', user.uid), {
    //                 easeFactor: card.progress.easeFactor,
    //                 interval: 1,
    //                 reviewTime: card.currentTime,

    //             });
    //         }
    //     })

    // };
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
                        good.current = good.current.filter((q) => q !== queueCards);
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
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        // Don't forget to clean up
        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div
            className={
                'flex-1 h-[calc(100vh-var(--defaultLayout-header-height))] flex justify-center items-center ' +
                (context.theme === 'dark')
            }
        >
            <Toaster />
            {displayCards.length > 0 ? (
                <div className="w-[70%] h-[70%] rounded-2xl flex relative">
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
                                <FlipCard id={a.front} backColor="bisque" frontColor="bisque">
                                    <h1 className="text-5xl">{a.front}</h1>
                                    <h1 className="text-5xl">{a.back.content}</h1>
                                </FlipCard>
                            </div>
                        );
                    })}

                    <button //;eft button
                        className={
                            cx('gradient-l') +
                            ' absolute top-0 bottom-0 w-32  rounded-2xl cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-500 '
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
                    <button //right button
                        className={
                            cx('gradient-r') +
                            ' absolute top-0 bottom-0 w-32 right-0  rounded-2xl cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-500 '
                        }
                        onClick={() => {
                            console.log('to right');
                            if (animation !== 'right') {
                                setAnimation('right');
                                setQueueCards(displayCards.at(-1));
                            }
                        }}
                    >
                        <FontAwesomeIcon icon={faChevronRight} className="text-3xl" />
                    </button>
                </div>
            ) : (
                <h1 className="w-[70%] h-[70%] rounded-2xl flex  justify-center items-center relative text-[var(--text-color-dark)]">
                    You have finished today deadline
                </h1>
            )}
            <div className="w-fit bg-transparent self-start mt-[calc((100vh-var(--defaultLayout-header-height))*15/100)] ml-10 h-fit flex flex-col">
                <button
                    onClick={() => {
                        console.log('hello');

                        toast.promise(handleSaveProgress(), {
                            loading: 'Saving...',
                            success: <b>Progress saved!</b>,
                            error: <b>Could not save.</b>,
                        });
                    }}
                    className="w-10 h-10 cursor-pointer bg-[var(--primary)] text-[var(--primary-light)] text-2xl flex justify-center items-center rounded-full mb-6"
                >
                    <FontAwesomeIcon icon={faFloppyDisk} />
                </button>
                <button
                    onClick={() => {
                        setShowSetting(true);
                    }}
                    className="w-10 h-10 cursor-pointer bg-[var(--primary)] text-[var(--primary-light)] text-2xl  flex justify-center items-center rounded-full mb-6"
                >
                    <FontAwesomeIcon icon={faGear} />
                </button>
                <button
                    onClick={notify}
                    className="w-10 h-10 cursor-pointer bg-[var(--primary)] text-[var(--primary-light)] text-2xl flex justify-center items-center rounded-full mb-6"
                >
                    <FontAwesomeIcon icon={faInfoCircle} />
                </button>
                <p className="text-lime-500 text-center">{good.current.length}</p>
                <p className="text-blue-500 text-center">{1}</p>
                <p className="text-red-500 text-center">{timers.length}</p>
            </div>
            {/* options
            {def.length > 0 && <div className={cx('options')}>
                <button className={cx('finish')} onClick={() => handleRemember(1)}>
                    <FontAwesomeIcon icon={faCheck} />
                </button>
                <button className={cx('skip')} onClick={() => handleRemember(2)}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                <button className={cx('back')} onClick={() => getBack()}>
                    <FontAwesomeIcon icon={faArrowRotateLeft} />
                </button>
            </div>}

            <div className={cx('flash')}>
                {fp0.map((item, index) => {
                    return (
                        <>
                            <CardFlip key={item.id} card={item} getOldPos0={getOldPos0} />
                        </>
                    );
                })}
                {fp1.map((item, index) => {
                    return (
                        <>
                            <CardFlip key={item.id} card={item} getOldPos0={getOldPos0} />
                        </>
                    );
                })}
                {fp2.map((item, index) => {
                    return (
                        <>
                            <CardFlip key={item.id} card={item} getOldPos0={getOldPos0} />
                        </>
                    );
                })}

                {showProgress && (
                    <div
                        className={cx('boxshowper', { show: animation, hide: !animation })}
                        onAnimationEnd={onAnimationEnd}
                    >
                        {!showPer ? (
                            <div className={cx('showper')} onClick={() => handlePull()}>
                                Congrats you have finished all your cards!!!
                            </div>
                        ) : (
                            <div className={cx('progresscontain')}>
                                <div className={cx('progressbox')}>
                                    <CricleProgress percentage={(fp1.length / (fp1.length + fp2.length)) * 100} />
                                </div>
                                <div className={cx('emotion')}>
                                    {(fp1.length / (fp1.length + fp2.length)) * 100 > 50 ? (
                                        <FontAwesomeIcon
                                            icon={faFaceSmile}
                                            style={{ color: '#d4d049', height: '80px', width: '80px' }}
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            icon={faFaceSadTear}
                                            style={{ color: '#d4d049', height: '80px', width: '80px' }}
                                        />
                                    )}
                                </div>
                                <Link className={cx('buttonhoc')} to={routes.flashcard}>
                                    Continue
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div> */}

            {/* rightside */}
            {/* <div className={cx('rightside')}>
                <div className={cx('finishbox')}>
                    <div className={cx('text')}>REMEMBER</div>
                    <div className={cx('shadowbox')}></div>
                    <button className={cx('number')}>{virPos === 1 ? fp1.length - 1 : fp1.length}</button>
                </div>
                <div className={cx('skipbox')}>
                    <div className={cx('text')}>FORGET</div>
                    <div className={cx('shadowbox')}></div>
                    <button className={cx('number')}>{virPos === 2 ? fp2.length - 1 : fp2.length}</button>
                </div>
            </div> */}
        </div>
    );
};

export default SpaceFlash;
