import classNames from "classnames/bind";
import styles from './Popper.module.scss';
import PropTypes from 'prop-types'

const cx = classNames.bind(styles);

// La 1 hop hover hien ra chung cho nhieu component
// dac tinh rieng do 'children' quyet dinh

function Wrapper({children, className}) {
    
    return ( 
        <div className={cx('wrapper', className)}>{children}</div>
     );
}


export default Wrapper;