import classNames from 'classnames/bind';
import image from '~/assets/images';
import styles from './Login.module.scss';
import Image from '~/component/Image';
import FlipCard from '~/component/FlipCard';
import { FormSignIn } from '~/component/Form';
import { FormSignUp } from '~/component/Form';
import { useState } from 'react';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';
import ToggleButton from '~/component/ToggleButton';
const cx = classNames.bind(styles);

function Login() {
    const [flip, setFlip] = useState(false);

    return (
        <div className={cx('wrapper')}>
            <Image src={image.loginImg} className={cx('image') + ' mdx-max:hidden'} alt="Education for life" />
            <div className={cx('login') + ' xl-max:px-10 mdx-max:w-full smu-max:!px-4 '}>
                <ToggleButton flip={flip} onClick={() => setFlip(!flip)}>
                    <span>SIGN IN </span>
                    <span>SIGN UP</span>
                </ToggleButton>
                <FlipCard flip={flip}>
                    <FormSignIn />
                    <FormSignUp classes={['form-back']} />
                </FlipCard>
            </div>
        </div>
    );
}

export default Login;
