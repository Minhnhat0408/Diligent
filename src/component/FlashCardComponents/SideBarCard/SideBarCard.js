import { useState } from "react";
import classNames from "classnames/bind";
import styles from './SideBarCard.module.scss';
import FaceCard from "../FaceCard";
import NewCard from "../NewCard/NewCard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSpring,useSpringRef , animated } from "@react-spring/web";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);

function SideBarCard({listDeck, handlePick, creatDeck}) {

    const apiAddCard = useSpringRef();
    const addCard = useSpring({
        ref:apiAddCard,
        from: {y:-190},
    })

    const handleAdd = () => {
        apiAddCard.start({
           to: {y:addCard.y.get() === 0 ? -190 : 0}, 
        })
    }
    
    const handlePicks = (item) => {
        handlePick(item);
    }

    return (
        <>
    


        {/* sideBar */}
        <div className={cx('sidebar')}>
            {/* <animated.div style={addCard} className={cx('newCard')}>
                <NewCard creatDeck={creatDeck} handleAdd={handleAdd}/>
            </animated.div> */}

            <animated.div style={addCard} className={cx('boxSideBar')}>
            {listDeck.map((item, index) => {
                return (
                    <div className={cx('boxcard')} onClick={() => handlePicks(item)}>
                        <FaceCard key={index} child={item.name}  />
                    </div> 
                )
            })}
            <div className={cx('footer')}></div>
            </animated.div>
            
        </div>
        </>
    )
}

export default SideBarCard;