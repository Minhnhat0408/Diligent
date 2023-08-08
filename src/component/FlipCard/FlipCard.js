import classNames from 'classnames/bind'
import styles from './FlipCard.module.scss'

const cx = classNames.bind(styles)

function FlipCard({flip = false,backColor = 'transparent',frontColor = 'transparent',backImg = '',frontImg ='',children,className = [],...props}) {

  return (

      <div  className={cx("container",...className)} {...props}>
        <div className={cx("card")}>
          <div
            className={cx("card-tp", "card-front", { cardfrontflip: flip })}
            style={{
              backgroundColor:frontColor,
              backgroundImage:`url(${frontImg})`,
            }}
          >
            {children[0]}
          </div>
          <div
            className={cx("card-tp", "card-back", { cardbackflip: !flip })}
            style={{
              backgroundColor:backColor,
              backgroundImage:`url(${backImg})`,
            }}
          >
            {children[1]}
          </div>
        </div>
      </div>

  );
}

export default FlipCard;
