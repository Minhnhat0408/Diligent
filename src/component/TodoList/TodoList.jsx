import { faInfoCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, Reorder, motion } from 'framer-motion';
import { useContext, useEffect, useRef, useState } from 'react';
import { ThemeContext } from '~/contexts/Context';
import './style.css';

import { Item } from './Item';
import Button from '../Button';
import {
    Timestamp,
    addDoc,
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore';
import { db } from '~/firebase';
import { UserAuth } from '~/contexts/authContext';

// const currentDate = new Date();

// // Set the time of the current date to 00:00:00
// currentDate.setHours(0, 0, 0, 0);
// ,where('time','>=',Timestamp.fromDate(currentDate)),where('time','<',Timestamp.fromDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)))
function TodoList() {
    const { theme, setTodoList } = useContext(ThemeContext);
    const [guide, setGuide] = useState(false);
    const [todo, setTodo] = useState([]);
    const td = useRef([]); // replica of todo for the unmount job
    const [archived, setArchived] = useState([]);
    const task = useRef();
    const { user } = UserAuth();
    useEffect(() => {
        if (user) {
            const fetchTasks = async () => {
                const q = query(
                    collection(db, 'tasks'),
                    where('user_id', '==', user.uid),
                    where('status', '==', 'todo'),
                    orderBy('order'),
                );
                const a = await getDocs(q);
                const q2 = query(
                    collection(db, 'tasks'),
                    where('user_id', '==', user.uid),
                    where('status', '==', 'archived'),
                    orderBy('time'),
                );
                const b = await getDocs(q2);
                const td = [];
                const ar = [];
                a.docs.forEach((d) => {
                    td.push({ id: d.id, title: d.data().title, order: d.data().order });
                });
                b.docs.forEach((d) => {
                    ar.push({ id: d.id, title: d.data().title, order: d.data().order });
                });
                setTodo(td);
                setArchived(ar);
            };
            fetchTasks();
            return () => {
                saveTasks();
            };
        }
    }, [user]);

    const saveTasks = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                td.current.forEach(async (t, ind) => {
                    if (t.id) {
                        await updateDoc(doc(db, 'tasks', t.id), {
                            order: ind + 1,
                        });
                    } else {
                        await addDoc(collection(db, 'tasks'), {
                            title: t.title,
                            order: ind + 1,
                            time: serverTimestamp(),
                            user_id: user.uid,
                            status: 'todo',
                        });
                    }
                });
                resolve('oke');
            } catch (err) {
                console.log(err);
                reject('no');
            }
        });
    };
    useEffect(() => {
        td.current = todo;
    }, [todo]);

    return (
        <div className="pop-up">
            <div
                className={
                    'w-[40vw] p-3 pb-5 flex flex-col items-center  bg-white shadow-[2px_2px_5px_#888] rounded-[20px] text-[var(--text-color)] max-h-[90vh] ' +
                    (theme === 'dark' ? ' !bg-[var(--dark-theme)] text-[var(--text-color-dark)] shadow-none' : '')
                }
            >
                <div className={'flex justify-between mb-1 w-full text-[var(--primary-light)] ' + (theme === 'dark' ? ' !text-[var(--primary)] ' : '')}>
                    <div
                        onClick={() => {
                            setGuide(!guide);
                        }}
                        className="h-10 w-10 text-2xl rounded-full cursor-pointer hover:bg-[#00000026] flex justify-center items-center"
                    >
                        <FontAwesomeIcon icon={faInfoCircle} />
                    </div>
                    <h1 className={'text-[32px] '}>Today's Todo-List</h1>
                    <div
                        className={
                            'w-10 h-10 rounded-full text-xl cursor-pointer hover:bg-[#00000026] flex justify-center items-center'
                        }
                        onClick={() => setTodoList(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </div>
                </div>

                <hr className="w-full" />

                <div className="flex items-center w-full mt-6 pr-2">
                    <input
                        className="text-xl py-2 px-4 rounded-xl w-full mr-6"
                        ref={task}
                        placeholder="🖼️ Add new task with icon here..."
                    />
                    <Button
                        onClick={() => {
                            if(task.current.value) {
                                setTodo((prev) => {
                                    return [...prev, { id: null, title: task.current.value, order: prev.length + 1 }];
                                });
                            }
                            
                        }}
                        primary
                        xl
                        className="text-xl rounded-xl"
                        dark={theme === 'dark'}
                    >
                        Add
                    </Button>
                </div>
                <AnimatePresence>
                    {guide && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'fit-content ', dur: 1000 }}
                            exit={{ opacity: 0, height: '0px', dur: 1000 }}
                        >
                            <div className="w-full p-3">
                                <p className="flex items-center">
                                    <div className="bg-green-300 w-4 h-4 rounded-sm mr-2"> </div> The red section is
                                    where the todo tasks (tasks that yet to be done in a day) is stored
                                </p>
                                <p className="flex items-center mb-2">
                                    <div className="bg-red-300 w-4 h-4 rounded-sm mr-2"> </div> The red section is where
                                    the archived tasks (tasks that can be done in a day) is stored  
                                </p>
                                <p className={"font-bold italic text-[var(--primary-light)] "+ (theme === 'dark' ? ' !text-[var(--primary)] ' : '')}> Everyday you will add task and check it in here.</p>
                                <p className={"font-bold italic text-[var(--primary-light)] " + (theme === 'dark' ? ' !text-[var(--primary)] ' : '')} > If you finish all todo tasks, that day will be a streak day.</p>
                                <p className="text-center ">-- Hover on the button for more detail --</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {todo?.length > 0 ? (
                    <Reorder.Group
                        axis="y"
                        layoutScroll
                        style={{ overflowY: 'scroll' }}
                        className={
                            'relative w-full order-box list-none font-bold text-[24px] mt-6  min-h-[200px]  bg-green-300 p-4 rounded-2xl ' +
                            (theme === 'dark' ? ' text-[var(--primary-light)] ' : '')
                        }
                        onReorder={setTodo}
                        values={todo}
                    >
                        <AnimatePresence>
                            {todo.map((item) => (
                                <Item
                                    key={item.order}
                                    item={item}
                                    status="todo"
                                    handleTodo={setTodo}
                                    handleArchived={setArchived}
                                />
                            ))}
                        </AnimatePresence>
                    </Reorder.Group>
                ) : (
                    <div className="w-full flex justify-center items-center  h-[300px] relative mt-6 font-bold text-[24px] text-black bg-green-300 p-4 rounded-2xl">
                        No today's tasks left
                    </div>
                )}
                {archived?.length > 0 && (
                    <Reorder.Group
                        axis="y"
                        layoutScroll
                        style={{ overflowY: 'scroll' }}
                        className={
                            'relative w-full order-box list-none font-bold text-[24px] mt-6 min-h-[200px]  bg-red-300 p-4 rounded-2xl  ' +
                            (theme === 'dark' ? ' text-[var(--primary-light)] ' : '')
                        }
                        onReorder={setArchived}
                        values={archived}
                    >
                        <AnimatePresence>
                            {archived.map((item) => (
                                <Item key={item.id} status="archived" item={item} handleArchived={setArchived} />
                            ))}
                        </AnimatePresence>
                    </Reorder.Group>
                )}
            </div>
        </div>
    );
}

export default TodoList;
