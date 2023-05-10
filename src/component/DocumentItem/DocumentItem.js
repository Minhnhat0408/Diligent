import classNames from 'classnames/bind';
import styles from './DocumentItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faUser, faClock } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '~/contexts/Context';
import {
    faFile,
    faFileCsv,
    faFileExcel,
    faFilePdf,
    faFilePowerpoint,
    faFileWord,
    faImages,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import getTimeDiff from '~/utils/timeDiff';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '~/firebase';
import { UserAuth } from '~/contexts/authContext';
import { adminId } from '~/utils/constantValue';
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
const savePostData = [
    'Tieng Anh',
    'Tieng Nhat',
    'Tieng Anh',
    'Tieng Nhat',
    'Tieng Anh',
    'Tieng Nhat',
    'Tieng Anh',
    'Tieng Nhat',
];

function DocumentItem({ id, data }) {
    const context = useContext(ThemeContext);
    const { user } = UserAuth();
    const [icon, setIcon] = useState(() => {
        if (data.type === 'csv') {
            return faFileCsv;
        } else if (data.type === 'doc' || data.type === 'docx') {
            return faFileWord;
        } else if (data.type === 'pdf') {
            return faFilePdf;
        } else if (data.type === 'xlsx' || data.type === 'xls') {
            return faFileExcel;
        } else if (data.type === 'pptx') {
            return faFilePowerpoint;
        } else {
            return faFile;
        }
    });
    const handleDownloadFile = async () => {
        try {
            await updateDoc(doc(db, 'documents', id), {
                downloads: data.downloads + 1,
            });
        } catch (err) {
            alert(err);
        }
    };
    const handleDeleteDoc = async () => {
        try {
            await deleteDoc(doc(db, 'documents', id));
        } catch (err) {
            alert(err);
        }
    };
    return (
        <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
            <div className={cx('content')}>
                <h4
                    className={cx('title')}
                    onClick={() => {
                        //handle dowload file
                    }}
                >
                    {data.title}
                </h4>
                <FontAwesomeIcon icon={icon} className={cx('file-preview', data.type)} />
            </div>
            <ul className={cx('selected-category')}>
                {data.tag.map((tag, index) => {
                    return <li key={index}>{tag}</li>;
                })}
            </ul>
            <div className={cx('contributor')}>
                <div className={cx('upload-wrapper')}>
                    <FontAwesomeIcon icon={faUser} />
                    <p>Uploaded by: </p>
                    <Link className={cx('name')} to={routes.user + data.user.id}>
                        {data.user.name}
                    </Link>
                </div>
                <div className={cx('time-wrapper')}>
                    <FontAwesomeIcon icon={faClock} />
                    <p>
                        Created:{' '}
                        <span className={cx('time')}>{getTimeDiff(new Date(), data.createdAt?.toMillis())} ago</span>
                    </p>
                </div>
            </div>

            <div className={cx('download-section')}>
                <a href={data.url} target="_blank" download={data.title + '.' + data.type}>
                    <FontAwesomeIcon icon={faDownload} className={cx('download-btn')} onClick={handleDownloadFile} />
                </a>
                <div className={cx('download-count')}>{data.downloads}</div>
            </div>
            {(user.uid === data.user.id || user.uid === adminId) && (
                <FontAwesomeIcon icon={faXmark} className={cx('delete')} onClick={handleDeleteDoc} />
            )}
        </div>
    );
}

export default DocumentItem;
