import { useEffect, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';

import fireGem from '~/assets/images/fire-gem.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { UserAuth } from '~/contexts/authContext';
import { calculateDateStreaks } from '~/utils/getStreak';

// prettier-ignore
const h1Phrases = [
  'Amazing job!',
  'Way to go!',
  'Woohoo!',
  'Bravo!',
  'Keep it up!',
]

// prettier-ignore
const h2Sentences = [
  `You're on a fantastic streak!`,
  `You're on fire with your streak!`,
  `Your streak continues to impress!`,
  `You've maintained your streak!`,
]

const getRandomElement = (arr) => {
    if (!Array.isArray(arr)) return null;
    return arr?.at(Math.floor(Math.random() * arr.length));
};

export default function StreakModal({ display }) {
    const [showModal, setShowModal] = useState(false);
    const {userData} = UserAuth()
    useEffect(() => {
        if (display) {
            setShowModal(true);
        }
    }, [display]);

    useEffect(() => {
        if (!showModal) return;
        setTimeout(() => {
            const modal = document.getElementById('streak-modal');
            modal.style.visibility = 'visible';
            modal.style.opacity = 1;
        }, 100);
    }, [showModal]);
    const handleOnClose = () => {
        const modal = document.getElementById('streak-modal');
        modal.style.visibility = 'hidden';
        modal.style.opacity = 0;
        setTimeout(() => {
            setShowModal(false);
        }, 100);
    };
    return (
        <>
            {showModal ? (
                <div
                    id="streak-modal"
                    className="select-none"
                    style={{
                        transition: 'opacity 0.1s linear, visibility 0.1s linear',
                        visibility: 'none',
                        opacity: 0,
                        zIndex: 50,
                        position: 'fixed',
                    }}
                >
                    <div className="flex flex-col gap-5 items-center justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="flex flex-col" name={'Modal header'}>
                            <h1 className="text-center leading-loose text-5xl font-bold radient bg-clip-text text-transparent">
                                {getRandomElement(h1Phrases)}
                            </h1>
                            <h2 className="text-yellow-200 text-3xl">🔥 {getRandomElement(h2Sentences)} 🔥</h2>
                        </div>

                        <div className="w-fit h-fit">
                            <img src={fireGem} loading="lazy" />
                        </div>

                        <div className="flex flex-col gap-3 text-yellow-200 text-xl items-start">
                            <p>
                                Current Streak: <span className="font-bold text-3xl text-amber-500">{calculateDateStreaks(userData?.user_streak).currentStreak} days</span>
                            </p>
                            <p>
                                Longest Streak: <span className="font-bold text-2xl text-emerald-500">{calculateDateStreaks(userData?.user_streak).longestStreak} days</span>
                            </p>
                        </div>

                        <div className="my-8 flex justify-center w-full gap-40">
                            {/* <Link
                  to='/dashboard'
                  className='no-underline	min-w-32 text-yellow-100 bg-yellow-600 transition ease-in-out delay-150 hover:text-yellow-100 hover:-translate-y-1 hover:scale-110 hover:bg-amber-500 hover:border-none focus:outline-none focus:shadow-none font-medium rounded-full text-lg px-5 py-2.5 text-center'
                >
                  View dashboard
                </Link> */}

                            <button
                                className="flex items-center justify-center gap-1.5 w-32 text-red-100 bg-red-700 hover:bg-red-800 focus:outline-none focus:shadow-none focus:border-none font-medium rounded-full text-lg px-5 py-2.5 text-center hover:border-none hover:outline-none hover:shadow-none hover:border-none"
                                onClick={handleOnClose}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                                Close
                            </button>
                        </div>
                    </div>
                    <div id="modal-backdrop" className="opacity-90 fixed inset-0 z-40 bg-black"></div>
                </div>
            ) : null}

            {showModal && (
                <ConfettiExplosion
                    zIndex={100}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                    }}
                />
            )}
        </>
    );
}
