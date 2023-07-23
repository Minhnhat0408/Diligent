import classNames from 'classnames/bind'
import styles from './CommentLoading.module.scss'
const cx = classNames.bind(styles)

function CommentLoading() {
    return ( 
        <div className={cx('wrapper') + ' animate-pulse'}>
            <div>
                <div className={cx('ava')}></div>
            </div>
            <div >
                <div className={cx('name')}>

                </div>
                <div className={cx('content')}>

                </div>
                <div className={cx('row')}>
                    <div className={cx('btn')}>

                    </div>
                    <div className={cx('btn')}>
                        
                    </div>
                </div>
            </div>
        </div>
     );
}

export default CommentLoading;