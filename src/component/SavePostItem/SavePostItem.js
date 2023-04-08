import classNames from 'classnames/bind';
import styles from './SavePostItem.module.scss';
import Image from '../Image/Image';
import { useNavigate } from 'react-router-dom';
import routes from '~/config/routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { UserAuth } from '~/contexts/authContext';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
const cx = classNames.bind(styles);

function SavePostItem({ savePostId, savePostData }) {
    const navigate = useNavigate()
    const { deleteSavePost} = UserAuth();
    const context = useContext(ThemeContext)
    return (
        <div className={cx('wrapper',{dark: context.theme === 'dark'})} >
            <div className={cx('content')}>
                <h4 className={cx('title')} onClick={() => navigate(routes.post + savePostId)}>{savePostData.title}</h4>
                <ul className={cx('selected-category')}>
                    {savePostData.tags.map((tag, index) => {
                        return (
                            <li key={index}>
                                {tag}
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className={cx('contributor')}>
                <p>Contributor</p>
                <p className={cx('name')}>{savePostData.user.name}</p>
                <Image src={savePostData.user.avatar} alt="ava" className={cx('avatar')} />
              
            </div>
            <FontAwesomeIcon icon={faXmark} className={cx('delete')} onClick={() => deleteSavePost(savePostId)}/>
        </div>
    );
}

export default SavePostItem;
