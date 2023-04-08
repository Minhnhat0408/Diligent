import classNames from 'classnames/bind';
import styles from './SavePosts.module.scss';
import Image from '~/component/Image';
import { UserAuth } from '~/contexts/authContext';
import SavePostItem from '~/component/SavePostItem/SavePostItem';
import image from '~/assets/images';
const cx = classNames.bind(styles);

function SavePosts() {
 
    const { savePostData } = UserAuth();

    return (
        <div className={cx('wrapper')}>
            {savePostData.length !== 0 ? (
                savePostData.map((dat, id) => {
                    return <SavePostItem key={id} savePostId={dat.id} savePostData={dat.data} />;
                })
            ) : (
                <Image src={image.noContent} alt="nothing here" className={cx('no-content')} />
            )}
        </div>
    );
}

export default SavePosts;
