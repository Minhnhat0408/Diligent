import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '~/component/Button';
import routes from '~/config/routes';
import { ThemeContext } from '~/contexts/Context';

function Warning({ setShowWarning,handleDelete,id }) {
    const context = useContext(ThemeContext);
    const navigate = useNavigate()
    return (
        <div className="pop-up">
            <div
                className={
                    'bg-[var(--light-theme)] w-[30vw] flex flex-col rounded-[15px] items-center text-[var(--primary-light)]' +
                    (context.theme === 'dark' ? ' !bg-[var(--dark-theme)] !text-[var(--primary)] ' : '')
                }
            >
                <div className="flex w-full justify-between p-2 border-b-[1px] border-[var(--text-color-dark)]">
                    <div className="w-10 h-10"></div>
                    <h1>Warning</h1>
                    <div
                        className="w-10 h-10 rounded-full flex justify-center items-center hover:cursor-pointer hover:bg-[#00000026]"
                        onClick={() => setShowWarning(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </div>
                </div>
                <hr className=" w-full" />
                <p className="text-2xl py-3">Delete this decks permanently ?</p>
                <div className="flex w-full justify-around pb-5">
                    <Button primary ml dark={context.theme === 'dark'} onClick={() => {
                        handleDelete(id)
                        navigate(routes.flashcard)
                    }} className="text-xl !w-24 " >Yes</Button>
                    <Button outline  ml  onClick={() => setShowWarning(false)}  dark={context.theme === 'dark'} className="text-xl !w-24 "> No</Button>
                </div>

            </div>
        </div>  
    );
}

export default Warning;
