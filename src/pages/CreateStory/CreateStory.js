import classNames from 'classnames/bind';
import Image from '~/component/Image';
import styles from './CreateStory.module.scss';
import { useState, useMemo, useCallback, useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
import { db } from '~/firebase';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { UserAuth } from '~/contexts/authContext';
import { useNavigate } from 'react-router-dom';
import routes from '~/config/routes';
import { RingLoader } from 'react-spinners';
import { GlobalProps } from '~/contexts/globalContext';

const cx = classNames.bind(styles);

const colors = [
    'black',
    'red',
    'green',
    'white',
    'blue',
    'gray',
    'purple',
    'brown',
    'pink',
    'orange',
    'yellow',
    'tomato',
    'violet',
    'azure',
    'salmon',
    'sienna',
];

const backgroundColors = [
    'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
    'linear-gradient(to bottom, #DECBA4, #3E5151)',
    'linear-gradient(to bottom, #8360c3, #2ebf91)',
    'linear-gradient(to bottom, #8e2de2, #4a00e0)',
    'linear-gradient(to bottom, #fffbd5, #b20a2c)',
    'linear-gradient(to bottom, #fc5c7d, #6a82fb)',
    'linear-gradient(to bottom, #c6ffdd, #fbd786, #f7797d)',
    'linear-gradient(to bottom, #00b4db, #0083b0)',
    'linear-gradient(to bottom, #434343 0%, black 100%)',
    'linear-gradient(-20deg, #00cdac 0%, #8ddad5 100%)',
    'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)',
    'linear-gradient(to bottom, #00b09b, #96c93d)',
    'linear-gradient(to bottom, rgb(242, 112, 156), rgb(255, 148, 114))',
    'linear-gradient( 109.6deg, rgba(156,252,248,1) 11.2%, rgba(110,123,251,1) 91.1% )',
    'linear-gradient(25deg,#d64c7f,#ee4758 50%)',
    'linear-gradient( 95.2deg, rgba(173,252,234,1) 26.8%, rgba(192,229,246,1) 64% )',
];

function CreateStory() {
    // Xử lí logic để hiện preview ảnh khi ấn thêm ảnh vào comment
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [counter, setCounter] = useState(0);
    const [loading, setLoading] = useState(false);
    const context = useContext(ThemeContext);
    const { user, userData } = UserAuth();
    const {fileUpload} = GlobalProps()
    const navigate = useNavigate();
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            const fileURL = reader.result;
            if (file.type.startsWith('image/')) {
                // Xử lý khi định dạng là hình ảnh
                setImagePreview(fileURL);
                setCounter((prevCounter) => prevCounter + 1);
            } else if (file.type.startsWith('video/')) {
                // Xử lý khi định dạng là video
                setVideoPreview(fileURL);
                setCounter((prevCounter) => prevCounter + 1);
            } else {
                // Xử lý khi định dạng không hợp lệ
                console.error('Định dạng tệp tin không được hỗ trợ');
            }
        };

        reader.readAsDataURL(file);
    };

    const handleDeleteFile = useCallback(() => {
        URL.revokeObjectURL(imagePreview);
        URL.revokeObjectURL(videoPreview);
        setSelectedFile(null);
        setImagePreview(null);
        setVideoPreview(null);
        setCounter((prevCounter) => prevCounter + 1);
    }, [imagePreview, videoPreview]);

    //resize image
    const [scale, setScale] = useState(1);

    const handleSliderChange = (e) => {
        const value = e.target.value;
        setScale(value / 50);
    };

    //add text
    const [addText, setAddText] = useState('');

    const handleInputText = useCallback((value) => {
        setAddText(value);
    }, []);

    //drag message
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseDown = (event) => {
        const startX = event.pageX - position.x;
        const startY = event.pageY - position.y;

        const handleMouseMove = (event) => {
            const newX = event.pageX - startX;
            const newY = event.pageY - startY;
            setPosition({ x: newX, y: newY });
        };

        document.addEventListener('mousemove', handleMouseMove);

        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', handleMouseMove);
        });
    };

    //text preview
    const [textPreview, setTextPreview] = useState(false);
    const handleClickTextPreview = () => {
        setTextPreview(true);
    };

    //change text color
    const [color, setColor] = useState('black');
    const handleClickTextColor = useCallback((value) => {
        setColor(value);
    }, []);

    const colorItems = useMemo(() => {
        return colors.map((color) => (
            <div
                key={color}
                className={cx('item', color)}
                style={{ backgroundColor: color }}
                onClick={() => {
                    handleClickTextColor(color);
                }}
            ></div>
        ));
    }, []);

    //change background color
    const [backgroundColor, setBackgroundColor] = useState('rgba(17, 17, 17, 0.93)');
    const handleClickBackGroundColor = useCallback((value) => {
        setBackgroundColor(value);
    }, []);

    const backgroundColorItems = useMemo(() => {
        return backgroundColors.map((backgroundColor) => (
            <div
                key={backgroundColor}
                className={cx('item', backgroundColor)}
                style={{ backgroundImage: backgroundColor }}
                onClick={() => {
                    handleClickBackGroundColor(backgroundColor);
                }}
            ></div>
        ));
    }, []);

    //click cancel
    const handleClickCancel = () => {
        handleDeleteFile();
        setAddText('');
        setColor('black');
        setBackgroundColor('white');
        setPosition({ x: 0, y: 0 });
        setTextPreview(false);
    };

    const handleClickShare = async () => {
        //nếu đang load thì không làm gì
        if (loading) return;

        setLoading(true); // Đặt trạng thái loading thành true
        let fileName;
        try {
            const results = await fileUpload({ file: selectedFile, name: selectedFile.name });
            fileName = results.url;
        } catch (error) {
            console.log('Upload failed', error);
        }

        const data = {
            type: videoPreview ? 'video' : 'image',
            content: {
                bgColor: backgroundColor,
                posX: position.x,
                posY: position.y,
                text: addText,
                textColor: color,
            },
            media: [fileName || ''],
            scale: scale,
            time: serverTimestamp(),
            user: {
                avatar: userData.user_avatar,
                id: user.uid,
                name: userData.user_name,
            },
        };

        const docRef = await addDoc(collection(db, 'stories'), data);
        handleClickCancel();

        setLoading(false);
        navigate(routes.story + user.uid); // Đặt trạng thái loading thành false sau khi hoàn thành
        return docRef;
    };

  

    return (
        <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
            {loading && (
                <div className="pop-up loader">
                    <RingLoader color="#367fd6" size={150} speedMultiplier={0.5} />
                </div>
            )}
            <div className={cx('sidebar')}>
                <h1 className={cx('header')}>Your Shorts</h1>
                <hr />
                <div className={cx('info')}>
                    <Image src={userData?.user_avatar} className={cx('avatar')} alt="avatar" />
                    <h3 className={cx('username')}>{userData?.user_name}</h3>
                </div>
                <hr />

                {(imagePreview || videoPreview || textPreview == true) && (
                    <>
                        <textarea
                            className={cx('add-text')}
                            placeholder="Start typing"
                            onChange={(e) => {
                                handleInputText(e.target.value);
                            }}
                        ></textarea>

                        <div className={cx('color')}>
                            <h3 className={cx('title')}>Text color</h3>
                            <div className={cx('lists')}>
                                <div className={cx('items')}>{colorItems.slice(0, 8)}</div>
                                <div className={cx('items')}>{colorItems.slice(8)}</div>
                            </div>
                        </div>

                        <div className={cx('color')}>
                            <h3 className={cx('title')}>Background color</h3>
                            <div className={cx('lists')}>
                                <div className={cx('items')}>{backgroundColorItems.slice(0, 8)}</div>
                                <div className={cx('items')}>{backgroundColorItems.slice(8)}</div>
                            </div>
                        </div>
                    </>
                )}

                {(imagePreview || videoPreview || textPreview == true) && (
                    <div className={cx('options')}>
                        <button className={cx('cancel')} onClick={handleClickCancel}>
                            Cancel
                        </button>
                        {loading ? (
                            <button className={cx('share')} disabled>
                                Loading...
                            </button>
                        ) : (
                            <button className={cx('share')} onClick={handleClickShare}>
                                Share
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className={cx('display')}>
                {imagePreview == null && videoPreview == null && textPreview == false && (
                    <>
                        <label htmlFor="upload-img-story">
                            <div className={cx('image-story')}>
                                <div className={cx('icon')}>
                                    <i className="fa-regular fa-image"></i>
                                </div>
                                <h5 className={cx('title')}>Create image/video short</h5>
                            </div>
                        </label>

                        <input
                            type="file"
                            id={cx('upload-img-story')}
                            className={cx('d-none')}
                            onChange={handleFileInputChange}
                            key={counter}
                            accept="image/*, video/*"
                        />

                        <div className={cx('text-story')} onClick={handleClickTextPreview}>
                            <div className={cx('icon')}>
                                <i className="fa-solid fa-font-case"></i>
                            </div>
                            <h5 className={cx('title')}>Create text short</h5>
                        </div>
                    </>
                )}

                {videoPreview && (
                    <div>
                        {/* <h1 className={cx('header')}>Preview</h1> */}
                        <div className={cx('preview')}>
                            <div className={cx('image-wrap')} style={{ backgroundImage: backgroundColor }}>
                                {addText && (
                                    <div
                                        className={cx('message')}
                                        style={{
                                            transform: `translate(${position.x}px, ${position.y}px)`,
                                            color: color,
                                        }}
                                        onMouseDown={handleMouseDown}
                                    >
                                        {addText}
                                    </div>
                                )}
                                <video src={videoPreview} controls className={cx('video')} alt={'video'} />
                            </div>
                        </div>
                    </div>
                )}

                {imagePreview && (
                    <div>
                        {/* <h1 className={cx('header')}>Preview</h1> */}

                        <div className={cx('preview')}>
                            <div className={cx('image-wrap')} style={{ backgroundImage: backgroundColor }}>
                                {addText && (
                                    <div
                                        className={cx('message')}
                                        style={{
                                            transform: `translate(${position.x}px, ${position.y}px)`,
                                            color: color,
                                        }}
                                        onMouseDown={handleMouseDown}
                                    >
                                        {addText}
                                    </div>
                                )}
                                <Image
                                    src={imagePreview}
                                    alt="image story"
                                    className={cx('image')}
                                    style={{ transform: `scale(${scale})` }}
                                />
                            </div>

                            <input type="range" min="0" max="100" onChange={handleSliderChange} />
                        </div>
                    </div>
                )}

                {textPreview && (
                    <div>
                        {/* <h1 className={cx('header')}>Preview</h1> */}

                        <div className={cx('preview')}>
                            <div className={cx('image-wrap')} style={{ backgroundImage: backgroundColor }}>
                                {addText && (
                                    <div
                                        className={cx('message')}
                                        style={{
                                            transform: `translate(${position.x}px, ${position.y}px)`,
                                            color: color,
                                        }}
                                        onMouseDown={handleMouseDown}
                                    >
                                        {addText}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateStory;
