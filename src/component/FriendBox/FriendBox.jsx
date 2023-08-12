import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from '../Image';
import { faCircleCheck, faMale, faMars, faStar, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState } from 'react';
import { ThemeContext } from '~/contexts/Context';
import { useNavigate } from 'react-router-dom';
import routes from '~/config/routes';

import { GlobalProps } from '~/contexts/globalContext';

function FriendBox({ data, id }) {
    const context = useContext(ThemeContext);
    const navigate = useNavigate();
    const [disabled, setDisabled] = useState(() => {
        return data.friend === 1 ? 'Friend' : data.friend === -1 ? 'Accept' : data.friend === 2 ? 'Requesting' : 'Add';
    });
    const { handleAccept,handleAddfr } = GlobalProps();

    return (
        <div className=" rounded-2xl w-[22vw] min-w-[300px] mb-5 bg-[var(--dark-theme)] overflow-hidden text-[var(--text-color-dark)] flex flex-col">
            <div className="relative w-full h-[100px] ">
                <Image src={data?.user_bg || ''} alt="ava" className="absolute left-0 w-full h-full object-cover" />
                <Image
                    src={data?.user_avatar || ''}
                    alt="ava"
                    onClick={() => navigate(routes.user + id)}
                    className="absolute left-4 w-16 h-16 rounded-full cursor-pointer object-cover -bottom-12"
                />
            </div>
            <div className="pl-24 pr-4 py-2  text-sm flex flex-wrap items-center ">
                <div className="flex-1">
                    <div onClick={() => navigate(routes.user + id)} className="row cursor-pointer hover:underline">
                        <h3>{data.user_name}</h3>
                        <FontAwesomeIcon icon={faMars} className=" ml-2 text-[var(--primary)]" />
                    </div>
                    <p className="italic">{data.user_bio}</p>
                </div>
                <button
                    onClick={() => {
                        if (disabled === 'Add' ) {
                            console.log('helloo')
                            handleAddfr({id,setDisabled:setDisabled})
                        }else if(disabled === 'Accept') {
                            handleAccept({
                                id:id,
                                name:data.user_name,
                                ava:data.user_avatar
                            })
                        }
                    }}
                    className={
                        'h-8 w-[80px] rounded-lg bg-transparent border-[1px] ml-3 cursor-pointer hover:bg-[var(--primary-light)] border-solid border-[var(--primary)] text-[var(--primary)] ' +
                        ((data.friend === 1 || disabled === 'Requesting') && ' hover:bg-transparent opacity-75')
                    }
                >
                    {disabled !== 'Requesting' && <FontAwesomeIcon className="mr-2" icon={data.friend === 1 ? faCircleCheck : faUserFriends} />}
                    {disabled}
                </button>
            </div>
            <div className="flex px-4 pb-4   justify-between font-bold italic">
                <p className="">
                    Stars: {data.user_ratings.length}
                    <FontAwesomeIcon className="ml-1" icon={faStar} />
                </p>
                <p className="">{data.mutual} mutual friends</p>
            </div>
        </div>
    );
}

export default FriendBox;
