import classNames from 'classnames/bind';
import styles from './FlipCard.module.scss';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function FlipCard({
    flip,
    backColor = 'transparent',
    frontColor = 'transparent',
    backImg = '',
    frontImg = '',
    first = false,
    children,
    pop = false,
    flashcard = false,
    className = [],
    ...props
}) {
    const [fl, setFl] = useState(false);
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.keyCode === 32) {
                setFl(!fl);
            }
        }
        if (first && !pop) {
            document.addEventListener('keydown', handleKeyDown);
            return function cleanup() {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }

        // Don't forget to clean up
    }, [first, fl,pop]);

    return (
        <div
            className={cx('container', ...className)}
            onClick={() => {
                setFl(!fl);
            }}
        >
            <div className={cx('card')}>
                <div
                    className={cx('card-tp', 'card-front', { cardfrontflip: flip !== undefined ? flip : fl })}
                    style={{
                        backgroundColor: frontColor,
                        backgroundImage: `url(${frontImg})`,
                    }}
                >
                    {children[0]}
                </div>
                <div
                    className={cx('card-tp', 'card-back', { cardbackflip: flip !== undefined ? !flip : !fl })}
                    style={{
                        backgroundColor: backColor,
                        backgroundImage: `url(${backImg})`,
                    }}
                >
                    {flashcard ? (
                        <div className='flex flex-col items-center justify-center'>
                            <h1 className="text-4xl mx-10">{children[1].props.children.content}</h1>
                            {children[1].props.children.example && (
                                <p className="text-2xl mt-10 mx-10">{children[1].props.children.example}</p>
                            )}
                        </div>
                    ) : (
                        children[1]
                    )}
                </div>
            </div>
        </div>
    );
}

export default FlipCard;
