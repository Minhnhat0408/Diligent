import classNames from 'classnames/bind';
import styles from './Documents.module.scss';
import { useState } from 'react';
import { UserAuth } from '~/contexts/authContext';
import DocumentItem from '~/component/DocumentItem/DocumentItem';
import Button from '~/component/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
import DocumentForm from '~/component/DocumentForm/DocumentForm';
const cx = classNames.bind(styles);

function Documents() {
    const [uploadFileBox, setUploadFileBox] = useState(false);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const { user } = UserAuth();
    const [description, setDescription] = useState('');
    const handleSubmit = () => {
        console.log(file, title, description);
        setFile(null);
        setTitle('');
        setDescription('');
        setUploadFileBox(false);
    };
    const context = useContext(ThemeContext);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('user-options')}>
                <h4 className={cx('title')}>Document</h4>
                <p className={cx('description')}>"Constructive and helpful files from all around the globe"</p>
                <div className={cx('row')}>
                    <Button dark={context.theme === 'dark'} onClick={() => setUploadFileBox(true) } outline>
                        <FontAwesomeIcon icon={faFilePen} className={cx('icon')} />
                    </Button>
                    <Button dark={context.theme === 'dark'} outline>
                        <FontAwesomeIcon icon={faSearch} className={cx('icon')} />
                    </Button>
                </div>
                <div className={cx('row')}>
                    <Button dark={context.theme === 'dark'} outline>
                        <FontAwesomeIcon icon={faFilter} className={cx('icon')} />
                    </Button>
                    <Button dark={context.theme === 'dark'} outline>
                        <FontAwesomeIcon icon={faSearch} className={cx('icon')} />
                    </Button>
                </div>

                {uploadFileBox && <DocumentForm onXmark={setUploadFileBox}/>}
            </div>

            <div className={cx('content')}>
                <DocumentItem />
                <DocumentItem />
            </div>
        </div>
    );
}

export default Documents;
