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

export const Item = ({ item, handleTodo, handleArchived, status }) => {
    const y = useMotionValue(0);
    const boxShadow = useRaisedShadow(y);
    const dragControls = useDragControls();
    const context = useContext(ThemeContext);
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
        }
    };
    const handleCheck = async () => {
        if (item.id) {
            await deleteDoc(doc(db, 'tasks', item.id));
        }
        if (status === 'todo') {
            handleTodo((prev) => {
                const newList = prev.filter((i) => i.order !== item.order);
                return newList;
            });
        } else {
            handleArchived((prev) => {
                const newList = prev.filter((i) => i.order !== item.order);
                return newList;
            });
        }
    };
    const handleDelete = async () => {
        if (status === 'todo') {
            handleTodo((prev) => {
                const newList = prev.filter((i) => i.order !== item.order);
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
            className="select-none touch-pan-x mb-4 rounded-lg  w-full px-4 py-5 relative bg-[var(--primary)] items-center flex"
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
                    className=" w-9 h-9 hover:bg-green-500 hover:text-[var(--primary)] cursor-pointer bg-transparent rounded-lg border-solid border-1  border-green-500 text-lg text-green-500 font-bold mr-4 "
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
                        className=" w-9 h-9 cursor-pointer  rounded-lg bg-blue-300 text-lg font-bold mr-4 "
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
                    className=" w-9 h-9 cursor-pointer  rounded-lg bg-red-400 text-lg font-bold mr-4 "
                    onClick={() => {
                        handleDelete();
                    }}
                >
                    <FontAwesomeIcon icon={faTrashCan} />
                </button>
            </Tippy>
            {status === 'todo' && (
                <Tippy content="Drag to move the task" delay={1000} theme={context.theme} animation={'scale'}>
                    <ReorderIcon dragControls={dragControls} />
                </Tippy>
            )}
        </Reorder.Item>
    );
};
