import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import Button from '~/component/Button';
import PropTypes from 'prop-types'
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const cx = classNames.bind(styles);

function MenuItem({ data,tick, onClick }) {
  const classes = cx('menu-item',
  {
    separate:data.separate
  })
  return (
    
    <Button leftIcon={data.icon} rightIcon={tick && <FontAwesomeIcon icon={faCheck}/>} to={data.to} className={classes} onClick={onClick}>
      {data.title}
    </Button>
  );
}

MenuItem.propTypes = {
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func
}
export default MenuItem;
