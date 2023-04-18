import classNames from 'classnames/bind';
import { StoryItem } from '~/component/StoryComponents/StoryItem';
import styles from './Story.module.scss';
import Image from '~/component/Image';
import React, { useContext } from 'react';
import Stories from 'react-insta-stories';
import { ThemeContext } from '~/contexts/Context';
const cx = classNames.bind(styles);

const stories = [
    {
        url: 'https://firebasestorage.googleapis.com/v0/b/diligent-69ff7.appspot.com/o/images%2FScreenshot%202023-03-27%20211538.png?alt=media&token=7d94d948-6db7-4b87-b624-c51553929415',
        header: {
            heading: 'Minh Nhat',
            subheading: '30m ago',
            profileImage:
                'https://scontent.fhan3-5.fna.fbcdn.net/v/t39.30808-1/277751572_1315302068964376_895612620486881878_n.jpg?stp=dst-jpg_p100x100&_nc_cat=109&ccb=1-7&_nc_sid=7206a8&_nc_ohc=i9xUP-lu3fQAX9t9ZAi&_nc_oc=AQkDh0txZldmxh4b32rTYj8LOe9ClH6tGq-_Wr1TieJ8QhFTJLqi3vXePK6_UBIk5uIg4u8jqNFcqU9iLudg85sA&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.fhan3-5.fna&oh=00_AfCQurnzumG-_DgI-BujlIkItfRFJMHY92alHVPn2CTo7w&oe=64409940',
        },
    },
    {
        url: 'https://scontent.fhan4-3.fna.fbcdn.net/v/t1.6435-9/66179411_1146487765533259_122620302688518144_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=buXzQB9ZHcAAX-kpv8g&_nc_ht=scontent.fhan4-3.fna&oh=00_AfA0mEOTIM-vcPk1i9FsS2iR5zRF6AFKR6nBbFBzaMOi1A&oe=6463222C',
        header: {
            heading: 'Minh Nhat',
            subheading: '30m ago',
            profileImage:
                'https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-1/333434336_1380339449173709_4761429895030803928_n.jpg?stp=dst-jpg_p320x320&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=rHlEQ1lDYQ8AX85SZr1&_nc_ht=scontent.fhan4-1.fna&oh=00_AfAnSH4n3tT1WWAKm1ne_OFAauWV-2iEJj_eivQnf__8uQ&oe=64404314',
        },
        styles: {
            backgroundColor: 'blue',
        },
    },
    {
        url: 'https://static.independent.co.uk/2022/05/09/11/SEI102882096.jpg',
        header: {
            heading: 'Minh Nhat',
            subheading: '30m ago',
            paragraph: 'alo alo',
            profileImage:
                'https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-1/333434336_1380339449173709_4761429895030803928_n.jpg?stp=dst-jpg_p320x320&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=rHlEQ1lDYQ8AX85SZr1&_nc_ht=scontent.fhan4-1.fna&oh=00_AfAnSH4n3tT1WWAKm1ne_OFAauWV-2iEJj_eivQnf__8uQ&oe=64404314',
        },
    },
];

function Story({ scale = 1, backgroundColor = '#000', posX = 150, posY = 150 }) {
    const context = useContext(ThemeContext);
    const MyCustomHeader = React.useMemo(
        () =>
            ({ heading, subheading, profileImage, paragraph }) => {
                return (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Image src={profileImage} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    marginLeft: '8px',
                                    color: '#fff',
                                }}
                            >
                                <h1 style={{ fontSize: '1.4rem' }}>{heading}</h1>
                                <h2 style={{ fontSize: '1.2rem' }}>{subheading}</h2>
                            </div>
                        </div>
                        {paragraph && (
                            <p
                                style={{
                                    color: '#fff',
                                    fontSize: '2rem',
                                    textAlign: 'center',
                                    wordWrap: 'break-word',
                                    transform: `translate(${posX}px, ${posY}px)`,
                                }}
                            >
                                {paragraph}
                            </p>
                        )}
                    </div>
                );
            },
        [posX, posY],
    );

    return (
        <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
            <div className={cx('sidebar')}>
                <h1 className={cx('header')}>Story</h1>
                <div className={cx('my-story')} to="/createstory">
                    <h3 className={cx('title')}>Your Story</h3>
                    <StoryItem
                        title="Create story"
                        detail="You can share a photo or write something"
                        to="/createstory"
                    />
                </div>
                <div className={cx('all-story')}>
                    <h3 className={cx('title')}>All Story</h3>
                    <StoryItem
                        avatar="https://scontent.fhan5-9.fna.fbcdn.net/v/t39.30808-1/290563298_2204820046351865_1105514345478100666_n.jpg?stp=cp0_dst-jpg_p60x60&_nc_cat=109&ccb=1-7&_nc_sid=7206a8&_nc_ohc=G_s0c8f9rsEAX8441cx&_nc_ht=scontent.fhan5-9.fna&oh=00_AfD8YMmt1ugGVeKV21P_d9PJE77H6pc3QLJJwcdJKPTmlw&oe=6424A0BD"
                        title="Minh Nhat"
                        detail="21 giờ"
                    />

                    <StoryItem
                        avatar="https://scontent.fhan5-9.fna.fbcdn.net/v/t39.30808-1/290563298_2204820046351865_1105514345478100666_n.jpg?stp=cp0_dst-jpg_p60x60&_nc_cat=109&ccb=1-7&_nc_sid=7206a8&_nc_ohc=G_s0c8f9rsEAX8441cx&_nc_ht=scontent.fhan5-9.fna&oh=00_AfD8YMmt1ugGVeKV21P_d9PJE77H6pc3QLJJwcdJKPTmlw&oe=6424A0BD"
                        title="Minh Nhat"
                        detail="21 giờ"
                    />

                    <StoryItem
                        avatar="https://scontent.fhan5-9.fna.fbcdn.net/v/t39.30808-1/290563298_2204820046351865_1105514345478100666_n.jpg?stp=cp0_dst-jpg_p60x60&_nc_cat=109&ccb=1-7&_nc_sid=7206a8&_nc_ohc=G_s0c8f9rsEAX8441cx&_nc_ht=scontent.fhan5-9.fna&oh=00_AfD8YMmt1ugGVeKV21P_d9PJE77H6pc3QLJJwcdJKPTmlw&oe=6424A0BD"
                        title="Minh Nhat"
                        detail="21 giờ"
                    />
                </div>
            </div>

            <div className={cx('display')}>
                {/* phần hiển thị story  */}
                <Stories
                    stories={stories}
                    width={'30vw'}
                    height={'80vh'}
                    defaultInterval={1500}
                    storyStyles={{ scale: scale, padding: 0 }}
                    storyContainerStyles={{ backgroundColor: backgroundColor, borderRadius: '10px' }}
                    header={MyCustomHeader}
                />

                <div className={cx('react')}>
                    <textarea className={cx('reply')} placeholder="Reply..."></textarea>
                    <div className={cx('action')}>
                        <div className={cx('icon')} style={{ backgroundColor: '#2f9df9' }}>
                            <i class="fa-regular fa-thumbs-up"></i>
                        </div>
                        <div className={cx('icon')} style={{ backgroundColor: '#2f9df9' }}>
                            <i class="fa-solid fa-thumbs-down"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Story;
