import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import { Wrapper as PopperWrapper } from '~/component/Popper';
import MenuItem from './MenuItem';
import Header from './Header';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
const cx = classNames.bind(styles);

function Menu({ children, item = [], onChange = () => {} }) {
    const [history, setHistory] = useState([{ data: item }]); // du lieu cua Menu cap hien tai
    const current = history[history.length - 1];
    const menu = useRef();

    useEffect(()=> {
        setHistory([{data:item}])
        console.log('reloading item')
    },[item])
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
        <div tabIndex="-1" {...attrs} className={cx('menu-lists')} ref={menu}>
            <PopperWrapper className={cx('menu-popper')}>
                {history.length > 1 && <Header title={current.title} onBack={handleBackMenu} />}
                <div className={cx('menu-body')}>{renderItem()}</div>
            </PopperWrapper>
        </div>
    );
    return (
        <Tippy
            onHide={handleOutofHoverMenu}
            // onHide={() => alert('hidden')}
            hideOnClick={false}
            interactive
            delay={[0, 600]}
            offset={[16, 30]} // chinh ben trai / chieu cao so vs ban dau
            placement="bottom-end"
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
