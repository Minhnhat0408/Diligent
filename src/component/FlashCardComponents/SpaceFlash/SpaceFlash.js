import  {  useState } from "react";
import classNames from "classnames/bind";

import CardFlip from "../CardFlip/";

import styles from './SpaceFlash.module.scss';
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
    var [virPos, setVirPos] = useState([]);
    
    const handleRenenber = (a) => {
        if (fp0.length === 0 ) {
            return;
        }
        if (virPos.length === 0 ) {
            console.log('roong')
        } else {
            fp0.pop();
            
        }

        fp0[fp0.length -1].pos = a;
        setFp0([...fp0]);
        virPos = fp0.pop();
        fp1.push(virPos);
        setFp1([...fp1])
        setVirPos(virPos);
       
    }

    const getOldPos0 = (titile) => {
        if (titile === virPos) {
          fp0[fp0.length -1].pos = 0;
          setFp0([...fp0]); 
          virPos = [];
          setVirPos(virPos);
        } else {




        }
    }
   
    return (
        
        <>
        <div className={cx('container')}>
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
                fp0.map((item, index) => {
                    return (
                        <> 
                        <CardFlip key={item.id}  titile={item} getOldPos0={getOldPos0}/>
                        </> 
                    )  
                })
            }
            <button className={cx('renember')} onClick={() => handleRenenber(1)}>clicl moveon</button>
            <button className={cx('wakaranai')} onClick={() => handleRenenber(2)}>clicl moveunder</button>
            
        </div>
        </>
    )
}

export default SpaceFlash;