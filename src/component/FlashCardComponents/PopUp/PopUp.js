import { useContext, useEffect, useRef, useState } from 'react';
import { ThemeContext } from '~/contexts/Context';
import classNames from 'classnames/bind';
import styles from './PopUp.module.scss';
import { RingLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from '~/component/Image/Image';
import Button from '~/component/Button/Button';
import {
    faCircle,
    faCircleXmark,
    faK,
    faMagnifyingGlass,
    faPlusCircle,
    faSpinner,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { UserAuth } from '~/contexts/authContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '~/firebase';
const cx = classNames.bind(styles);

function PopUp({ setPopup,update }) {
    const [loading, setLoading] = useState(false);
    const context = useContext(ThemeContext);
    const { userData,user } = UserAuth();
    const [invalid, setInvalid] = useState(false);
    const front = useRef();
    const back = useRef();
    const example = useRef();

    const handleAddCard = async () =>{
        if(front.current.value === '' || back.current.value === '' )
        {
            setInvalid(true)
        }else{
            setLoading(true)
            await addDoc(collection(db,'flashcards'),{
                front:front.current.value,
                back:{
                    content:back.current.value,
                    example:example.current.value
                },
            })
            setLoading(false);
            front.current.value =''
            back.current.value = ''
            setPopup(false);
        }
        
    }
    return (
        <>
            <div className={cx('pop-up')}>
                {loading && (
                        <div className="pop-up loader">
                            <RingLoader color="#367fd6" size={150} speedMultiplier={0.5} />
                        </div>
                    )}

                <div className={cx('create-box', { dark: context.theme === 'dark' })}>
                    <div className={cx('header')}>
                        <div></div>
                        <h1 className={cx('title')}>Add Deck</h1>
                        <div className={cx('out')} onClick={() => setPopup(false)}>
                            <FontAwesomeIcon icon={faXmark} />
                        </div>
                    </div>

                    <hr />

                    <div className={cx('body', { dark: context.theme === 'dark' })}>
                        <div className={cx('user-info')}>
                            <Image className={cx('avatar')} alt="ava" src={userData?.user_avatar} />

                            <h5 className={cx('username')}>{userData.user_name}</h5>
                        </div>
                        <textarea
                            placeholder={invalid ? 'This field is required' : 'Front content'}
                            ref={front}
                            defaultValue={ update && update.front}
                            onFocus={() => {
                                setInvalid(false);
                            }}
                            // onBlur={() => {
                            //     setTextFinal((prev) => {
                            //         return { ...prev, title: titleContent.current.value };
                            //     });
                            // }}
                            className={cx('input', 'inp-title', { invalid: invalid })}
                        />
                        <textarea
                            placeholder={invalid ? 'This field is required' : 'Back content'}
                            ref={back}
                            defaultValue={ update && update.back.content}
                            onFocus={() => {
                                setInvalid(false);
                            }}
                            // onBlur={() => {
                            //     setTextFinal((prev) => {
                            //         return { ...prev, title: titleContent.current.value };
                            //     });
                            // }}
                            className={cx('input','inp-title', { invalid: invalid })}
                          
                        />
                         <textarea
                            placeholder='Example'
                            ref={example}
                            defaultValue={ update && update.back.example}
                            onFocus={() => {
                                setInvalid(false);
                            }}
                            // onBlur={() => {
                            //     setTextFinal((prev) => {
                            //         return { ...prev, title: titleContent.current.value };
                            //     });
                            // }}
                            className={cx('input')}
                        />
                    </div>

                    <Button
                        primary
                        // disabled={
                        //     imagePreview.length === 0 && others.length === 0 && !titleContent.current?.value
                        // }
                        dark={context.theme === 'dark'}
                        onClick={handleAddCard}
                        className={cx('upload')}
                    >
                        Upload
                    </Button>
                </div>
            </div>
        </>
    );
}

export default PopUp;
