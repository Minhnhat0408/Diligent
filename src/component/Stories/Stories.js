import classNames from 'classnames/bind';
import styles from './Stories.module.scss';
import Image from '../Image/Image';
import { useState, useEffect, useCallback } from 'react';
import Progressbar from '../Progressbar/Progressbar';
import getTimeDiff from '~/utils/timeDiff';
import { UserAuth } from '~/contexts/authContext';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '~/firebase';
const cx = classNames.bind(styles);

function Stories({ stories }) {
    const { user } = UserAuth();
    const [activeStoryIndex, setActiveStoryIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const activeStory = stories[activeStoryIndex];
        let timeout;
        let interval;

        if (!isPaused) {
            timeout = setTimeout(() => {
                if (activeStoryIndex < stories.length - 1) {
                    setActiveStoryIndex(activeStoryIndex + 1);
                    setCurrentTime(0);
                }
            }, activeStory.duration - currentTime);

            interval = setInterval(() => {
                setCurrentTime((prevTime) => {
                    if (prevTime + 100 > activeStory.duration) {
                        clearInterval(interval);
                        return activeStory.duration;
                    } else {
                        return prevTime + 100;
                    }
                });
            }, 100);
        }

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [activeStoryIndex, currentTime, isPaused]);

    const handlePauseClick = useCallback(() => {
        setIsPaused(!isPaused);
    }, [isPaused]);

    const handleBackClick = useCallback(() => {
        if (activeStoryIndex > 0) {
            setActiveStoryIndex(activeStoryIndex - 1);
            setCurrentTime(0);
        } else {
            setCurrentTime(0);
        }
    }, [activeStoryIndex, currentTime]);

    const handleNextClick = useCallback(() => {
        if (activeStoryIndex < stories.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1);
            setCurrentTime(0);
        } else {
            setCurrentTime(stories[activeStoryIndex].duration);
        }
    }, [activeStoryIndex]);

    async function deleteStory(id) {
        await deleteDoc(doc(db, 'stories', id));
    }

    const activeStory = stories[activeStoryIndex];
    const progressPercentage = (currentTime / activeStory.duration) * 100;
    console.log(stories);

    return (
        <div className={cx('wrapper')} style={{ background: `${stories[activeStoryIndex].bgColor}` }}>
            <div className={cx('progress-bar')}>
                {stories.map((story, index) => {
                    if (index === activeStoryIndex) {
                        return (
                            <Progressbar
                                key={index}
                                className={cx('spacer')}
                                style={{ width: `calc(100% / ${stories.length})` }}
                                bgColor={'blue'}
                                completed={progressPercentage}
                                duration={story.duration}
                            />
                        );
                    } else if (index <= activeStoryIndex) {
                        return (
                            <Progressbar
                                key={index}
                                className={cx('spacer')}
                                style={{ width: `calc(100% / ${stories.length})` }}
                                bgColor={'blue'}
                                completed={100}
                                duration={story.duration}
                            />
                        );
                    } else {
                        return (
                            <Progressbar
                                key={index}
                                className={cx('spacer')}
                                style={{ width: `calc(100% / ${stories.length})` }}
                                bgColor={'blue'}
                                completed={0}
                                duration={story.duration}
                            />
                        );
                    }
                })}
            </div>

            <div className={cx('header')}>
                <div style={{ display: 'flex' }}>
                    <Image className={cx('avatar')} src={stories[activeStoryIndex].avatar} />
                    <div className={cx('info')}>
                        <h5 className={cx('username')}>{stories[activeStoryIndex].username}</h5>
                        <p className={cx('time')}>
                            {getTimeDiff(Date.now(), stories[activeStoryIndex].time.seconds * 1000)} ago
                        </p>
                    </div>
                </div>
                {/* {stories[activeStoryIndex].userId === user.uid && (
                    <div className={cx('delete')} onClick={() => deleteStory(stories[activeStoryIndex].storyId)}>
                        <i class="fa-light fa-trash"></i>
                    </div>
                )} */}
            </div>

            <div className={cx('content')} onClick={() => handlePauseClick()}>
                {stories[activeStoryIndex].url !== '' && (
                    <Image
                        src={stories[activeStoryIndex].url}
                        alt="story-image"
                        className={cx('story-image')}
                        style={{ scale: `${stories[activeStoryIndex].scale}` }}
                    />
                )}
                <div
                    className={cx('message')}
                    style={{
                        transform: `translateX(${stories[activeStoryIndex].posX}px) translateY(${stories[activeStoryIndex].posY}px)`,
                        color: `${stories[activeStoryIndex].textColor}`,
                    }}
                >
                    {stories[activeStoryIndex].text}
                </div>
            </div>

            <div className={cx('back')} onClick={() => handleBackClick()}>
                <i class="fa-solid fa-left"></i>
            </div>

            <div className={cx('next')} onClick={() => handleNextClick()}>
                <i class="fa-solid fa-right"></i>
            </div>
        </div>
    );
}

export default Stories;
