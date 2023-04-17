import classNames from 'classnames/bind';
import { useState } from 'react';
import styles from './Comment.module.scss';
import { MyComment } from '../MyComment';
import Image from '~/component/Image/Image';
import parse from 'html-react-parser';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '~/config/routes';
import getTimeDiff from '~/utils/timeDiff';
import { UserAuth } from '~/contexts/authContext';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
import { getIdInMentions, regex } from '~/utils/constantValue';
import Menu from '~/component/Popper/Menu/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faFilePen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { deleteDoc, doc, updateDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '~/firebase';

const cx = classNames.bind(styles);
function Comment({ data, id, handleUpdate,handleSubmit, postId, postData }) {
    const [likeActive, setLikeActive] = useState(false);
    const [isReply, setIsReply] = useState(false);
    const [text, setText] = useState('');
    const { user } = UserAuth();
    const navigate = useNavigate();
    const context = useContext(ThemeContext);
    const [update, setUpdate] = useState(false);
    const [subComments, setSubComments] = useState([]);
    const handleClickLike = () => {
        setLikeActive(!likeActive);
    };

    const handleClickReply = () => {

        setIsReply(!isReply);
      
    };
    const userLink = (id) => {
        navigate(routes.user + id);
    };
    const fetchSubComment = async () => {
        const q = query(collection(db, 'posts', postId, 'comments'), where('fatherCmt', '==', id));
        const tmp = [];
        const docs = await getDocs(q);
        docs.forEach((doc) => {

            tmp.push({ id: doc.id, data: doc.data() });
        });
        console.log(tmp)
        setSubComments(tmp);
    };
    useEffect(() => {
        

        if (isReply) {
            fetchSubComment();
        }else{
            setText(
                data.text.replace(regex, (spc) => {
                    const id = spc.match(getIdInMentions)[0].substring(1);
                    const name = spc.substring(0, spc.indexOf('('));
                    return `<strong id="mentions" data='${id}' name="${name}" >${name}</strong>`;
                }),
            );
        }
        setUpdate(false);
    }, [data,isReply]);

    const replace = (domNode) => {
        if (domNode.attribs && domNode.attribs.id === 'mentions') {
            return (
                <strong onClick={() => userLink(domNode.attribs.data)} className={cx('mention')}>
                    {domNode.attribs.name}
                </strong>
            );
        }
    };

    const handleCommentOptions = async (item) => {
        let type = item.type;
        if (type === 'update') {
            setUpdate(true);
            await updateDoc(doc(db, 'posts', postId), {
                commentNumber: postData.commentNumber,
            });
        } else if (type === 'delete') {
            await deleteDoc(doc(db, 'posts', postId, 'comments', id));
            await updateDoc(doc(db, 'posts', postId), {
                commentNumber: postData.commentNumber - 1,
            });
        }
    };
    return (
        <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
            {!update ? (
                <>
                    <Image src={data.user.avatar} className={cx('avatar')} alt="ava" />
                    <div className={cx('comment')}>
                        <h5 className={cx('username')}>{data.user.name}</h5>
                        <div className={cx('row')}>
                            <div className={cx('message')}>
                                <div className={cx('content')}>{parse(text, { replace })}</div>
                            </div>
                            {data.user.id === user?.uid && (
                                <Menu
                                    // chinh ben trai / chieu cao so vs ban dau
                                    item={[
                                        {
                                            icon: <FontAwesomeIcon icon={faFilePen} />,
                                            title: 'Update',
                                            type: 'update',
                                        },
                                        {
                                            icon: <FontAwesomeIcon icon={faTrash} />,
                                            title: 'Delete',
                                            type: 'delete',
                                        },
                                    ]}
                                    onClick={handleCommentOptions}
                                >
                                    <div className={cx('options')}>
                                        <FontAwesomeIcon icon={faEllipsis} className={cx('icon')} />
                                    </div>
                                </Menu>
                            )}
                        </div>
                        {data.image && <Image className={cx('image')} src={data.image} alt="pic" />}

                        <div className={cx('actions')}>
                            <span
                                className={cx('like')}
                                onClick={handleClickLike}
                                style={{ color: likeActive && '#13a0f8' }}
                            >
                                Like
                            </span>
                            {isReply && <span className={cx('reply')} onClick={handleClickReply}>
                                Reply
                            </span>}
                            {data.isEdited && <span className={cx('edit')}>Edited</span>}
                            <span className={cx('time')}>{getTimeDiff(Date.now(), data.time.toMillis())}</span>
                        </div>

                        {isReply &&
                            subComments.length !== 0 &&
                            subComments.map((comment) => {
                                return (
                                    <Comment
                                        key={comment.id}
                                        handleUpdate={handleUpdate}
                                   
                                        data={comment.data}
                                        id={comment.id}
                                        postId={id}
                                        postData={data}
                                    />
                                );
                            })}
                        {isReply && user && (
                            <MyComment tag={{ name: data.user.name, id: data.user.id,father:id }} onClick={handleSubmit} />
                        )}
                    </div>
                </>
            ) : (
                <>
                    <MyComment
                        onClick={(e) => {
                            return handleUpdate(e);
                        }}
                        update={{ id: id, postId: postId, data: data }}
                    />
                </>
            )}
        </div>
    );
}

export default Comment;
