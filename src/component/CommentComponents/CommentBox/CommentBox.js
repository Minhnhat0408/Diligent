import classNames from 'classnames/bind';
import styles from './CommentBox.module.scss';
import Comment from '~/component/CommentComponents/Comment/Comment';
import MyComment from '~/component/CommentComponents/MyComment/MyComment';
import { useEffect, useState } from 'react';
import { addDoc, collection, doc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '~/firebase';
import Image from '~/component/Image/Image';
import image from '~/assets/images';
import { UserAuth } from '~/contexts/authContext';
import type from '~/config/typeNotification';
import routes from '~/config/routes';

const cx = classNames.bind(styles);



function CommentBox({id,data}) {
    const [comments,setComments] = useState([]);
    const {fileUpload,user,userData,posts} = UserAuth();
    useEffect(() => {
        const fetchComment = async () => {
            const  tmp = []
            const docs = await getDocs(collection(db,'posts',id,'comments'));
            docs.forEach((doc) => {
                tmp.push({ id: doc.id, data: doc.data() });
            });
            setComments(tmp);
        }
        fetchComment()
    },[posts])
    console.log(comments)

    const handleSubmit = async(inpData) =>{
        const image = null;
        if(inpData.image) {
           image= await fileUpload(inpData.image,inpData.image.name)
        }

        
        await addDoc(collection(db,'posts',id,'comments'),{
            text:inpData.text,
            image:image?.url || '',
            time:serverTimestamp(),
            isEdited:false,
            user:{
                name: userData.user_name,
                id: user.uid,
                avatar: userData.user_avatar,
            },
            like:{
                count:0,
                list:[]
            }

        })
        await updateDoc(doc(db,'posts',id),{
            commentNumber:data.commentNumber+1,
        })
        if(data.user.id !== user.uid){
            await addDoc(collection(db,'users',data.user.id,'notifications'),{
                title: type.comment,
                url: routes.post + id,
                sender: {
                    id: user.uid,
                    name: userData.user_name,
                    avatar: userData.user_avatar,
                },
                type: 'comment',
                time: new Date(),
                read: false,
            })

        }
      
    }
    return (
        <div className={cx('wrapper')}>
            {comments.length !== 0 ? comments.map((comment) => {
                return (
                    <Comment
                        key={comment.id}
                       data={comment.data}
                    />
                );
            }) :  (
                <Image src={image.noContent} alt="nothing here" className={cx('no-content')} />
            )}

            <MyComment onClick={handleSubmit}/>
        </div>
    );
}

export default CommentBox;
