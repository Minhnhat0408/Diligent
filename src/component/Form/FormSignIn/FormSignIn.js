import classNames from 'classnames/bind';
import styles from './FormSignIn.module.scss';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '~/contexts/authContext';
import { useRef } from 'react';
import validator from 'src/utils/validator';
import FormInput from '../FormInput';
import { faAt, faUnlockKeyhole } from '@fortawesome/free-solid-svg-icons';
import image from '~/assets/images';
import Image from '~/component/Image';
import Button from '~/component/Button';
import routes from '~/config/routes';
import RingLoader from 'react-spinners/RingLoader';
const cx = classNames.bind(styles);
function FormSignIn() {
    const defaultValidate = {
        email: false,
        password: false,
    };
    const form = useRef();
    const email = useRef();
    const password = useRef();

    const [validatorMsg, setValidatorMsg] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(defaultValidate);
    const { signIn, googleSignIn,facebookSignIn } = UserAuth();
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
            placeholder: 'Password',
            password,
            msg: !!validatorMsg.password ? validatorMsg.password : '',
        },
    ];
    const validateAll = () => {
        const msg = validator.signIn({ email: email.current.value, password: password.current.value });
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
        console.log(email.current.value);
        setValidated(defaultValidate);
        if (!validateAll()) {
            try {
                setError('');
                setLoading(true);
                await signIn(email.current.value.trimEnd(), password.current.value.trimEnd())
                navigate(routes.home)
                
            } catch (err) {
                console.log(err);
                setError(err.message.slice(10, -1));
            }
            setLoading(false);
        }
    };
    const handleFacebookSignIn = async (e) =>{
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            const acc = await facebookSignIn();
            if (acc) {
                console.log('successfull');
                navigate(routes.home);
            } else {
                navigate(routes.updateInfo);
            }
        } catch (err) {
            console.log(err);
            setError(err.message.slice(10, -1));
        }
        setLoading(false);
    }
    const handleGoogleSignIn = async (e) => {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            const acc = await googleSignIn();
            if (acc) {
                console.log('successfull');
                navigate(routes.home);
            } else {
                navigate(routes.updateInfo);
            }
        } catch (err) {
            console.log(err);
            setError(err.message.slice(10, -1));
        }
        setLoading(false);
    };
    return (
        <>
            {loading ? (
                <div className='h-[70vh] flex justify-center items-center ' >
                    <RingLoader color="#367fd6" size={150} speedMultiplier={0.5} />
                </div>
            ) : (
                <form ref={form} className={cx('form') + ' xl-max:w-90% lgs-max:py-3'}>
                    <h2 className={cx('heading')}>Sign in</h2>
                    <p className={cx('desc')}>Your next generation of education</p>
                    {/* css this error */}
                    {error && (
                        <div className={cx('error')}>
                            <span>{error}</span>
                        </div>
                    )}
                    {inputs.map((input, id) => {
                        return <FormInput invalid={validated[input.name]} key={id} {...input} />;
                    })}
                    <div className={cx('gg-btn')}>
                        <span className={cx('gg-signup')}>Or sign in with </span>
                        <Image
                            onClick={handleGoogleSignIn}
                            src={image.google}
                            alt="Google sign in"
                            className={cx('gg-icon')}
                        />
                        <Image
                            onClick={handleFacebookSignIn}
                            src={image.facebook}
                            alt="Facebook sign in"
                            className={cx('gg-icon')}
                        />
                    </div>
                    <Button
                        primary
                        dark
                        large
                        submit='submit'
                        onClick={(e) => {
                            console.log(loading);
                            return !loading && handleSubmit(e);
                        }}
                    >
                        Sign in
                    </Button>
                </form>
            )}
        </>
    );
}

export default FormSignIn;
