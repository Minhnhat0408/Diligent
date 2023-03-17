import classNames from 'classnames/bind'
import styles from './FlipCard.module.scss'

const cx = classNames.bind(styles)

function FlipCard({flip = false,children}) {

  return (

      <div  className={cx("container")}>
        <div className={cx("card")}>
          <div
            className={cx("card-tp", "card-front", { cardfrontflip: flip })}
          >
            {children[0]}
          </div>
          <div
            className={cx("card-tp", "card-back", { cardbackflip: !flip })}
          >
            {children[1]}
          </div>
        </div>
      </div>

  );
}

export default FlipCard;
