import classNames from 'classnames/bind';
import styles from './DocumentForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
import { UserAuth } from '~/contexts/authContext';
import Image from '../../Image/Image';
import Menu from '../../Popper/Menu/Menu';
import { CATEGORY_OPTIONS } from '~/utils/constantValue';
import { useState } from 'react';
import { useRef } from 'react';
import Button from '../../Button/Button';
import { useDropzone } from 'react-dropzone';
import { useEffect } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '~/firebase';
import { RingLoader } from 'react-spinners';
const cx = classNames.bind(styles);

function DocumentForm({ onXmark }) {
    const context = useContext(ThemeContext);
    const { user, userData, fileUpload } = UserAuth();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const title = useRef();
    const [file, setFile] = useState();
    const [invalid, setInvalid] = useState(false);
    const [loading, setLoading] = useState(false);
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
    });
    useEffect(() => {
        acceptedFiles.forEach((file) => {
            let type = file.path.split('.').pop();
            let icon = null;
            if (type === 'csv') {
                icon = faFileCsv;
            } else if (type === 'doc' || type === 'docx') {
                icon = faFileWord;
            } else if (type === 'pdf') {
                icon = faFilePdf;
            } else if (type === 'xlsx' || type === 'xls') {
                icon = faFileExcel;
            } else if (type === 'pptx') {
                icon = faFilePowerpoint;
            } else {
                icon = faFile;
            }

            setFile({ ref: acceptedFiles[0], type: type, icon: icon, name: `${file.name} - ${file.size} bytes` });
        });
    }, [acceptedFiles]);

    const handleAddCategory = (value) => {
        console.log('fsdafs');
        if (!selectedCategories.includes(value.title)) {
            setSelectedCategories([...selectedCategories, value.title]);
        } else {
            return;
        }
    };
    const handleDeleteCategory = (value) => {
        setSelectedCategories(selectedCategories.filter((category) => category !== value));
    };
    const handleUpload = async () => {
        let tmpfile = null;
        if (!file) {
            setInvalid(true);
            return;
        } else {
            setLoading(true);
            tmpfile = await fileUpload({
                file: file.ref,
                name: title.current.value + '.' + file.type || file.name,
                location: 'others',
            });
        }
        await addDoc(collection(db, 'documents'), {
            title: title.current.value || file.name,
            type: file.type,
            createdAt: serverTimestamp(),
            url: tmpfile.url,
            downloads: 0,
            user: {
                name: userData.user_name,
                id: user.uid,
                ava: userData.user_avatar,
            },
            tag: selectedCategories,
        });
        setFile();
        setSelectedCategories([]);
        title.current.value = '';
        onXmark(false);
        setLoading(false);
    };
    return (
        <div className={cx('pop-up')}>
            {loading && (
                <div className="pop-up loader">
                    <RingLoader color="#367fd6" size={150} speedMultiplier={0.5} />
                </div>
            )}
            <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
                <div className={cx('header')}>
                    <div></div>
                    <h1 className={cx('title')}>Upload</h1>
                    <div className={cx('out')} onClick={() => onXmark(false)}>
                        <FontAwesomeIcon icon={faXmark} />
                    </div>
                </div>
                <hr />
                <div className={cx('body', { dark: context.theme === 'dark' })}>
                    <div className={cx('info')}>
                        <Image className={cx('avatar')} alt="ava" src={userData?.user_avatar} />
                        <Menu
                            offset={[0, 30]}
                            // chinh ben trai / chieu cao so vs ban dau
                            placement="right"
                            item={CATEGORY_OPTIONS}
                            small
                            onClick={handleAddCategory}
                        >
                            <div>
                                <h5 className={cx('username')}>{userData.user_name}</h5>
                                <div className={cx('category')}>
                                    <p>Choose category</p>
                                    <i className="fa-solid fa-chevron-right"></i>
                                </div>
                            </div>
                        </Menu>
                    </div>
                    <textarea
                        placeholder="Enter your file name or leave it default"
                        ref={title}
                        className={cx('input', 'inp-title')}
                    />
                    {selectedCategories.length !== 0 && (
                        <ul className={cx('selected-category')}>
                            {selectedCategories.map((category, index) => (
                                <li key={index} onClick={() => handleDeleteCategory(category)}>
                                    <p>{category}</p>
                                    <FontAwesomeIcon icon={faXmark} />
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className={cx('file-container', { dark: context.theme === 'dark' })}>
                        <div
                            {...getRootProps({
                                className: invalid ? `${styles.dropzone} ${styles.invalid}` : styles.dropzone,
                            })}
                        >
                            <input {...getInputProps()} />
                            {/* accept='.pdf,.doc,.docx,.xls,.xlsx,.pptx,.txt,.csv,.zip,.rar' */}
                            <p>{file ? file.name : "Drag 'n' drop file here, or click to select file"}</p>
                        </div>
                        {file && (
                            <div className={cx('file-info')}>
                                <span className={cx('file-type')}>File type: {file.type}</span>
                                <FontAwesomeIcon icon={file.icon} className={cx('file-icon', file.type)} />
                            </div>
                        )}
                    </div>
                </div>
                <Button primary dark={context.theme === 'dark'} onClick={handleUpload} className={cx('upload')}>
                    Upload
                </Button>
            </div>
        </div>
    );
}

export default DocumentForm;
