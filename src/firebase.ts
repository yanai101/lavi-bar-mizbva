import {initializeApp} from 'firebase/app';
import {addDoc, collection, doc, getDocs, getFirestore, updateDoc} from 'firebase/firestore';

const DB_NAME = 'guest-list';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
};

initializeApp(firebaseConfig);

const db = getFirestore();

const colRef= collection(db, DB_NAME);

export const getGuests = async()=>{
  try {
    const data:any = [];
    const snapshots=  await getDocs(colRef);
    snapshots.forEach(doc=>{ data.push({...doc.data(), id:doc.id })});
    return data;
  } catch (error) {
    console.log('error', error)
  }
}


export const addGuest = async(data : any)=>{
  try{
  await addDoc(colRef, data);
  return true
  }catch(err){
    console.log(err);
  }
} 



// updating a document
export const updateFormDB = async(data: any, id: any) =>{
  try{
    let docRef = doc(db,DB_NAME, id)
    await updateDoc(docRef, data)
    return true;   
  } catch(err){
    console.log(err);
  }
}