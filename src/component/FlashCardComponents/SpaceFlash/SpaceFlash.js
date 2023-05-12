import  {  useEffect, useState } from "react";
import classNames from "classnames/bind";

import CardFlip from "../CardFlip/";
import CricleProgress from "../CircleProgress/CircleProgress";
import styles from './SpaceFlash.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateBack, faArrowRotateLeft, faCheck, faFaceSadTear, faFaceSmile, faFaceSmileBeam, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSpring, useSpringRef,useTransition, animated } from "@react-spring/web";
const cx = classNames.bind(styles);

const color = ['red', 'blue', 'pink']

const file1 = [
    {id: 1 , title: "day la the so 1", back: "mat sau the so 1", pos: 0 },
    {id: 2 , title: "day la the so 2", back: "mat sau the so 2", pos: 0 },
    {id: 3 , title: "day la the so 3", back: "mat sau the so 3", pos: 0 },
    {id: 4 , title: "day la the so 4", back: "mat sau the so 4", pos: 0 },
    {id: 5 , title: "day la the so 5", back: "mat sau the so 5", pos: 0 },
    {id: 6 , title: "day la the so 6", back: "mat sau the so 6", pos: 0 },
    {id: 7 , title: "day la the so 7", back: "mat sau the so 7", pos: 0 },
    {id: 8 , title: "day la the so 8", back: "mat sau the so 8", pos: 0 },
]

const file2 = [
    {id: 1 , title: "day la the so 1.2", back: "mat sau the so 1", pos: 0 },
    {id: 2 , title: "day la the so 2.2", back: "mat sau the so 2", pos: 0 },
    {id: 3 , title: "day la the so 3.2", back: "mat sau the so 3", pos: 0 },
    
]


const SpaceFlash = ({idDeck}) => {

    const [fp0, setFp0] = useState([]);
    const [fp1, setFp1] = useState([]);
    const [fp2, setFp2] = useState([]);
    var [virPos, setVirPos] = useState(3);
    
    
    const handleRenenber = (a) => {
        if (fp0.length === 1 && virPos === 0 ) {
            return;
        }
        getSetEffect();
        
        fp0[fp0.length -1].pos = a;
        setFp0([...fp0]);
        var current = fp0.pop();
        virPos=0;
        if (a===1) {
            fp1.push(current);
            setFp1([...fp1])
        } else {
            fp2.push(current);
            setFp2([...fp2])
        }
        
        setVirPos(virPos);
    }
    
    const getOldPos0 = (titile) => {
        getSetEffect();
        getTurnBack(titile);
    }

    const getTurnBack = (titile) => {
        if(titile === fp1[fp1.length-1] || titile === fp0[fp0.length -1]) {
            fp1[fp1.length-1].pos = 0;
            setFp1([...fp1]);
            virPos=1;
            setVirPos(virPos);
        } else {
            fp2[fp2.length-1].pos = 0;
            setFp2([...fp2]);
            virPos=2;
            setVirPos(virPos);
        }
    }

    const getBack = () => {
        if (fp2.length + fp1.length === 1 ) {
            return;
        }
        getSetEffect();

        if(fp2.length === 0) {
            getTurnBack(fp1[fp1.length-1])
        } else if (fp1.length === 0) {
            getTurnBack(fp2[fp2.length-1])
        }

        if (fp1[fp1.length-1].id < fp2[fp2.length-1].id) {
            getTurnBack(fp1[fp1.length-1])
        } else {
            getTurnBack(fp2[fp2.length-1])
        }

    }

    const getSetEffect = () => {
        if (virPos === 0) {
            fp0.pop();
        }else if (virPos ===1) {
            var current = fp1.pop();
            fp0.push(current);
            setFp0([...fp0]);
        } else if (virPos == 2) {
            var current = fp2.pop();
            fp0.push(current);
            setFp0([...fp0]);
        } else {
            console.log('roong')
        }
    }

    const api = useSpringRef();
    const transition = useTransition(idDeck, {
        ref: api,
        keys:null,
        from: {opacity: 0, transform:'translate3d(210%,0,0)'},
        enter: {opacity: 1, transform:'translate3d(0,0,0)', 
            // backgroundColor: color[card] 
        },
        leave : {opacity: 0, transform:'translate3d(-50%,0,0)'}
    })

    useEffect(() => {
        api.start();
        setFp1([]);
        setFp2([]);
        setFp0(idDeck === 0 ? file1 : file2);
        setShowPer(false);
        console.log(file1);
        console.log(file2)

    }, [idDeck])

    const [showPer, setShowPer] = useState(false);
    const handlePull = () => {
        setShowPer(!showPer)
    }
    
    return (
        
        <>
        <div className={cx('container')}>
            <div className={cx('options')}>
                <button className={cx('finish')} onClick={() => handleRenenber(1)}><FontAwesomeIcon icon={faCheck}/></button>
                <button className={cx('skip')} onClick={() => handleRenenber(2)}><FontAwesomeIcon icon={faXmark}/></button>
                <button className={cx('back')} onClick={() => getBack()}><FontAwesomeIcon icon={faArrowRotateLeft}/></button>
            </div>

            {/* rightside */}
          <div className={cx('rightside')}> 
                <div className={cx('finishbox')}>
                    <div className={cx('text')}>
                        ĐÃ THUỘC
                    </div>
                    <div className={cx('shadowbox')}>
                        
                    </div>
                    <button className={cx('number')}>
                        {virPos === 1 ?   fp1.length -1 : fp1.length}
                    </button>
                </div>
                <div className={cx('skipbox')}>
                    <div className={cx('text')}>
                        QUÊN
                    </div>
                    <div className={cx('shadowbox')}>
                        
                    </div>
                    <button className={cx('number')}>
                        {virPos === 2 ?   fp2.length -1 : fp2.length}
                    </button>
                </div>
          </div>


            {transition((style, i) =>{ 
                {/* card */}
                return <animated.div style={style} className={cx('flash')}>
                {
                    fp0.map((item, index) => {
                        return (
                            <> 
                            <CardFlip key={item.id}  titile={item} getOldPos0={getOldPos0}/>
                            </> 
                        )  
                    })
                }
                {
                    fp1.map((item, index) => {
                        return (
                            <> 
                            <CardFlip key={item.id}  titile={item} getOldPos0={getOldPos0}/>
                            </> 
                        )  
                    })
                }
                {
                    fp2.map((item, index) => {
                        return (
                            <> 
                            <CardFlip key={item.id}  titile={item} getOldPos0={getOldPos0}/>
                            </> 
                        )  
                    })
                }

                <div className={cx('boxshowper')} >
                    {!showPer ? 
                    <div className={cx('showper')} onClick={() => handlePull()}>
                        hoan thanh
                    </div> 
                    :
                    <div className={cx('progresscontain')}>
                        <div className={cx('progressbox')}> 
                            <CricleProgress percentage={fp1.length / (fp1.length + fp2.length)*100}/>
                        </div>
                        <div className={cx('emotion')}>
                            {fp1.length/(fp1.length + fp2.length)*100 > 50 ?
                            <FontAwesomeIcon icon={faFaceSmile} style={{color: "#d4d049", height: '80px', width: '80px'}} />
                            :
                            <FontAwesomeIcon icon={faFaceSadTear} style={{color: "#d4d049", height: '80px', width: '80px'}} />
                            }
                        </div>  
                        <div className={cx('buttonhoc')}>
                            hoc tiep
                        </div>
                    </div>
                    }
                </div>

                </animated.div>
                
            })}

        


            
        </div>
        </>
    )
}

export default SpaceFlash;