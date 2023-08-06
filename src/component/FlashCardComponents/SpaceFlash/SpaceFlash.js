import { useContext, useEffect, useState } from 'react';
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
    const [c, setCards] = useState(cards);
    // const [def, setDef] = useState(cards);
    // const [fp0, setFp0] = useState([]);
    // const [fp1, setFp1] = useState([]);
    // const [fp2, setFp2] = useState([]);
    // var [virPos, setVirPos] = useState(3);
    // const [showProgress, setShowProgress] = useState(false);
    // const [animation, setAnimation] = useState(false);
    const context = useContext(ThemeContext);
    // const onAnimationEnd = () => {
    //     if (!animation) setShowProgress(false);
    // };

    // useEffect(() => {
    //     if (animation) setShowProgress(true);
    // }, [animation]);
    // const handleRemember = (a) => {
    //     if (fp0.length === 1 && virPos === 0) {
    //         return;
    //     }

    //     if (fp0.length <= 2) {
    //         console.log(fp0);
    //         setAnimation(true);
    //     }
    //     getSetEffect();

    //     fp0[fp0.length - 1].pos = a;
    //     setFp0([...fp0]);
    //     var current = fp0.pop();
    //     virPos = 0;
    //     if (a === 1) {
    //         fp1.push(current);
    //         setFp1([...fp1]);
    //     } else {
    //         fp2.push(current);
    //         setFp2([...fp2]);
    //     }
    //     setVirPos(virPos);
    // };

    // const getOldPos0 = (title) => {
    //     console.log(title);
    //     getSetEffect();
    //     getTurnBack(title);
    // };

    // const getTurnBack = (titile) => {
    //     if (titile === fp1[fp1.length - 1] || titile === fp0[fp0.length - 1]) {
    //         fp1[fp1.length - 1].pos = 0;
    //         setFp1([...fp1]);
    //         virPos = 1;
    //         setVirPos(virPos);
    //     } else {
    //         fp2[fp2.length - 1].pos = 0;
    //         setFp2([...fp2]);
    //         virPos = 2;
    //         setVirPos(virPos);
    //     }
    //     setAnimation(false);
    //     setShowPer(false);
    // };

    // const getBack = () => {
    //     if (fp2.length + fp1.length === 1) {
    //         if (virPos !== 0) {
    //             return;
    //         }
    //     }
    //     getSetEffect();
    //     if (fp2.length === 0) {
    //         getTurnBack(fp1[fp1.length - 1]);
    //     } else if (fp1.length === 0) {
    //         getTurnBack(fp2[fp2.length - 1]);
    //     } else {
    //         if (fp1[fp1.length - 1].order < fp2[fp2.length - 1].order) {
    //             getTurnBack(fp1[fp1.length - 1]);
    //         } else {
    //             getTurnBack(fp2[fp2.length - 1]);
    //         }
    //     }
    // };

    // const getSetEffect = () => {
    //     if (virPos === 0) {
    //         fp0.pop();
    //     } else if (virPos === 1) {
    //         var current = fp1.pop();
    //         fp0.push(current);
    //         setFp0([...fp0]);
    //     } else if (virPos == 2) {
    //         var current = fp2.pop();
    //         fp0.push(current);
    //         setFp0([...fp0]);
    //     } else {
    //         console.log('roong');
    //     }
    // };
    // useEffect(() => {
    //     setFp0(cards);
    // }, [cards]);
    // useEffect(() => {
    //     setFp1([]);
    //     setFp2([]);
    //     setShowPer(false);
    // }, []);
    // const [showPer, setShowPer] = useState(false);
    // const handlePull = () => {
    //     setShowPer(!showPer);
    // };

    return (
        <div
            className={
                'flex-1 h-[calc(100vh-var(--defaultLayout-header-height))] flex justify-center items-center ' +
                (context.theme === 'dark')
            }
        >
            <div className="w-[70%] h-[70%] rounded-2xl flex relative">
                {}

                <FlipCard
                    flip={flip}
                    onClick={() => {
                        setFlip(!flip);
                    }}
                    backColor="bisque"
                    frontColor="bisque"
                >
                    <h1 className="text-5xl">{c.at(-1).front}</h1>
                    <h1 className="text-5xl">{c.at(-1).back.content}</h1>
                </FlipCard>
                <button
                    className={
                        cx('gradient-l') +
                        ' absolute top-0 bottom-0 w-32  rounded-2xl  opacity-0 hover:opacity-100 transition-opacity duration-500 '
                    }
                    onClick={() => {
                        const newArray = [...c];
                        newArray.pop();
                        setCards(newArray);
                    }}
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="text-3xl" />
                </button>
                <button
                    className={
                        cx('gradient-r') +
                        ' absolute top-0 bottom-0 w-32 right-0  rounded-2xl  opacity-0 hover:opacity-100 transition-opacity duration-500 '
                    }
                >
                    <FontAwesomeIcon icon={faChevronRight} className="text-3xl" />
                </button>
            </div>
            <div className="w-fit bg-transparent self-start mt-[calc((100vh-var(--defaultLayout-header-height))*15/100)] ml-10 h-fit flex flex-col">
                <button className="w-10 h-10 bg-[var(--primary)] text-[var(--primary-light)] text-2xl flex justify-center items-center rounded-full mb-6">
                    <FontAwesomeIcon icon={faFloppyDisk} />
                </button>
                <button className="w-10 h-10 bg-[var(--primary)] text-[var(--primary-light)] text-2xl  flex justify-center items-center rounded-full mb-6">
                    <FontAwesomeIcon icon={faGear} />
                </button>
                <button className="w-10 h-10 bg-[var(--primary)] text-[var(--primary-light)] text-2xl flex justify-center items-center rounded-full mb-6">
                    <FontAwesomeIcon icon={faInfoCircle} />
                </button>
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
