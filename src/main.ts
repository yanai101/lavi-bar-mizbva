import './style.scss';



import {  getGuests} from './firebase'
import { addMainForm } from './elements';

const app: any = document.getElementById('app');

const loadData = async()=>{
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

export const sendSMS = async (phoneNumber: string, message: string , sender = 'Lavi is 13') => {
  console.log('send sms', phoneNumber, message, sender);

  const url = 'https://my.textme.co.il/api';


  // <?xml version="1.0" encoding="UTF-8"?>
  //   <sms>
  //     <user>
  //       <username>Leeroy</username>
  //       <password>Jenkins</password>
  //     </user>
  //     <source>TextMe</source>
  //     <destinations>
  //       <cl_id>21518<cl_id>
  //       <cl_id>21500<cl_id>
  //       <phone id="external id1">5xxxxxxxx</phone>
  //       <phone id="external id2">5xxxxxxxx</phone>
  //       <phone>5xxxxxxxx</phone>
  //       <phone id="">5xxxxxxxx</phone>
  //     </destinations>
  //     <message>This is a sample message</message>
  //   </sms>

                

  const smsXml = `<?xml version='1.0' encoding='UTF-8'?>
                  <sms>
                    <user>
                      <username>yanai101@gmail.com</username>
                      <password>A:uyf7mW</password>
                    </user>
                    <source>${sender}</source>
                    <destinations>
                        <phone>${phoneNumber}</phone>
                    </destinations>
                      <message>${message}</message>
                  </sms>`

    try {
      const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/xml'
      },
      body: smsXml
    });
    if (result) {
      console.log('result', result);
    }
    
    } catch (error) {
      console.log(error)
    }              
    

};