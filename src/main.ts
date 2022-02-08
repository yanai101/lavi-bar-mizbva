import './style.scss';



import { addGuest, getGuests, updateFormDB} from './firebase'
import { addMainForm } from './elements';

const app = document.getElementById('app');
const addMeg= document.querySelector('.add-msg')

const loadData = async()=>{
  const data = await getGuests();
  console.log(data);
}
loadData()


// edit guest


const showAddMessage = (type) => {
  
  app.classList.add(type);
}



window.onload = () => {
  addMainForm(app);
}