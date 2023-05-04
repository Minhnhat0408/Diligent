import classNames from 'classnames/bind';
import styles from './DocumentForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFileArchive, faImages, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
import { UserAuth } from '~/contexts/authContext';
import Image from '../Image/Image';
import Menu from '../Popper/Menu/Menu';
import { CATEGORY_OPTIONS } from '~/utils/constantValue';
import { useState } from 'react';
import { useRef } from 'react';
import Button from '../Button/Button';
const cx = classNames.bind(styles);

function DocumentForm({ onXmark }) {
    const context = useContext(ThemeContext);
    const { user, userData } = UserAuth();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [fileType,setFileType] = useState();
    const title = useRef();
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
    const handleUpload = () =>{

    
    }
    return (
        <div className={cx('pop-up')}>
            <div className={cx('wrapper',{dark:context.theme === 'dark'})}>
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
                        placeholder="Enter your file name"
                        ref={title}
                        className={cx('input', 'inp-title')}
                    />
                    <ul className={cx('selected-category')}>
                        {selectedCategories.map((category, index) => (
                            <li key={index} onClick={() => handleDeleteCategory(category)}>
                                <p>{category}</p>
                                <FontAwesomeIcon icon={faXmark} />
                            </li>
                        ))}
                    </ul>
                    <div className={cx('file-info')}>
                        <span className={cx('des')}>
                            {!fileType ? 'Please choose a file' : 'File format:'}
                            {fileType && <FontAwesomeIcon icon={fileType.icon}/>}
                        </span>
                     
                        <label htmlFor='document' className={cx('choose-file')}>
                            Choose a file
                        </label>
                        <input type='file' id='document' className={cx('d-none')}/>
                    </div>
                </div>
                <Button
                    primary
                    dark={context.theme === 'dark'}
                    onClick={handleUpload}
                    className={cx('upload')}
                >
                    Upload
                </Button>
            </div>
        </div>
    );
}

export default DocumentForm;
