import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import CardFlip from '../CardFlip/';
import CricleProgress from '../CircleProgress/CircleProgress';
import styles from './SpaceFlash.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRotateBack,
    faArrowRotateLeft,
    faCheck,
    faFaceSadTear,
    faFaceSmile,
    faFaceSmileBeam,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useSpring, useSpringRef, useTransition, animated } from '@react-spring/web';
const cx = classNames.bind(styles);

const SpaceFlash = ({ cards }) => {
    const [fp0, setFp0] = useState([]);
    const [fp1, setFp1] = useState([]);
    const [fp2, setFp2] = useState([]);
    var [virPos, setVirPos] = useState(3);

    const handleRemember = (a) => {
        if (fp0.length === 1 && virPos === 0) {
            return;
        }
        getSetEffect();

        fp0[fp0.length - 1].pos = a;
        setFp0([...fp0]);
        var current = fp0.pop();
        virPos = 0;
        if (a === 1) {
            fp1.push(current);
            setFp1([...fp1]);
        } else {
            fp2.push(current);
            setFp2([...fp2]);
        }
        setVirPos(virPos);
    };

    const getOldPos0 = (title) => {
        getSetEffect();
        getTurnBack(title);
    };

    const getTurnBack = (titile) => {
        if (titile === fp1[fp1.length - 1] || titile === fp0[fp0.length - 1]) {
            fp1[fp1.length - 1].pos = 0;
            setFp1([...fp1]);
            virPos = 1;
            setVirPos(virPos);
        } else {
            fp2[fp2.length - 1].pos = 0;
            setFp2([...fp2]);
            virPos = 2;
            setVirPos(virPos);
        }
    };

    const getBack = () => {
        if (fp2.length + fp1.length === 1) {
            if(virPos!==0) {
                return;
            }
        }
        getSetEffect();
        if (fp2.length === 0) {
            getTurnBack(fp1[fp1.length - 1]);
        } else if (fp1.length === 0) {
            getTurnBack(fp2[fp2.length - 1]);
        }

        if (fp1[fp1.length - 1].orders < fp2[fp2.length - 1].orders) {
            getTurnBack(fp1[fp1.length - 1]);
        } else {
            getTurnBack(fp2[fp2.length - 1]);
        }
        
    };

    const getSetEffect = () => {
        if (virPos === 0) {
            fp0.pop();
        } else if (virPos === 1) {
            var current = fp1.pop();
            fp0.push(current);
            setFp0([...fp0]);
        } else if (virPos == 2) {
            var current = fp2.pop();
            fp0.push(current);
            setFp0([...fp0]);
        } else {
            console.log('roong');
        }
    };


    useEffect(() => {
        setFp1([]);
        setFp2([]);
        setFp0(cards);
        setShowPer(false);

    }, [])

    const [showPer, setShowPer] = useState(false);
    const handlePull = () => {
        setShowPer(!showPer);
    };

    return (
        <div className={cx('container')}>
            {/* options */}
            <div className={cx('options')}>
                <button className={cx('finish')} onClick={() => handleRemember(1)}>
                    <FontAwesomeIcon icon={faCheck} />
                </button>
                <button className={cx('skip')} onClick={() => handleRemember(2)}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                <button className={cx('back')} onClick={() => getBack()}>
                    <FontAwesomeIcon icon={faArrowRotateLeft} />
                </button>
            </div>

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

                <div className={cx('boxshowper')}>
                    {!showPer ? (
                        <div className={cx('showper')} onClick={() => handlePull()}>
                            hoan thanh
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
                            <div className={cx('buttonhoc')}>hoc tiep</div>
                        </div>
                    )}
                </div>
            </div>

            {/* rightside */}
            <div className={cx('rightside')}>
                <div className={cx('finishbox')}>
                    <div className={cx('text')}>ĐÃ THUỘC</div>
                    <div className={cx('shadowbox')}></div>
                    <button className={cx('number')}>{virPos === 1 ? fp1.length - 1 : fp1.length}</button>
                </div>
                <div className={cx('skipbox')}>
                    <div className={cx('text')}>QUÊN</div>
                    <div className={cx('shadowbox')}></div>
                    <button className={cx('number')}>{virPos === 2 ? fp2.length - 1 : fp2.length}</button>
                </div>
            </div>
        </div>
    );
};

export default SpaceFlash;
