import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';

function TodoList() {
    const { theme, todoList, setTodoList } = useContext(ThemeContext);
    return (
        <div className="pop-up">
            <div
                className={
                    'w-[50vw] p-3 pb-5 bg-white shadow-[2px_2px_5px_#888] rounded-[20px] text-[var(--text-color)] h-[600px] '
                }
            >
                <div className={'flex justify-between mb-1 '}>
                    <div className="h-10 w-10"></div>
                    <h1 className={'text-[32px] '}>Todo List</h1>
                    <div
                        className={'w-10 h-10 rounded-full cursor-pointer hover:bg-zinc-300 flex justify-center items-center'}
                        onClick={() => setTodoList(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </div>
                </div>

                <hr />

                <div className={'mt-2'}></div>
            </div>
        </div>
    );
}

export default TodoList;
