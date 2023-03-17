import { useState, forwardRef } from 'react';
import image from '~/assets/images';
import PropTypes from 'prop-types';
import styles from './Image.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);
const Image = forwardRef(({ src, alt, className, fallBack = image.noImage, ...props }, ref) => {
    // fallBack => link to customize error image
    const [_fallBack, setFallBack] = useState('');
    const classes = cx('wrapper', className);
    const handleError = () => {
        setFallBack(fallBack);
    };

    return <img {...props} className={classes} ref={ref} src={_fallBack || src} alt={alt} onError={handleError} />;
});

Image.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    className: PropTypes.string,
    fallback: PropTypes.string,
};
export default Image;
