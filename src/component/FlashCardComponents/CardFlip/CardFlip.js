import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './CardFlip.module.scss';
const cx = classNames.bind(styles);

const   CardFlip = ({ card, getOldPos0 }) => {
    const [flip, setFlip] = useState(true);
    const [pos0, setPos0] = useState(true);
    const [pos1, setPos1] = useState(false);
    const [pos2, setPos2] = useState(false);

    const handFlip = () => {
        setFlip(!flip);
    };

    const handleClick = () => {
        if (!pos1 && !pos2) {
            handFlip();
        }
    };

    useEffect(() => {
        setPos0(card.pos === 0);
        setPos1(card.pos === 1);
        setPos2(card.pos === 2);
        setFlip(true);
    }, [card.pos]);

    return (
        <div className={cx('contain', 'card0', { cardmoveon: pos1 }, { cardmoveunder: pos2 })}>
            <div className={cx('card', { cardflip: !flip })} onClick={() => handleClick()}>
                <div className={cx('front')}>
                    <div className={cx('content')}>{card.front}</div>
                </div>
                <div className={cx('back')}>
                    <div className={cx('content')}>
                        <span className={cx('text')}>{card.back.content}</span>
                        <div className={cx('example')}>{card.back.example}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardFlip;
