import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from './CircleProgress.module.scss';
import { useSpring, Spring , animated} from "@react-spring/web";
const cx = classNames.bind(styles);



const Number = ({n}) => {
    useEffect(() => {

    })
    const {number}  =useSpring({
        from:{number:0},
        number:n,
        delay:200,
        config:{mass:1,tension:20, friction:10},
    });
    return <animated.div>{number.to((n)=> n.toFixed(0))}</animated.div>
}   

const CricleProgress = ({percentage}) => {
    const percen = percentage.toFixed(0);
    const [value, setValue] = useState(565.2 + percen/100*565.2);


    useEffect(() => {
        setValue(565.2 + percen/100*565.2)
        
    },[percentage])
    return (
        <>
        <div className={cx('contain')}>
            <div className={cx('outer')}>
                <div className={cx('inner')}>
                    <div className={cx('percentage')}>
                        <Number n={percentage}></Number>
                        {/* <div className={cx('percentype')}>{'%'}</div> */}
                    </div>
                </div>
            </div>


            <svg width={200} height={200} className={cx('svg')} >
                <defs>
                    <linearGradient className={cx('linear')}>
                        <stop offset={0} stopColor="#05a"/>
                        <stop offset={100} stopColor="#05a"/>
                    </linearGradient>
                </defs>

                {/* <circle cx={100} cy={100} r={90} strokeLinecap="round"
                fill='none'
                stroke="red"
                className={cx('circlein')}
                /> */}
                
                <circle cx={100} cy={100} r={90} strokeLinecap="round"
                stroke="none"
                strokeDasharray={value}
                strokeDashoffset={value}
                className={cx('circle')}/>
                
            </svg>
        


        </div>
        </>
    )
}

export default CricleProgress;