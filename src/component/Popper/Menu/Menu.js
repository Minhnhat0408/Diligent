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
import { memo } from 'react';
const cx = classNames.bind(styles);

function Menu({
    placement = 'bottom',
    disabled,
    offset,
    small = false,
    medium = false,
    children,
    item = [],
    onClick = () => {},
    onChange = () => {},
  }) {
    const [history, setHistory] = useState([{ data: item }]);
    const [isOpen, setIsOpen] = useState(false); // Added isOpen state
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
                setIsOpen(false); // Added to close the menu on selection
              }
              onClick(a);
              console.log(history, a);
            }}
          ></MenuItem>
        );
      });
    };
  
    const handleBackMenu = () => {
      setHistory(history.slice(0, history.length - 1));
      handleOutofHoverMenu();
    };
  
    const handleOutofHoverMenu = () => {
      setHistory((prev) => prev.slice(0, 1));
  
    };
  
    const renderResult = (attrs) => (
      <div
        tabIndex="-1"
        {...attrs}
        className={cx('menu-lists', { small: small , medium:medium})}
        ref={menu}
      >
        <PopperWrapper
          className={cx('menu-popper', {
            [context.theme]: context.theme === 'dark',
          })}
        >
          {history.length > 1 && (
            <Header title={current.title} onBack={handleBackMenu} />
          )}
          <div className={cx('menu-body')}>{renderItem()}</div>
        </PopperWrapper>
      </div>
    );
  
    return (
      <>
        <Tippy
          disabled={disabled}
          visible={isOpen} // Added to control the menu visibility
          onHide={handleOutofHoverMenu}
          onClickOutside={() => setIsOpen(false)} // Added to close the menu on outside click
          interactive
          offset={offset}
          placement={placement}
          render={renderResult}
        >
          <div onClick={() => setIsOpen(true)}>{children}</div>
        </Tippy>
      </>
    );
  }
  
Menu.propTypes = {
    children: PropTypes.node.isRequired,
    item: PropTypes.array,
    onChange: PropTypes.func,
};
export default memo(Menu);
