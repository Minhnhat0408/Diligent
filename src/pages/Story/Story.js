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
const cx = classNames.bind(styles);

function Story() {
    const context = useContext(ThemeContext);
    const { user } = UserAuth();

    const [storiesData, setStoriesData] = useState([]);
    const [myStories, setMyStories] = useState(null);
    const [hasFetchedStories, setHasFetchedStories] = useState(false);

    async function fetchStories() {
        const q = query(collection(db, 'stories'));
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setStoriesData(docs);
        const story = docs
            .filter((story) => story.user.id === user.uid)
            .map((story) => ({
                url: story.media[0],
                username: story.user.name,
                time: story.time,
                avatar: story.user.avatar,
                posX: story.content.posX,
                posY: story.content.posY,
                paragraph: story.content.text,
                bgColor: story.content.bgColor,
                textColor: story.content.textColor,
                text: story.content.text,
                scale: story.scale,
                duration: story.type == 'video' ? 15000 : 3000,
                userId: story.user.id,
                storyId: story.id,
                type: story.type,
            }));

        const sortedStory = story.sort((a, b) => a.time.seconds - b.time.seconds);

        setMyStories(sortedStory);
        setHasFetchedStories(true);
    }

    useEffect(() => {
        fetchStories();
        autoDelete();
    }, [hasFetchedStories]);

    const storyByUserId = Object.values(
        storiesData.reduce((acc, story) => {
            const val = {
                userId: story.user.id,
                username: story.user.name,
                avatar: story.user.avatar,
            };
            if (!acc[val.userId]) {
                acc[val.userId] = val;
            }

            return acc;
        }, {}),
    );

    async function selectStory(id) {
        const selectedStories = storiesData.filter((story) => story.user.id === id);
        const sortedStory = selectedStories.sort((a, b) => a.time.seconds - b.time.seconds);

        const formattedStories = sortedStory.map((story) => ({
            url: story.media[0],
            username: story.user.name,
            time: story.time,
            avatar: story.user.avatar,
            posX: story.content.posX,
            posY: story.content.posY,
            paragraph: story.content.text,
            bgColor: story.content.bgColor,
            textColor: story.content.textColor,
            text: story.content.text,
            scale: story.scale,
            duration: story.type == 'video' ? 15000 : 3000,
            userId: story.user.id,
            storyId: story.id,
            type: story.type,
        }));

        setMyStories(formattedStories);
    }

    // Xóa story đã đăng quá 1 ngày
    async function autoDelete() {
        storiesData.map((story) => {
            const time = getTimeDiff(Date.now(), story.time.seconds * 1000);
            if (time.includes('days')) {
                deleteDoc(doc(db, 'stories', story.id));
            }
        });
    }

    const handleDeleteStory = useCallback(() => {
        fetchStories();
    }, []);

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
                    {storyByUserId.map((data) => (
                        <div onClick={() => selectStory(data.userId)} key={data.userId}>
                            <StoryItem avatar={data.avatar} title={data.username} />
                        </div>
                    ))}
                </div>
            </div>

            <div className={cx('display')}>
                {/* phần hiển thị story  */}
                {myStories != null && myStories[0] != undefined ? (
                    <>
                        <Stories
                            stories={myStories}
                            key={JSON.stringify(myStories)}
                            onDeleteStory={handleDeleteStory}
                        />
                    </>
                ) : (
                    <img src="/static/media/no_content.2175207d31c5a7c61d02.png" alt="nothing-here" />
                )}
            </div>
        </div>
    );
}

export default Story;
