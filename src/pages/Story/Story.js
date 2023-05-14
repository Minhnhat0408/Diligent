import classNames from 'classnames/bind';
import { StoryItem } from '~/component/StoryComponents/StoryItem';
import styles from './Story.module.scss';
import React, { useCallback, useContext, useState } from 'react';
import Stories from '~/component/Stories/Stories';
import { ThemeContext } from '~/contexts/Context';
import { UserAuth } from '~/contexts/authContext';
import { collection, deleteDoc, doc, getDocs, query, serverTimestamp } from 'firebase/firestore';
import { db } from '~/firebase';
import { useEffect } from 'react';
import getTimeDiff from '~/utils/timeDiff';
import { useNavigate, useParams } from 'react-router-dom';
import routes from '~/config/routes';
const cx = classNames.bind(styles);

function Story() {
    const context = useContext(ThemeContext);
    const { user, stories } = UserAuth();
    const { id } = useParams();
    const [storiesData, setStoriesData] = useState([]);
    const [myStories, setMyStories] = useState(null);
    const [hasFetchedStories, setHasFetchedStories] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let story = [];
        if (stories[id]) {
            story = stories[id].map((str) => {
                return {
                    url: str.data.media[0],
                    username: str.data.user.name,
                    time: str.data.time,
                    avatar: str.data.user.avatar,
                    posX: str.data.content.posX,
                    posY: str.data.content.posY,
                    paragraph: str.data.content.text,
                    bgColor: str.data.content.bgColor,
                    textColor: str.data.content.textColor,
                    text: str.data.content.text,
                    scale: str.data.scale,
                    duration: str.data.type == 'video' ? 15000 : 3000,
                    userId: str.data.user.id,
                    storyId: str.id,
                    type: str.data.type,
                };
            });
        }

        setMyStories(story);
        autoDelete();
    }, [id, stories]);

    // Xóa story đã đăng quá 1 ngày
    async function autoDelete() {
        Object.keys(stories).map((key, i) => {
            stories[key].forEach(async (str) => {
                const time = getTimeDiff(Date.now(), str.data.time.seconds * 1000);
                if (time.includes('days')) {
                    await deleteDoc(doc(db, 'stories', str.id));
                }
            });
        });
    }
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
                    {Object.keys(stories).map((key, i) => {
                        return (
                            <div onClick={() => navigate(routes.story + key)} key={key}>
                                <StoryItem
                                    avatar={stories[key][0].data.user.avatar}
                                    title={stories[key][0].data.user.name}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            {/*  */}
            <div className={cx('display')}>
                {/* phần hiển thị story  */}
                {myStories != null && myStories[0] !== undefined ? (
                    <>
                        <Stories stories={myStories} key={JSON.stringify(myStories)} />
                    </>
                ) : (
                    <img src="/static/media/no_content.2175207d31c5a7c61d02.png" alt="nothing-here" />
                )}
            </div>
        </div>
    );
}

export default Story;
