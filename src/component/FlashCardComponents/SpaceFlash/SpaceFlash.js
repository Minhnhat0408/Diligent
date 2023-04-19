import  {  useState } from "react";
import classNames from "classnames/bind";

import CardFlip from "../CardFlip/";

import styles from './SpaceFlash.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);

const SpaceFlash = () => {

    const [file, setFile] =useState([
        {id: 1 , title: "day la the so 1", back: "mat sau the so 1", pos: 0 },
        {id: 2 , title: "day la the so 2", back: "mat sau the so 2", pos: 0 },
        {id: 3 , title: "day la the so 3", back: "mat sau the so 3", pos: 0 },
        {id: 4 , title: "day la the so 4", back: "mat sau the so 4", pos: 0 },
        {id: 5 , title: "day la the so 5", back: "mat sau the so 5", pos: 0 },
        {id: 6 , title: "day la the so 6", back: "mat sau the so 6", pos: 0 },
        {id: 7 , title: "day la the so 7", back: "mat sau the so 7", pos: 0 },
        {id: 8 , title: "day la the so 8", back: "mat sau the so 8", pos: 0 },
    ])

    
    const [fp0, setFp0] = useState([...file.reverse()]);
    const [fp1, setFp1] = useState([]);
    const [fp2, setFp2] = useState([]);
    var [virPos, setVirPos] = useState(3);
    
    const handleRenenber = (a) => {
        if (fp0.length === 1 ) {
            return;
        }
        if (virPos===0 ) {
            fp0.pop();
        } else if (virPos===1) {
            var current = fp1.pop();
            fp0.push(current);
            setFp0([...fp0]);
        }else if (virPos===2) {
            var current = fp2.pop();
            fp0.push(current);
            setFp0([...fp0]); 
        }else {
            console.log('roong')
        }
        
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
        if (virPos === 0) {
            fp0.pop();
        }else if (virPos ===1) {
            var current = fp1.pop();
            fp0.push(current);
            setFp0([...fp0]);
        } else {
            var current = fp2.pop();
            fp0.push(current);
            setFp0([...fp0]);
        }

        if(titile === fp1[fp1.length-1]) {
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
   
    return (
        
        <>
        <div className={cx('container')}>
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
             <div className={cx('options')}>
                <button className={cx('finish')} onClick={() => handleRenenber(1)}><FontAwesomeIcon icon={faCheck}/></button>
                <button className={cx('skip')} onClick={() => handleRenenber(2)}><FontAwesomeIcon icon={faXmark}/></button>
           </div>
          <div className={cx('rightside')}>
                <div className={cx('finishbox')}>
                    <div>
                        đã thuộc
                    </div>
                    <div className={cx('shadowbox')}>
                        
                    </div>
                    <button className={cx('number')}>
                        {virPos === 1 ?   fp1.length -1 : fp1.length}
                    </button>
                </div>
                <div className={cx('skipbox')}>
                    <div>
                        chưa thuộc
                    </div>
                    <div className={cx('shadowbox')}>
                        
                    </div>
                    <button className={cx('number')}>
                        {virPos === 2 ?   fp2.length -1 : fp2.length}
                    </button>
                </div>
          </div>
           
          
            
        </div>
        </>
    )
}

export default SpaceFlash;