import classNames from 'classnames/bind';
import styles from './UpdateProfile.module.scss';
import { useContext, useRef } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '~/contexts/authContext';
import { faCalendar, faCommentDots, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { FormInput } from '~/component/Form';
import Button from '~/component/Button';
import { RingLoader } from 'react-spinners';
import validator from '~/utils/validator';
import { faAddressBook } from '@fortawesome/free-regular-svg-icons';
import routes from '~/config/routes';
import { ThemeContext } from '~/contexts/Context';

const cx = classNames.bind(styles);

function UpdateProfile() {
    const { userData, user, fileUpload } = UserAuth();

    const defaultValidate = {
        fullname: false,
        dob: false,
        phone: false,
        address: false,
        bio: false,
        avatar: false,
    };

    const fullname = useRef();
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
    const context = useContext(ThemeContext);
    const handleAvatar = (e) => {
        const ava = e.target.files[0];
        ava.preview = URL.createObjectURL(ava);
        console.log(ava);
        setFile(ava);
    };

    const validateAll = () => {
        console.log(fullname, dob, phone, address);
        const dataNeedValid = {
            fullname: fullname.current.value,
            dob: dob.current.value,
            phone: phone.current.value,
            address: address.current.value,
            bio: bio.current.value,
            avatar: file,
        };
        let msg = null;
        if (window.location.pathname === routes.userUpdate) {
            msg = validator.updateUserProfile(dataNeedValid);
        } else {
            msg = validator.updateProfile(dataNeedValid);
        }

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
            let data = {
                dob: dob.current.value || userData.user_dob,
                fullname: fullname.current.value || userData.user_name,
                gender: gender || userData.user_gender,
                phone: phone.current.value || userData.user_phone,
                address: address.current.value || userData.user_address,
                bio: bio.current.value || userData.user_bio,
                avatar: userData?.user_avatar,
            };
            try {
                setError('');
                setLoading(true);

                if (file) {
                    const newNameFile = `${user.uid}_avatar` + file.name.substring(0, file.name.indexOf('.'));
                    const url = fileUpload(file, newNameFile);
                    data.avatar = url;
                    updateProfile(data).then(() => {
                        setLoading(false);
                        navigate(routes.home);
                    });
                } else {
                    updateProfile(data).then(() => {
                        setLoading(false);
                        navigate(routes.home);
                    });
                }
            } catch (err) {
                console.log(err);
                setError(err.message.slice(10, -1));
            }
        }
    };

    return (
        <div
            className={cx(
                'wrapper',
                { user: window.location.pathname === routes.userUpdate && userData },
                { dark: context.theme === 'dark' },
            )}
        >
            <div className={cx('loading')} style={!loading ? { display: 'none' } : {}}>
                <RingLoader color="#367fd6" size={150} speedMultiplier={0.5} />
            </div>

            <div className={cx('form')} style={loading ? { display: 'none' } : {}}>
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
                        <label className={cx('ava-btn')} htmlFor="bg">
                            Avatar
                        </label>
                        <input onChange={handleAvatar} type="file" id="bg" className={cx('d-none')} />
                        <span className={cx('msg')}>{validatorMsg.avatar}</span>
                    </div>
                    {file?.preview && (
                        <img className={cx('prev', { invalid: validatorMsg.avatar })} alt="ava" src={file.preview} />
                    )}
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
                    Submit
                </Button>
            </div>
        </div>
    );
}

export default UpdateProfile;
