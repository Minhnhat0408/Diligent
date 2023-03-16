import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { forwardRef, useState } from 'react';
import styles from './FormInput.module.scss';

const cx = classNames.bind(styles);
const FormInput = forwardRef(({ small,password, invalid,date, icon, type, placeholder, msg,onBlur }, ref) => {
  const [currentType,setCurrentType] = useState(type);
    const handleShowPassword = () => {
      const newType = currentType === 'text' ? 'password':'text';
      setCurrentType(newType)
    }
  return (
        <div className={cx('form__input', { invalid: invalid },{small:small})}>
            <label htmlFor="email" className={cx('form-label')}>
                <FontAwesomeIcon icon={icon} />
            </label>
            <input ref={ref} type={currentType} onBlur={onBlur} onFocus={() => {
              if(date) {
                setCurrentType('date')
              }
              
            }} placeholder={placeholder} className={cx('form-control')} />
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
