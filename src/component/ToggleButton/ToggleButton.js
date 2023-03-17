import classNames from 'classnames/bind'
import { Children } from 'react';
import styles from './ToggleButton.module.scss'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(styles)

function ToggleButton({flip,children,...props}) {

  return (
    <div
      {...props}
      className={cx("btn-box")}
    >
      <div
        className={cx("btn", {
          slideleft: flip === true,
          slideright: flip === false,
        })}
      >
        <FontAwesomeIcon className={cx('icon')} icon={faArrowRight} />
      </div>
      <button className={cx("btn-choice","btn-left",{'flip' :flip})}>{children[0]}</button>
      <button className={cx("btn-choice",'btn-right',{'flip' :!flip})}>{children[1]}</button>
    </div>
  );
}   

export default ToggleButton;
