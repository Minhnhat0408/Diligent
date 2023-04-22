import classNames from 'classnames/bind';
import styles from './Documents.module.scss';
import { useState } from 'react';
import { UserAuth } from '~/contexts/authContext';
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
    return (
        <div className={cx('wrapper')}>
                {user && (
                    <div className={cx('user-options')}>
                        
                        <button onClick={() => setUploadFileBox(true)}>Upload</button>
                        {uploadFileBox && (
                            <div>
                                <input type="file" onChange={(e) => setFile(e.target.files[0])}></input>
                                <br></br>
                                <input
                                    type="text"
                                    placeholder="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <br></br>
                                <input
                                    type="text"
                                    placeholder="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <br></br>
                                <button onClick={handleSubmit}>Submit</button>
                            </div>
                        )}
                    </div>
                )}
                <div className={cx('content')}></div>
        </div>
    );
}

export default Documents;
