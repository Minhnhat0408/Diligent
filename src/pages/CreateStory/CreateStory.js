import classNames from 'classnames/bind';
import Image from '~/component/Image';
import styles from './CreateStory.module.scss';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

function CreateStory() {
    // Xử lí logic để hiện preview ảnh khi ấn thêm ảnh vào comment
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [counter, setCounter] = useState(0);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setCounter((prevCounter) => prevCounter + 1);
        };
        reader.readAsDataURL(file);
    };

    const handleDeleteImage = () => {
        URL.revokeObjectURL(imagePreview);
        setSelectedFile(null);
        setImagePreview(null);
        setCounter((prevCounter) => prevCounter + 1);
    };

    //resize image
    const [scale, setScale] = useState(1);

    const handleSliderChange = (e) => {
        const value = e.target.value;
        setScale(value / 50);
    };

    //add text
    const [addText, setAddText] = useState();

    const handleInputText = (value) => {
        setAddText(value);
    };

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
    const handleClickTextColor = (value) => {
        setColor(value);
    };

    const colorItems = colors.map((color) => (
        <div
            key={color}
            className={cx('item', color)}
            style={{ backgroundColor: color }}
            onClick={() => {
                handleClickTextColor(color);
            }}
        ></div>
    ));

    //change background color
    const [backgroundColor, setBackgroundColor] = useState('white');
    const handleClickBackGroundColor = (value) => {
        setBackgroundColor(value);
    };

    const backgroundColorItems = colors.map((color) => (
        <div
            key={color}
            className={cx('item', color)}
            style={{ backgroundColor: color }}
            onClick={() => {
                handleClickBackGroundColor(color);
            }}
        ></div>
    ));

    //click cancel
    const handleClickCancel = () => {
        handleDeleteImage();
        setAddText('');
        setColor('black');
        setBackgroundColor('white');
        setPosition({ x: 0, y: 0 });
        setTextPreview(false)
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('sidebar')}>
                <h1 className={cx('header')}>Your Story</h1>
                <hr />
                <div className={cx('info')}>
                    <Image
                        src="https://scontent.fhan5-1.fna.fbcdn.net/v/t1.6435-1/51132488_1049848925197144_4209746563502702592_n.jpg?stp=dst-jpg_p100x100&_nc_cat=102&ccb=1-7&_nc_sid=7206a8&_nc_ohc=aMIDY0zGRUIAX-WQPC4&_nc_ht=scontent.fhan5-1.fna&oh=00_AfB_ap1gpD8GBQZ1HKx4zQSVyRyxoJ88HZjSjSzDP_y46Q&oe=64466F7E"
                        className={cx('avatar')}
                    />
                    <h3 className={cx('username')}>To Lam Son</h3>
                </div>
                <hr />

                {(imagePreview || textPreview == true) && (
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

                {(imagePreview || textPreview == true) && (
                    <div className={cx('options')}>
                        <button className={cx('cancel')} onClick={handleClickCancel}>
                            Cancel
                        </button>
                        <button className={cx('share')}>Share</button>
                    </div>
                )}
            </div>

            <div className={cx('display')}>
                {imagePreview == null && textPreview == false && (
                    <>
                        <label for="upload-img-story">
                            <div className={cx('image-story')}>
                                <div className={cx('icon')}>
                                    <i class="fa-regular fa-image"></i>
                                </div>
                                <h5 className={cx('title')}>Create image story</h5>
                            </div>
                        </label>

                        <input
                            type="file"
                            id={cx('upload-img-story')}
                            className={cx('d-none')}
                            onChange={handleImageChange}
                            key={counter}
                        />

                        <div className={cx('text-story')} onClick={handleClickTextPreview}>
                            <div className={cx('icon')}>
                                <i class="fa-solid fa-font-case"></i>
                            </div>
                            <h5 className={cx('title')}>Create text story</h5>
                        </div>
                    </>
                )}

                {imagePreview && (
                    <div>
                        <h1 className={cx('header')}>Preview</h1>

                        <div className={cx('preview')}>
                            <div className={cx('image-wrap')} style={{ backgroundColor: backgroundColor }}>
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
                        <h1 className={cx('header')}>Preview</h1>

                        <div className={cx('preview')}>
                            <div className={cx('image-wrap')} style={{ backgroundColor: backgroundColor }}>
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
