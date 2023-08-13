import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import Button from '~/component/Button';
import { ThemeContext } from '~/contexts/Context';

function Guide({ setShowGuide }) {
    const context = useContext(ThemeContext);
    return (
        <div className="pop-up">
            <div
                className={
                    'bg-[var(--light-theme)] w-[30vw] flex flex-col rounded-[15px] items-center text-[var(--text-color)]' +
                    (context.theme === 'dark' ? ' !bg-[var(--dark-theme)] !text-[var(--text-color-dark)] ' : '')
                }
            >
                <div className="flex w-full justify-between p-2 border-b-[1px] border-[var(--text-color-dark)]">
                    <div className="w-10 h-10"></div>
                    <h1>How to use flashcard</h1>
                    <div
                        className="w-10 h-10 rounded-full flex justify-center items-center hover:cursor-pointer hover:bg-[#00000026]"
                        onClick={() => setShowGuide(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </div>
                </div>
                <hr className=" w-full" />
                <div className="flex flex-col py-4 pb-6 p-6">
                    <p className='text-xl font-bold pb-2 '> Controllers</p>
                    <p className='pb-2'> - Click on the card or (Spacebar keyboard) to reveal the back.</p>
                    <p className='pb-2'> - Click on the left side of the card or (⬅️ keyboard) when forgot.</p>
                    <p className='pb-2'> - Click on the right side of the card or (➡️ keyboard) when remember.</p>
                    <p className='pb-2'> - Click on the icon ↩️ or (Z keyboard) to undo.</p>
                    <p className='pb-2'> - Click save to save your progress.</p>
                    <p className='text-center text-xl text-red-400 italic'> Don't forget to save the progress before you leave .</p>
                    <p className='text-center mt-2 text-sm italic'> - Power by SRS algorithm -</p>
           

                </div>
                {/* <p className="text-2xl py-3">Delete this decks permanently ?</p>
                <div className="flex w-full justify-around pb-5">
                    <Button primary ml dark={context.theme === 'dark'} onClick={() => {
                        handleDelete(id)
                        navigate(routes.flashcard)
                    }} className="text-xl !w-24 " >Yes</Button>
                    <Button outline  ml  onClick={() => setShowGuide(false)}  dark={context.theme === 'dark'} className="text-xl !w-24 "> No</Button>
                </div> */}
            </div>
        </div>
    );
}

export default Guide;
