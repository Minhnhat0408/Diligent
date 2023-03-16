import { faGooglePlus } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './FormSignUp.module.scss';
import { useRef } from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '~/contexts/authContext';
import { faAt, faUnlock, faUnlockKeyhole } from '@fortawesome/free-solid-svg-icons';
import FormInput from '../FormInput';
import Button from '~/component/Button';
import Image from '~/component/Image';
import image from '~/assets/images';
import validator from '~/utils/validator';
import routes from '~/config/routes';
const cx = classNames.bind(styles);

function FormSignUp({ classes = [] }) {
    const defaultValidate = {
        email: false,
        password: false,
        confirmPass:false,
    };
    const email = useRef();
    const password = useRef();
    const confirmPass = useRef();
    const [validated, setValidated] = useState(defaultValidate);
    const [validatorMsg, setValidatorMsg] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { createUser, googleSignIn } = UserAuth();
    const navigate = useNavigate();
    const inputs = [
        {
            ref: email,
            icon: faAt,
            name: 'email',
            type: 'text',
            placeholder: 'Email',
            msg: !!validatorMsg.email ? validatorMsg.email : '',
        },
        {
            ref: password,
            icon: faUnlockKeyhole,
            name: 'password',
            type: 'password',
            password,
            placeholder: 'Password',
            msg: !!validatorMsg.password ? validatorMsg.password : '',
        },
        {
            ref: confirmPass,
            icon: faUnlock,
            name: 'confirmPass',
            type: 'password',
            password,
            placeholder: 'Password Confirmation',
            msg: !!validatorMsg.confirmPass ? validatorMsg.confirmPass : '',
        },
    ];
    const validateAll = () => {
        const msg = validator.signUp({ email: email.current.value, password: password.current.value,confirmPass: confirmPass.current.value });
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
        if(!validateAll()){
            try {
                setError('');
                setLoading(true);
                await createUser(email.current.value, password.current.value, confirmPass.current.value)
                .then(() => {
                    console.log('successfull');
                    
                    navigate(routes.updateInfo);
                });
            } catch (err) {
                console.log(err);
                setError(err.message.slice(10, -1));
            }
            setLoading(false);
        }
        
    };
    const handleGoogleSignUp = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await googleSignIn().then(() => {
                console.log('successfull');
                navigate(routes.home);
            });
        } catch (err) {
            console.log(err);
            setError(err.message.slice(10, -1));
        }
        setLoading(false);
    };
    return (
        <div className={cx('form', ...classes)}>
            <h3 className={cx('heading')}>Sign up</h3>
            <p className={cx('desc')}>Sign up to improve your learning journey</p>
            {error && <div><span>{error}</span></div>}
            {inputs.map((input, id) => {
                return <FormInput invalid={validated[input.name]} key={id} {...input} />;
            })}

            <div className={cx('gg-btn')}>
                <span className={cx('gg-signup')}>Or sign up with google account ?</span>
                <Image onClick={handleGoogleSignUp} src={image.google} alt="Google sign in" className={cx('gg-icon')} />
            </div>
            <Button
                primary
                dark
                large
                onClick={(e) => {
                    console.log(loading);
                    return !loading && handleSubmit(e);
                }}
            >
                Sign up
            </Button>
        </div>
    );
}

export default FormSignUp;
