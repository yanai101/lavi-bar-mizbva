import { addGuest, getGuests, updateFormDB } from "./firebase";
import JSConfetti from 'js-confetti'

const jsConfetti = new JSConfetti();


export const addMainForm = (app: HTMLDivElement)=>{
  const html = ` <form id="guestForm" class="box add-form animate__animated animate__backInDown">
  <div class="field">
    <label class="label">שם פרטי</label>
    <div class="control">
      <input class="input is-link" type="text" id="name" required name="name" placeholder="שם פרטי" />
    </div>
  </div>
  <div class="field">
    <label class="label">שם משפחה</label>
    <div class="control">
      <input class="input is-link" type="text" id="lastName" required name="lastname" placeholder="שם משפחה" />
    </div>
  </div>
  <div class="field">
    <label class="label">טלפון</label>
    <div class="control">
    <input class="input is-link"  type="number" id="phone" inputmode="numeric" required name="phone" placeholder="טלפון" />
    </div>
    </div>
    <div class="field">
    <label class="label">מספר אורחים</label>
    <div class="control">
      <span id="addG" class="button is-link is-light">+</span>
        <input class="input is-link" inputmode="numeric" type="number" id="guests" min="0" required name="guestNumber" placeholder="מספר אורחים" />
      <span id="removeG" class="button is-link is-light" >-</span>
    </div>
  </div>
  <div class="field">
    <label class="label">רוצים לכתוב ברכה ללביא?</label>
    <div class="control">
      <textarea class="textarea is-link" id="note" name="note"
      rows="5" cols="33">
      </textarea>
    </div>
  </div>
  <div class="field">
    <div class="control">
      <button class="button is-link" type="submit">איזה כיף אנחנו באים 🎉</button>
    </div>
  </div>
</form>`

app.insertAdjacentHTML('beforeend', html);
const form = document.getElementById('guestForm');
addBtnListeners();

form?.addEventListener('submit', async(e) => {
  e.preventDefault();
  const data = {
    name: form.name.value,
    lastName: form.lastName.value,
    phone: form.phone.value,
    note: form.note.value,
    guests: form.guests.value,
  }
  const isInList= await checkGuest(data);
  if(!isInList){
    const result = await addGuest(data);
    if(result){
      form.classList.add('animate__fadeOutDown');
      setTimeout(()=>{
        app.removeChild(form);
        addMessage(app)
      },500)
    }
  } else{
    form.classList.add('animate__fadeOutDown');
    setTimeout(()=>{
      addEditForm(app, isInList)
    },500)
  }
  removeBtnListeners();
});


}


const addEditForm = (app: HTMLDivElement , inListData)=>{
  const html = ` <form id="inListForm" class="box in-list-form animate__animated">
  <h3>נראה שכבר נרשמת ... רוצה לעדכן ? </h3>
  <input class="input" type="hidden" id="hiddenId">
  <div class="field">
    <label class="label">שם פרטי</label>
    <div class="control">
      <input class="input is-success" type="text" id="name" required name="name" placeholder="שם פרטי" />
    </div>
  </div>
  <div class="field">
    <label class="label">שם משפחה</label>
    <div class="control">
      <input class="input is-success" type="text" id="lastName" required name="lastname" placeholder="שם משפחה" />
    </div>
  </div>
  <div class="field">
    <label class="label">טלפון</label>
    <div class="control">
      <input class="input is-success" type="number" id="phone" inputmode="numeric" required name="phone" placeholder="טלפון" />
    </div>
  </div>
  <div class="field">
    <label class="label">מספר אורחים</label>
    <div class="control">
      <span id="addG" class="button is-success is-light">+</span>
        <input class="input is-success" inputmode="numeric" type="number" id="guests" min="0" required name="guestNumber" placeholder="מספר אורחים" />
      <span id="removeG" class="button is-success is-light" >-</span>
    </div>
  </div>
  <div class="field">
    <label class="label">רוצים לכתוב ברכה ללביא?</label>
    <div class="control">
      <textarea class="textarea is-success" id="note" name="note"
      rows="5" cols="33">
      </textarea>
    </div>
  </div>
  <div class="field">
    <div class="control">
      <button class="button  is-success" type="submit">איזה כיף ! עידכנו! 🎉</button>
    </div>
  </div>
</form>`

app.insertAdjacentHTML('afterbegin', html);

addBtnListeners();

const inListForm = document.getElementById('inListForm');
  if(inListData){
    inListForm.name.value = inListData.name;
    inListForm.lastName.value = inListData.lastName;
    inListForm.phone.value = inListData.phone;
    inListForm.note.value = inListData.note;
    inListForm.guests.value = inListData.guests;
    inListForm.hiddenId.value = inListData.id;
  }
  inListForm?.classList.add('animate__backInUp');
  inListForm?.addEventListener('submit', async(e) => {
    e.preventDefault();
    const data = {
      name: inListForm.name.value,
      lastName: inListForm.lastName.value,
      phone: inListForm.phone.value,
      note: inListForm.note.value,
      guests: inListForm.guests.value,
    }
  
      const result = await updateFormDB(data, inListForm.hiddenId.value);
      if(result){
        inListForm.classList.add('animate__fadeOutDown');
        setTimeout(()=>{
          app.removeChild(inListForm);
          addMessage(app)
        },500)
        removeBtnListeners();
      }
  });
  
}

const checkGuest = async(data)=>{
  const guests = await getGuests();
  const isInList = guests.filter((guest: any) => guest.phone.includes(data.phone));
  return isInList.length === 0 ? false : isInList[0];
}

const addMessage = (app: HTMLDivElement)=> {
  const gifs = ['haQ2DRRCtIvBu','3KC2jD2QcBOSc','kHmVOy84g8G6my09fu','DKnMqdm9i980E','JoOueVidjCdjOb70BE','SRrVsCppHorVh3aick' ]
  const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

  const googleCalenderLink = 'https://calendar.google.com/event?action=TEMPLATE&tmeid=MWxiZWU1NjNodGVnNzh0YWU5ZXR2cGdjcm8geWFuYWkxMDFAbQ&tmsrc=yanai101%40gmail.com';
  const html =`<div class="tag is-info is-large animate__animated animate__bounceIn">נתראה  בבר מצווה 🥰</div>
  <br/><br/>
  <div class="animate__animated animate__flipInY animate__delay-1s	">
  <a class="button" target="_blank" href="${googleCalenderLink}">🗓️ הוסיפו ליומן </a>
  </div>
  <br/><br/>
  <p><iframe src="https://giphy.com/embed/${randomGif}" width="480" height="262" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></p>`
  
  app.insertAdjacentHTML('afterbegin', html);
  setTimeout(()=>{
    jsConfetti.addConfetti({
      // emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
      // confettiColors: [
      //   '#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7',
      // ],
      confettiRadius: 6,
    confettiNumber: 400
    })

    addConfettiBtn(app)
  },2000)
}

const addConfettiBtn=(app)=>{
  const html =`  <button class="button is-info is-light" id="confetti">רוצה עוד קונפטי 🎉</button>  `
  
  app.insertAdjacentHTML('beforeend', html);
  const btn = document.getElementById('confetti');
  setTimeout(()=>{
    btn?.scrollIntoView({behavior: 'smooth'});
  },6000)
  btn?.addEventListener('click', ()=>{

    jsConfetti.addConfetti({
      // emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
      // confettiColors: [
      //   '#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7',
      // ],
      confettiRadius: 6,
    confettiNumber: 400
    })
  })
  
}



const addBtnListeners = ()=>{
  const addBtn = document.getElementById('addG');
  addBtn?.addEventListener('click', ()=>{
    increment()
  })

  const removeBtn = document.getElementById('removeG');
  removeBtn?.addEventListener('click', ()=>{
    decrement()
  })
}

const removeBtnListeners = ()=>{
  const removeBtn = document.getElementById('removeG');
  removeBtn?.removeEventListener('click', ()=>{
    decrement()
  })

  const addBtn = document.getElementById('addG');
  addBtn?.removeEventListener('click', ()=>{
    increment()
  })

}

const increment = () => {
  const guests = document.getElementById('guests');
  if(guests){
    guests.value = Number(guests?.value) + 1;

  }
}

const decrement = ()=>{
  const guests: any = document.getElementById('guests');
  guests.value = Number(guests?.value) - 1;
}