import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';
import PropTypes from 'prop-types'
const cx = classNames.bind(styles);

// passProps la nhung props khac muon truyen vao khac props mac dinh
// truyen className vao de custom rieng nut tai noi ta muon custom nut nao do
// className = {cx('test')}
// 3 type of Button
// 1. noSize: medium
// 2. small
// 3. large
function Button({
  to,
  href,
  onClick,
  children,
  leftIcon,
  rightIcon,
  className = false,
  small = false,
  large = false,
  primary = false,
  outline = false,
  text = false,
  disabled = false,
  rounded = false,
  separate = false,
  dark = false,
  ...passProps
  
}) {
  let Comp = 'button';

  const props = {
    onClick,
    ...passProps,
  };

  if (to) {
    props.to = to;
    Comp = Link;
  } else if (href) {
    props.href = href;
    Comp = 'a';
  }

  const classes = cx('wrapper', {
    primary,
    outline,
    small,
    large,
    text,
    disabled,
    rounded,
    separate,
    dark,
    [className]: className,
  });

  return (
    <Comp className={classes} {...props}>
      {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
      {<span className={cx('title')}>{children}</span>}
      {rightIcon && <span className={cx('icon')}>{rightIcon}</span>}
    </Comp>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  to : PropTypes.string,
  href : PropTypes.string,
  onClick : PropTypes.func,
  leftIcon : PropTypes.node,
  rightIcon : PropTypes.node,
  className : PropTypes.string,
  small : PropTypes.bool,
  large : PropTypes.bool,
  primary : PropTypes.bool,
  outline : PropTypes.bool,
  text : PropTypes.bool,
  disabled : PropTypes.bool,
  rounded : PropTypes.bool,
  separate : PropTypes.bool,
}

export default Button;
