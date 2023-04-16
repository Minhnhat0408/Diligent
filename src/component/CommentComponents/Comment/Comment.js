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
import { POST_OPTIONS, USER_POST_OPTIONS, getIdInMentions, regex } from '~/utils/constantValue';
import Menu from '~/component/Popper/Menu/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faFilePen, faTrash } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Comment({ data }) {
    const [likeActive, setLikeActive] = useState(false);
    const [isReply, setIsReply] = useState(false);
    const [text, setText] = useState('');
    const { userData, user } = UserAuth();
    const navigate = useNavigate();
    const context = useContext(ThemeContext);
    const handleClickLike = () => {
        setLikeActive(!likeActive);
    };

    const handleClickReply = () => {
        setIsReply(!isReply);
    };
    const userLink = (id) => {
        navigate(routes.user + id);
    };
    useEffect(() => {
        setText(
            data.text.replace(regex, (spc) => {
                const id = spc.match(getIdInMentions)[0].substring(1);
                const name = spc.substring(0, spc.indexOf('('));
                return `<strong id="mentions" data='${id}' name="${name}" >${name}</strong>`;
            }),
        );
    }, []);
    const replace = (domNode) => {
        if (domNode.attribs && domNode.attribs.id === 'mentions') {
            return (
                <strong onClick={() => userLink(domNode.attribs.data)} className={cx('mention')}>
                    {domNode.attribs.name}
                </strong>
            );
        }
    };
    return (
        <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
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
                            item={
                                [
                                    {
                                        icon:<FontAwesomeIcon icon={faFilePen} />,
                                        title: 'Update',
                                        type: 'update' 
                                    },
                                    {
                                        icon:<FontAwesomeIcon icon={faTrash} />,
                                        title: 'Delete',
                                        type: 'delete' 
                                    },
                                ]
                            }
                            // onClick={handlePostOptions}
                        >
                            <div className={cx('options')}>
                                <FontAwesomeIcon icon={faEllipsis} className={cx('icon')} />
                            </div>
                        </Menu>
                    )}
                </div>
                {data.image && <Image className={cx('image')} src={data.image} alt="pic" />}

                <div className={cx('actions')}>
                    <span className={cx('like')} onClick={handleClickLike} style={{ color: likeActive && '#13a0f8' }}>
                        Like
                    </span>
                    <span className={cx('reply')} onClick={handleClickReply}>
                        Reply
                    </span>
                    <span className={cx('time')}>{getTimeDiff(Date.now(), data.time.toMillis())}</span>
                </div>

                {/* {isReply && (
                    <Comment
                        avatar="https://scontent.fhan5-9.fna.fbcdn.net/v/t39.30808-1/277751572_1315302068964376_895612620486881878_n.jpg?stp=dst-jpg_p100x100&_nc_cat=109&ccb=1-7&_nc_sid=7206a8&_nc_ohc=y6DgmDpQOo4AX_5dLAS&_nc_oc=AQmUBH4fWQYChiEt-Q8p-YbMmNFVnHE-bS3BNLHH4eA557wPleTncZFkK0_zQfCkt0A&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.fhan5-9.fna&oh=00_AfACNGCK4LgQWwYDYAKqbgfTkRrjb_LH5MmmHGw4QRWxtg&oe=641EFB00"
                        username="Minh Nhat"
                        paragraph="em nay ngon vkl vay"
                        img="https://scontent.fhan15-1.fna.fbcdn.net/v/t39.30808-6/282784957_3154917814757054_2260434140125186522_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=vPEnTA0MOFIAX9SThQJ&_nc_ht=scontent.fhan15-1.fna&oh=00_AfDIFmevc9bbhdYocGCOf0pZl0Efbn2DUSxM4mBVfSjTKQ&oe=641DA3A3"
                        disable={true}
                    />
                )} */}
                {isReply && user && <MyComment tag={{ name: 'quyen', id: 'fdfasdfasf' }} />}
            </div>
        </div>
    );
}

export default Comment;
