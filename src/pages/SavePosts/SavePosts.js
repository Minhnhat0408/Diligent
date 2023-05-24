import classNames from 'classnames/bind';
import styles from './SavePosts.module.scss';
import Image from '~/component/Image';
import SavePostItem from '~/component/SavePostItem/SavePostItem';
import image from '~/assets/images';
import { useEffect } from 'react';
import { useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '~/firebase';
import { UserAuth } from '~/contexts/authContext';
const cx = classNames.bind(styles);

function SavePosts() {
    const { user } = UserAuth();
    const [savePosts,setSavePosts] = useState([]);
    useEffect(() =>{
        getDocs(query(collection(db,'users',user.uid,'saves'),orderBy('time','desc'))).then((p) =>{
            const newData = p.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
            setSavePosts(newData);
        })  
    },[])   

    return (
        <div className={cx('wrapper')}>
            {savePosts.length !== 0 ? (
                savePosts.map((dat, id) => {
                    return <SavePostItem key={id} savePostId={dat.id} savePostData={dat.data} />;
                })
            ) : (
                <Image src={image.noContent} alt="nothing here" className={cx('no-content')} />
            )}
        </div>
    );
}

export default SavePosts;
