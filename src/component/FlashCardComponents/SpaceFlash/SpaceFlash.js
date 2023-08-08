import { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SpaceFlash.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRotateBack,
    faArrowRotateLeft,
    faCheck,
    faCheckCircle,
    faChevronLeft,
    faChevronRight,
    faFaceSadTear,
    faFaceSmile,
    faFaceSmileBeam,
    faFloppyDisk,
    faGear,
    faInfoCircle,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';

import { ThemeContext } from '~/contexts/Context';
import FlipCard from '~/component/FlipCard';
const cx = classNames.bind(styles);

const SpaceFlash = ({ cards }) => {
    const [flip, setFlip] = useState(false);
    const [twoCards, setTwoCards] = useState(() => {
        if (cards.length > 2) {
            return [cards.at(-2), cards.at(-1)];
        } else {
            return cards;
        }
    });
    const [currentInd, setCurrentInd] = useState(cards.length - 1);
    const [queueCards, setQueueCards] = useState();
    const [animation, setAnimation] = useState('');
    const context = useContext(ThemeContext);
    const [timers, setTimers] = useState([]);
    const good = useRef([]);

    //handle add or remove card when animation end
    const onAnimationEnd = () => {
        if (twoCards.length <= 2) {
            if (currentInd > 1) {
                console.log('hello');
                setCurrentInd(currentInd - 1);
                const a = twoCards.slice(0, -1);
                setTwoCards([cards[currentInd - 2], ...a]);
            } else {
                if (queueCards) {
                    console.log('scenario');
                    let a = [];
                    const b = twoCards.slice(0, -1);
                    timers.forEach((t) => {
                        clearTimeout(t.timerId);
                        a.push(t.card);
                    });
                    setTwoCards([...a, ...b]);
                    setTimers([]);
                    setQueueCards(null);
                } else {
                    const a = twoCards.slice(0, -1);
                    setTwoCards(a);
                }
            }
        } else {
            const a = twoCards.slice(0, -1);
            setTwoCards(a);
        }
        setAnimation('');
    };

    //set the time for the cảrd to be back to learn
    useEffect(() => {
        if (queueCards) {
            if (animation === 'left') {
                if (good.current.includes(queueCards)) {
                    good.current = good.current.filter((q) => q !== queueCards);
                }
                const a = setTimeout(() => {
                    console.log(queueCards, 'queue');
                    setTwoCards((prev) => [queueCards, ...prev]);
                    setTimers((prev) => prev.filter((p) => p.timerId !== a));
                }, 60000);
                setTimers((prev) => [{ timerId: a, card: queueCards }, ...prev]);
            } else if (animation === 'right') {
                if (good.current.includes(queueCards)) {
                    //graduatede
                } else {
                    good.current.push(queueCards);
                    const a = setTimeout(() => {
                        console.log(queueCards, 'queue');
                        setTwoCards((prev) => [queueCards, ...prev]);
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
                    setQueueCards(twoCards.at(-1));
                }
            } else if (e.keyCode === 39) {
                if (animation !== 'right') {
                    setAnimation('right');
                    setQueueCards(twoCards.at(-1));
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        // Don't forget to clean up
        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    console.log(twoCards, queueCards, animation);
    return (
        <div
            className={
                'flex-1 h-[calc(100vh-var(--defaultLayout-header-height))] flex justify-center items-center ' +
                (context.theme === 'dark')
            }
        >
            {twoCards.length > 0 ? (
                <div className="w-[70%] h-[70%] rounded-2xl flex relative">
                    {twoCards.map((a, ind) => {
                        return (
                            <div
                                onAnimationEnd={onAnimationEnd}
                                key={ind}
                                className={
                                    'absolute top-0 left-0 right-0 bottom-0 cursor-pointer ' +
                                    cx({
                                        dark: context.theme === 'dark',
                                        left: animation === 'left' && twoCards.length - 1 === ind,
                                        right: animation === 'right' && twoCards.length - 1 === ind,
                                    })
                                }
                            >
                                <FlipCard
                                    flip={flip}
                                    onClick={() => {
                                        setFlip(!flip);
                                    }}
                                    backColor="bisque"
                                    frontColor="bisque"
                                >
                                    <h1 className="text-5xl">{a.front}</h1>
                                    <h1 className="text-5xl">{a.back.content}</h1>
                                </FlipCard>
                            </div>
                        );
                    })}

                    <button
                        className={
                            cx('gradient-l') +
                            ' absolute top-0 bottom-0 w-32  rounded-2xl cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-500 '
                        }
                        onClick={() => {
                            if (animation !== 'left') {
                                setAnimation('left');
                                setQueueCards(twoCards.at(-1));
                            }
                        }}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} className="text-3xl" />
                    </button>
                    <button
                        className={
                            cx('gradient-r') +
                            ' absolute top-0 bottom-0 w-32 right-0  rounded-2xl cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-500 '
                        }
                        onClick={() => {
                            if (animation !== 'right') {
                                setAnimation('right');
                                setQueueCards(twoCards.at(-1));
                            }
                        }}
                    >
                        <FontAwesomeIcon icon={faChevronRight} className="text-3xl" />
                    </button>
                </div>
            ) : (
                <h1 className="w-[70%] h-[70%] rounded-2xl flex  justify-center items-center relative text-[var(--text-color])">You have finished today deadline</h1>
            )}
            <div className="w-fit bg-transparent self-start mt-[calc((100vh-var(--defaultLayout-header-height))*15/100)] ml-10 h-fit flex flex-col">
                <button className="w-10 h-10 cursor-pointer bg-[var(--primary)] text-[var(--primary-light)] text-2xl flex justify-center items-center rounded-full mb-6">
                    <FontAwesomeIcon icon={faFloppyDisk} />
                </button>
                <button className="w-10 h-10 cursor-pointer bg-[var(--primary)] text-[var(--primary-light)] text-2xl  flex justify-center items-center rounded-full mb-6">
                    <FontAwesomeIcon icon={faGear} />
                </button>
                <button className="w-10 h-10 cursor-pointer bg-[var(--primary)] text-[var(--primary-light)] text-2xl flex justify-center items-center rounded-full mb-6">
                    <FontAwesomeIcon icon={faInfoCircle} />
                </button>
                <p className="text-lime-500 text-center">{good.current.length}</p>
                <p className="text-blue-500 text-center">{currentInd + 1}</p>
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
