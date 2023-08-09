import classNames from 'classnames/bind';
import styles from './FlipCard.module.scss';
import { useState } from 'react';

const cx = classNames.bind(styles);

function FlipCard({
    flip,
    backColor = 'transparent',
    frontColor = 'transparent',
    backImg = '',
    frontImg = '',
    children,   
    className = [],
    ...props
}) {
    const [fl, setFl] = useState(false);

    return (
        <div
            className={cx('container', ...className)}
            onClick={() => {
                setFl(!fl);
            
            }}
        >
            <div className={cx('card')}>
                <div
                    className={cx('card-tp', 'card-front', { cardfrontflip:flip !== undefined ? flip : fl })}
                    style={{
                        backgroundColor: frontColor,
                        backgroundImage: `url(${frontImg})`,
                    }}
                >
                    {children[0]}
                </div>
                <div
                    className={cx('card-tp', 'card-back', { cardbackflip: flip !== undefined ? !flip : !fl  })}
                    style={{
                        backgroundColor: backColor,
                        backgroundImage: `url(${backImg})`,
                    }}
                >
                    {children[1]}
                </div>
            </div>
        </div>
    );
}

export default FlipCard;
