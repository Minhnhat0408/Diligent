import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import { Wrapper as PopperWrapper } from '~/component/Popper';
import MenuItem from './MenuItem';
import Header from './Header';
import { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from '~/contexts/Context';
import 'tippy.js/animations/scale.css';
const cx = classNames.bind(styles);

function Menu({ placement = 'bottom', offset,small = false, children, item = [], onClick = () =>{},onChange = () => {} }) {
    const [history, setHistory] = useState([{ data: item }]); // du lieu cua Menu cap hien tai
    const current = history[history.length - 1];
    const menu = useRef();
    const context = useContext(ThemeContext);
    useEffect(() => {
        setHistory([{ data: item }]);
    }, [item]);
    const renderItem = () => {
        return current.data.map((a, b) => {
            const isParent = !!a.children;
            return (
                <MenuItem
                    key={b}
                    data={a}
                    onClick={() => {
                        if (isParent) {
                            setHistory((prev) => [...prev, a.children]);
                        } else {
                            onChange(a);
                          
                        }
                        onClick(a);
                        console.log(history,a)
                    }}
                ></MenuItem>
            );
        });
    };

    const handleBackMenu = () => {
        setHistory(history.slice(0, history.length - 1));
    };

    const handleOutofHoverMenu = () => {
        setHistory((prev) => prev.slice(0, 1));
    };

    const renderResult = (attrs) => (
        <div tabIndex="-1" {...attrs} className={cx('menu-lists',{small:small})} ref={menu}>
            <PopperWrapper className={cx('menu-popper', { [context.theme]: context.theme === 'dark' })}>
                {history.length > 1 && <Header title={current.title} onBack={handleBackMenu} />}
                <div className={cx('menu-body')}>{renderItem()}</div>
            </PopperWrapper>
        </div>
    );
    return (
        <Tippy
            onHide={handleOutofHoverMenu}
            trigger='click'
            interactive
            offset={offset} // chinh ben trai / chieu cao so vs ban dau
            placement={placement}
            render={renderResult}
        >
            {children}
        </Tippy>
    );
}

Menu.propTypes = {
    children: PropTypes.node.isRequired,
    item: PropTypes.array,
    onChange: PropTypes.func,
};
export default Menu;
