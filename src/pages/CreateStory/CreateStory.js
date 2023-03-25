import classNames from 'classnames/bind';
import Image from '~/component/Image';
import styles from './CreateStory.module.scss';

const cx = classNames.bind(styles);

function CreateStory() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('sidebar')}>
                <h1 className={cx('header')}>Your Story</h1>
                <div className={cx('info')}>
                    <Image
                        src="https://scontent.fhan5-1.fna.fbcdn.net/v/t1.6435-1/51132488_1049848925197144_4209746563502702592_n.jpg?stp=dst-jpg_p100x100&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_ohc=aMIDY0zGRUIAX-WQPC4&_nc_ht=scontent.fhan5-1.fna&oh=00_AfB_ap1gpD8GBQZ1HKx4zQSVyRyxoJ88HZjSjSzDP_y46Q&oe=64466F7E"
                        className={cx('avatar')}
                    />
                    <h3 className={cx('username')}>To Lam Son</h3>
                </div>
                <hr />
            </div>

            <div className={cx('display')}>
                
                <div className={cx('image-story')}>
                    <div className={cx('icon')}>
                        <i class="fa-regular fa-image"></i>
                    </div>
                    <h5 className={cx('title')}>Create image story</h5>
                </div>

                <div className={cx('text-story')}>
                    <div className={cx('icon')}>
                        <i class="fa-solid fa-font-case"></i>
                    </div>
                    <h5 className={cx('title')}>Create text story</h5>
                </div>

            </div>
        </div>
    );
}

export default CreateStory;
