import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Stories from '~/layouts/components/Stories';

const cx = classNames.bind(styles);

function Home() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('newsfeed')}>
                <Stories />

                <div className={cx('create-post')}>
                    <div>
                        <img
                            src="https://scontent.fhan5-2.fna.fbcdn.net/v/t1.6435-1/51132488_1049848925197144_4209746563502702592_n.jpg?stp=cp0_dst-jpg_p60x60&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_ohc=YqssQlfWBRMAX9aqJII&_nc_ht=scontent.fhan5-2.fna&oh=00_AfA-SLB3ehGS7-RZtGcl7UiYur-t62x70NDU0DaAvq4vVA&oe=6433C23E"
                            className={cx('avatar')}
                        />
                        <div className={cx('input')}>
                            <span>What's on your mind?</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('card-info')}></div>
        </div>
    );
}

export default Home;
