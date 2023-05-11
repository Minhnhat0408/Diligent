import classNames from 'classnames/bind'
import styles from './FlashCardPage.module.scss'
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
const cx = classNames.bind(styles)

function FlashCardPage() {
    const context = useContext(ThemeContext)
    return ( <div className={cx('wrapper',{dark: context.theme ===  'dark'})}>
        <div className={cx('user-decks')}>
            <div className={cx('deck')}>
                
            </div>
            <div className={cx('deck')}>

            </div>
            <div className={cx('deck')}>

            </div>
            <div className={cx('deck')}>

            </div>
            <div className={cx('deck')}>

            </div>
            <div className={cx('deck')}>

            </div>
            <div className={cx('deck')}>

            </div>
            <div className={cx('deck')}>

            </div>
            <div className={cx('deck')}>

            </div>
           
        </div>
        <div className={cx('all')}>
    
            <div className={cx('deck')}>
            </div>
            <div className={cx('deck')}>

</div>
<div className={cx('deck')}>

</div><div className={cx('deck')}>

</div><div className={cx('deck')}>

</div><div className={cx('deck')}>

</div><div className={cx('deck')}>

</div><div className={cx('deck')}>

</div><div className={cx('deck')}>

</div><div className={cx('deck')}>

</div><div className={cx('deck')}>

</div>

       


        </div>
         
    </div> );
}

export default FlashCardPage;       
