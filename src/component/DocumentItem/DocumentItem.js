import classNames from 'classnames/bind';
import styles from './DocumentItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFilePdf, faUser, faClock } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);
/*
    title: De thi cuoi ky TIN hieu he thong
    type pdf
    tag Math
    contributor: {
        name:Minh dep trai
        id:
        ava:fdasfdsa
    }
    time: 1/5/2023
*/
const savePostData = ['Tieng Anh', 'Tieng Nhat','Tieng Anh', 'Tieng Nhat','Tieng Anh', 'Tieng Nhat','Tieng Anh', 'Tieng Nhat'];

function DocumentItem() {
    const context = useContext(ThemeContext);
    return (
        <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
            <div className={cx('content')}>
                <h4
                    className={cx('title')}
                    onClick={() => {
                        //handle dowload file
                    }}
                >
                    De thi giua kikdfslgj dsafdsa dsaf fdasf  dsafd
                </h4> 
                <FontAwesomeIcon icon={faFilePdf} className={cx('file-preview')} />
            </div>
            <ul className={cx('selected-category')}>
                {savePostData.map((tag, index) => {
                    return <li key={index}>{tag}</li>;
                })}
            </ul>
            <div className={cx('contributor')}>
                <div className={cx('upload-wrapper')}>
                    <FontAwesomeIcon icon={faUser} />
                    <p>Uploaded by: </p>
                    <Link className={cx('name')} to={'localhost://sdksoadkaosd'}>
                        {'Nguyen Thanh Dung'}
                    </Link>
                </div>
                <div className={cx('time-wrapper')}>
                    <FontAwesomeIcon icon={faClock} />
                    <p>
                        Created: <span className={cx('time')}>5 seconds ago</span>
                    </p>
                </div>
            </div>
            <FontAwesomeIcon
                icon={faDownload}
                className={cx('download')}
                onClick={() => {
                    // handle dowload file
                }}
            />
        </div>
    );
}

export default DocumentItem;
