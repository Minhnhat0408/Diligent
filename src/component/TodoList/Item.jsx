import { useMotionValue, Reorder, useDragControls } from 'framer-motion';
import { ReorderIcon } from './ReorderIcon';
import { useRaisedShadow } from '~/hooks/useRaisedBoxShadow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faCheck, faPenAlt, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '~/firebase';
import { UserAuth } from '~/contexts/authContext';
import { formattedDate } from '~/utils/getStreak';
import toast from 'react-hot-toast';

export const Item = ({ item, handleTodo, setStreak, handleArchived, status }) => {
    const y = useMotionValue(0);
    const boxShadow = useRaisedShadow(y);
    const dragControls = useDragControls();
    const context = useContext(ThemeContext);
    const { user, userData } = UserAuth();
    const handleSetArchived = async () => {
        if (item.id) {
            await updateDoc(doc(db, 'tasks', item.id), {
                status: 'archived',
            });
            handleArchived((prev) => {
                return [...prev, item];
            });
            handleTodo((prev) => {
                const newList = prev.filter((i) => i.order !== item.order);
                return newList;
            });
        }else{
            // toast('Click out to save the list first')
            toast('Click out to save the list before archive', {
                icon: '⚠️',
                style: {
                    minWidth: '250px',
                    minHeight: '60px',
                    fontSize: '20px',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-light) ',
                    
                },
            });
        }
    };
    const handleCheck = async () => {
       
        if (status === 'todo') {
            handleTodo((prev) => {
                const newList = [];
                let c = 1;
                prev.forEach((t) => {
                    if(t.order !== item.order)
                    {   
                        t.order = c
                        newList.push(t)
                        c++
                    }
                })
                if (newList.length === 0) {
                    handleAddStreak();
                    setStreak(true);
                }

                return newList;
            });
        } else {
            handleArchived((prev) => {
                const newList = prev.filter((i) => i.order !== item.order);
                return newList;
            });
        }
        if (item.id) {
            await deleteDoc(doc(db, 'tasks', item.id));
        }
    };
    const handleAddStreak = async () => {
        const newStreak = userData?.user_streak ? [...userData.user_streak, formattedDate()] : [formattedDate()];
        await updateDoc(doc(db, 'users', user.uid), {
            user_streak: newStreak,
        });
    };
    const handleDelete = async () => {
        if (status === 'todo') {
            handleTodo((prev) => {
                const newList = [];
                let c = 1;
                prev.forEach((t) => {
                    if(t.order !== item.order)
                    {   
                        t.order = c
                        newList.push(t)
                        c++
                    }
                })
                return newList;
            });

            if (item.id) {
                await deleteDoc(doc(db, 'tasks', item.id));
            }
        } else {
            handleArchived((prev) => {
                const newList = prev.filter((i) => i.id !== item.id);
                return newList;
            });

            if (item.id) {
                await deleteDoc(doc(db, 'tasks', item.id));
            }
        }
    };
    return (
        <Reorder.Item
            className="select-none touch-pan-x mb-4 rounded-lg text-lg w-full px-4 py-3 relative bg-[var(--primary)] items-center flex"
            value={item}
            id={status === 'todo' ? item.order : item.id}
            style={{ boxShadow, y }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            dragListener={false}
            dragControls={dragControls}
        >
            <span className="flex-1">{item.title}</span>
            <Tippy content="Check to finish the task" delay={1000} theme={context.theme} animation={'scale'}>
                <button
                    className=" w-9 h-9 hover:bg-green-500 hover:text-[var(--primary)] cursor-pointer bg-transparent rounded-lg border-solid border-1  border-green-500 text-base text-green-500 font-bold mr-4 "
                    onClick={() => {
                        handleCheck();
                    }}
                >
                    <FontAwesomeIcon icon={faCheck} />
                </button>
            </Tippy>
            {status === 'todo' && (
                <Tippy content="Archive this task to other day" delay={1000} theme={context.theme} animation={'scale'}>
                    <button
                        className=" w-9 h-9 cursor-pointer  rounded-lg bg-blue-300 text-base font-bold mr-4 "
                        onClick={() => {
                            handleSetArchived();
                        }}
                    >
                        <FontAwesomeIcon icon={faArchive} />
                    </button>
                </Tippy>
            )}
            <Tippy content="Delete this task" delay={1000} theme={context.theme} animation={'scale'}>
                <button
                    className=" w-9 h-9 cursor-pointer  rounded-lg bg-red-400 text-base font-bold mr-4 "
                    onClick={() => {
                        handleDelete();
                    }}
                >
                    <FontAwesomeIcon icon={faTrashCan} />
                </button>
            </Tippy>
            {status === 'todo' && <ReorderIcon dragControls={dragControls} />}
        </Reorder.Item>
    );
};
