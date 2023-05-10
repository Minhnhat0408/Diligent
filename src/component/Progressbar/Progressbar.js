import classNames from 'classnames/bind';
import styles from './Progressbar.module.scss';

const cx = classNames.bind(styles);

function Progressbar({ bgColor, completed }) {
    const containerStyles = {
        height: 2,
        width: '100%',
        backgroundColor: '#e0e0de',
        borderRadius: 50,
        marginRight: 4,
        zIndex: 999999,
    };

    const fillerStyles = {
        height: '100%',
        width: `${completed}%`,
        backgroundColor: bgColor,
        borderRadius: 'inherit',
        textAlign: 'right',
        zIndex: 9999,
    };

    return (
        <div style={containerStyles}>
            <div style={fillerStyles}></div>
        </div>
    );
}

export default Progressbar;
