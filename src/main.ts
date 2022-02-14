import './style.scss';



import { getGuests } from './firebase'
import { addMainForm } from './elements';

const app: any = document.getElementById('app');

const loadData = async () => {
  const data = await getGuests();
  console.log(data);
}
loadData()


// edit guest

window.onload = () => {
  addMainForm(app);
  // setTimeout(() => {
  //   sendSMS('0506989894', 'היי יערית אהובתי מתי נעשה 🥰')
  // }, 1000); 
}

