import classNames from 'classnames/bind'
import styles from './SavePosts.module.scss'
import Image from '~/component/Image';
import { useState,useEffect } from 'react';
import { getDocs,collection } from 'firebase/firestore';
import { db } from '~/firebase';
import { UserAuth } from '~/contexts/authContext';
const cx = classNames.bind(styles)

function SavePosts() {
    const [savePostData,setSavePostData] = useState();
    const {user} = UserAuth();
    useEffect(() => {
        const fetchdata= async () =>{
            const data = await getDocs(collection(db,'users',user.uid,'saves'))
            const result = data.docs.map((doc) => {
                return doc.data();
            })
            console.log(result)
            setSavePostData(result)
        }
        fetchdata();
        //setSavePostData
    },[])
    return ( 
    <div className={cx('wrapper')}>
        {savePostData ? (
            savePostData.map((dat) => {
                return (
                <div className={cx('savepost-wrapper')}>
                    <h4>{dat.title}</h4>
                    <div className={cx('contributor')}>
                        <p>Contributor</p>
                        <Image src={dat.user.avatar} alt='ava' className={cx('avatar')}/>
                        <p>{dat.user.name}</p>
                    </div>
                </div>)
            })
        ) : (
        <div>
            Khong co gi
        </div>) }
        
    </div>);
}

export default SavePosts;