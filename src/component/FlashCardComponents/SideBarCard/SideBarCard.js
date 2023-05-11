import { useState } from "react";
import classNames from "classnames/bind";
import styles from './SideBarCard.module.scss';
import FaceCard from "../FaceCard";
import NewCard from "../NewCard/NewCard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSpring,useSpringRef , animated } from "@react-spring/web";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);

function SideBarCard({listCard, handlePick, creatCard}) {

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
        {/* addCard */}
        <div className={cx('addCard')}>
            <div className={cx('boxSearch')}>
                <input type='text' className={cx('searchCard')} 
                // value={nameCard}
                // onChange={(e) => creatCard(e)}
                placeholder="dang khong hoat dong"
                />
            </div>

            <div className={cx('creatCard')} onClick={() => handleAdd()}>
            <FontAwesomeIcon icon={faSquarePlus} size="2xl" style={{color: "#4a628c",}} />
            </div>
            
        </div>


        {/* sideBar */}
        <div className={cx('sidebar')}>
            <animated.div style={addCard} className={cx('newCard')}>
                <NewCard creatCard={creatCard} handleAdd={handleAdd}/>
            </animated.div>

            <animated.div style={addCard} className={cx('boxSideBar')}>
            {listCard.map((item, index) => {
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