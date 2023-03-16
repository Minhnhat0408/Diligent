import classNames from 'classnames/bind';
import styles from './UpdateProfile.module.scss';
import { useRef } from 'react';
import {  useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { UserAuth } from '~/contexts/authContext';
import {
    faCalendar,
    faCommentDots,
    faPhone,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FormInput } from '~/component/Form';
import Button from '~/component/Button';
import { RingLoader } from 'react-spinners';
import validator from '~/utils/validator';
import { faAddressBook } from '@fortawesome/free-regular-svg-icons';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import routes from '~/config/routes';

const cx = classNames.bind(styles);

function UpdateProfile() {
    const defaultValidate = {
        fullname: false,
        dob: false,
        phone: false,
        address: false,
        bio: false,
        avatar: false,
    };
    const fullname= useRef();
    const dob = useRef();
    const phone = useRef();
    const address = useRef();
    const bio = useRef();
    const [validated, setValidated] = useState(defaultValidate);
    const [validatorMsg, setValidatorMsg] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState();
    const { updateProfile } = UserAuth();
    const navigate = useNavigate();
    const [gender, setGender] = useState('male');
    const handleAvatar = (e) => {
        const ava = e.target.files[0];
        setFile(ava);
    };
    const storage = getStorage();
    const metadata = {
        contentType: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'],
    };

    const validateAll = () => {
        console.log(fullname, dob, phone, address);
        const msg = validator.updateProfile({
            fullname: fullname.current.value,
            dob: dob.current.value,
            phone: phone.current.value,
            address: address.current.value,
            bio: bio.current.value,
            avatar: file,
        });
        setValidatorMsg(msg);
        Object.keys(msg).forEach((key) => {
            setValidated((preV) => {
                return { ...preV, [key]: true };
            });
        });
        return Object.keys(msg).length > 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidated(defaultValidate);
        if (!validateAll()) {
            if (!file) return;

            try {
                console.log(loading);
                setError('');
                setLoading(true);
                const storageRef = ref(storage, `images/${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file, metadata.contentType);
                await uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                            default:
                                break;
                        }
                    },
                    (error) => {
                        alert(error);
                    },
                    async () => {
                        await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            const data = {
                                dob: dob.current.value,
                                fullname: fullname.current.value,
                                gender: gender,
                                phone: phone.current.value,
                                address: address.current.value,
                                bio: bio.current.value,
                                avatar: downloadURL,
                            };
                            updateProfile(data).then(() => {
                                setLoading(false);
                                navigate(routes.home);
                            });
                        });
                    },
                );
            } catch (err) {
                console.log(err);
                setError(err.message.slice(10, -1));
            }
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div>
                <RingLoader
                    color="#367fd6"
                    style={
                        !loading
                            ? {
                                  display: 'none',
                              }
                            : {}
                    }
                    size={150}
                    speedMultiplier={0.5}
                />
            </div>

            <div
                className={cx('form')}
                style={loading ? {display: 'none'}: {}}
            >
                <h3 className={cx('heading')}>Account Information</h3>
                <p className={cx('desc')}>Please type the correct Information for best experience</p>
                {error && (
                    <div>
                        <span>{error}</span>
                    </div>
                )}
                <FormInput
                    invalid={validated.fullname}
                    ref={fullname}
                    icon={faUser}
                    name="fullname"
                    type="text"
                    placeholder="Full Name"
                    msg={!!validatorMsg.fullname ? validatorMsg.fullname : ''}
                />
                <div className={cx('row')}>
                    <div className={cx('dob')}>
                        <FormInput
                            invalid={validated.dob}
                            // onBlur={(e) => setDob(e.target.value)}
                            ref={dob}
                            icon={faCalendar}
                            name="dob"
                            type="text"
                            date
                            placeholder="Date of Birth"
                            msg={!!validatorMsg.dob ? validatorMsg.dob : ''}
                        />
                    </div>
                    <div className={cx('gender')}>
                        <input type="radio" id="male" checked={gender === 'male'} onChange={() => setGender('male')} />
                        <label htmlFor="male">Male</label>
                        <input
                            type="radio"
                            id="female"
                            checked={gender === 'female'}
                            onChange={() => setGender('female')}
                        />
                        <label htmlFor="female">Female</label>
                    </div>
                </div>
                <div className={cx('row')}>
                    <div className={cx('phone')}>
                        <FormInput
                            invalid={validated.phone}
                            ref={phone}
                            icon={faPhone}
                            name="phone"
                            type="text"
                            placeholder="Phone"
                            msg={!!validatorMsg.phone ? validatorMsg.phone : ''}
                        />
                    </div>

                    <div className={cx('avatar', { invalid: validatorMsg.avatar })}>
                        <input
                            type="file"
                            id="avatar"
                            onChange={handleAvatar}
                            className={cx('custom-file-input', { selected: file })}
                        />
                        <span className={cx('msg')}>{validatorMsg.avatar}</span>
                    </div>
                </div>

                <FormInput
                    invalid={validated.address}
                    ref={address}
                    icon={faAddressBook}
                    name="address"
                    type="text"
                    placeholder="Address"
                    msg={!!validatorMsg.address ? validatorMsg.address : ''}
                />
                <FormInput
                    invalid={validated.bio}
                    ref={bio}
                    icon={faCommentDots}
                    name="bio"
                    type="text"
                    placeholder="Bio"
                    msg={!!validatorMsg.bio ? validatorMsg.bio : ''}
                />
                <Button
                    primary
                    dark
                    large
                    onClick={(e) => {
                        return handleSubmit(e);
                    }}
                    className={cx('btn')}
                >
                    Sign up
                </Button>
            </div>
        </div>
    );
}

export default UpdateProfile;
