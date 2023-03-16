import {
    addDoc,
    collection,
    doc,
    getDocs,
    setDoc,
    serverTimestamp,
    query,
    where,
    getDoc,
    onSnapshot,
} from 'firebase/firestore';
import { db } from '~/firebase';
export const search = async (value) => {
    try {
     
        console.log(value)
        const q = query(
            collection(db, 'users'),
            where('user_name', '>=', value),
            where('user_name', '<=', value + '\uf8ff'),
        );

        const querySnapshot = await getDocs(q);
        console.log(querySnapshot)
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, ' => ', doc.data());
        });
    } catch (err){
        console.log(err)
    }
};
