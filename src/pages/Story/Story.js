import classNames from 'classnames/bind';
import { StoryItem } from '~/component/StoryItem';
import styles from './Story.module.scss';
import Image from '~/component/Image';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '~/firebase';
import { doc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
const cx = classNames.bind(styles);

function Story() {
    return (
        <div className={cx('wrapper')}>
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
                
                <div className={cx('content')}>
                    <div className={cx('progress')}></div>
                    <div className={cx('info')}>
                        <Image
                            className={cx('avatar')}
                            alt="avatar"
                            src="https://scontent.fhan15-2.fna.fbcdn.net/v/t1.6435-1/100082274_760718324467252_1903151600004759552_n.jpg?stp=cp0_dst-jpg_p60x60&_nc_cat=104&ccb=1-7&_nc_sid=7206a8&_nc_ohc=59Q347h6MOsAX-yl32u&_nc_ht=scontent.fhan15-2.fna&oh=00_AfBNGCbKzZDiD2FWv7rG2ecEqmWuF75LnFy9s7JwN5kV_w&oe=644657CC"
                        />
                        <div className={cx('detail')}>
                            <h5 className={cx('username')}>Nguyễn Nhật Minh</h5>
                            <p className={cx('time')}>2 giờ</p>
                        </div>
                    </div>
                </div>

                <div className={cx('react')}>
                    <textarea className={cx('reply')} placeholder="Reply..."></textarea>
                    <div className={cx('icon')} style={{ backgroundColor: '#2f9df9' }}>
                        <i class="fa-regular fa-thumbs-up"></i>
                    </div>
                    <div className={cx('icon')} style={{ backgroundColor: '#ec2d49' }}>
                        <i class="fa-solid fa-circle-heart"></i>
                    </div>
                    <div className={cx('icon')} style={{ backgroundColor: '#fddc63' }}>
                        <i class="fa-sharp fa-regular fa-face-awesome" style={{ color: '#e45305' }}></i>
                    </div>
                    <div className={cx('icon')} style={{ backgroundColor: '#e45305' }}>
                        <i class="fa-regular fa-face-angry"></i>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Story;
