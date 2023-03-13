import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { forwardRef, useState } from 'react';
import styles from './FormInput.module.scss';

const cx = classNames.bind(styles);
const FormInput = forwardRef(({ password, invalid, icon, type, placeholder, msg }, ref) => {
  const [currentType,setCurrentType] = useState(type);
    const handleShowPassword = () => {
      const newType = currentType === 'text' ? 'password':'text';
      setCurrentType(newType)
    }
  return (
        <div className={cx('form__input', { invalid: invalid })}>
            <label htmlFor="email" className={cx('form-label')}>
                <FontAwesomeIcon icon={icon} />
            </label>
            <input ref={ref} type={currentType} placeholder={placeholder} className={cx('form-control')} />
            {password && (
                <div className={cx('eye')} onClick={handleShowPassword}>
                    <FontAwesomeIcon icon={faEye} />
                </div>
            )}
            <span className={cx('form-message')}>{msg}</span>
        </div>
    );
});

export default FormInput;
