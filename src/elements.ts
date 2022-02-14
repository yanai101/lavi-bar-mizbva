import { addGuest, getGuests, updateFormDB } from "./firebase";
import JSConfetti from 'js-confetti'
import { sendSMS } from "./main";

const jsConfetti = new JSConfetti();


export const addMainForm = (app: HTMLDivElement) => {
  const html = ` <form id="guestForm" class="box add-form animate__animated animate__delay-2s animate__backInDown">
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
    <label class="label">טלפון (מספר שלם בלי קידומת ומקפים)</label>
    <div class="control">
    <input class="input is-link"  type="number" id="phone" inputmode="numeric" required name="phone" placeholder="טלפון" />
    </div>
    </div>
    <div class="field">
    <label class="label">מספר אורחים</label>
    <div class="control add-guest">
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
  const form: any = document.getElementById('guestForm');
  addBtnListeners();

  form?.addEventListener('submit', async (e: any) => {
    e.preventDefault();
    const btn: any = document.querySelector('button[type="submit"]');
    form.classList.remove('animate__delay-2s')
    btn.disabled = 'disabled';

    const data = {
      name: form.name.value,
      lastName: form.lastName.value,
      phone: form.phone.value,
      note: form.note.value,
      guests: form.guests.value,
    }
    const isInList = await checkGuest(data);
    form.classList.add('animate__backOutUp');
    if (!isInList) {
      const result = await addGuest(data);
      if (result) {
        form.addEventListener('animationend', () => {
          app.removeChild(form);
          addMessage(app)
          const smsString = `איזה כיף!!!
                      ${data.name} ${data.lastName}
                      אנחנו שמחים שאתם באים לחגוג עם לביא שלנו בר מצווה-
                      מצפים לראות אתכם!!!
                            🥰
        `;
          sendSMSReq(data.phone, smsString)
        }, { once: true });
      }
    } else {
      form.addEventListener('animationend', () => {
        app.removeChild(form);
        addEditForm(app, isInList)
      }, { once: true });
    }
    removeBtnListeners();
  });


}


const addEditForm = (app: HTMLDivElement, inListData: any) => {
  const html = ` <form id="inListForm" class="box in-list-form animate__animated animate__backInDown">
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
    <label class="label">טלפון (מספר שלם בלי קידומת ומקפים)</label>
    <div class="control">
      <input class="input is-success" type="number" id="phone" inputmode="numeric" required name="phone" placeholder="טלפון" />
    </div>
  </div>
  <div class="field">
    <label class="label">מספר אורחים</label>
    <div class="control add-guest">
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

  const inListForm: any = document.getElementById('inListForm');
  if (inListData) {
    inListForm.name.value = inListData.name;
    inListForm.lastName.value = inListData.lastName;
    inListForm.phone.value = inListData.phone;
    inListForm.note.value = inListData.note;
    inListForm.guests.value = inListData.guests;
    inListForm.hiddenId.value = inListData.id;
  }

  inListForm?.addEventListener('submit', async (e: any) => {
    e.preventDefault();
    const data = {
      name: inListForm.name.value,
      lastName: inListForm.lastName.value,
      phone: inListForm.phone.value,
      note: inListForm.note.value,
      guests: inListForm.guests.value,
    }

    const result = await updateFormDB(data, inListForm.hiddenId.value);
    if (result) {
      inListForm.classList.add('animate__backOutUp');
      inListForm.addEventListener('animationend', () => {
        app.removeChild(inListForm);
        addMessage(app)
        removeBtnListeners();
      }, { once: true });
    }
  });

}

const checkGuest = async (data: any) => {
  const guests = await getGuests();
  const isInList = guests.filter((guest: any) => guest.phone.includes(data.phone));
  return isInList.length === 0 ? false : isInList[0];
}

const addMessage = (app: HTMLDivElement) => {
  const googleCalenderLink = 'https://calendar.google.com/event?action=TEMPLATE&tmeid=MWxiZWU1NjNodGVnNzh0YWU5ZXR2cGdjcm8geWFuYWkxMDFAbQ&tmsrc=yanai101%40gmail.com';
  const html = `<div class="tag is-info is-large animate__animated animate__bounceIn">נתראה  בבר מצווה 🥰</div>
  <br/><br/>
  <div class="animate__animated animate__flipInY animate__delay-1s">
  <a class="button" target="_blank" href="${googleCalenderLink}">🗓️ הוסיפו ליומן </a>
  <a class="button" target="_blank" href="https://waze.com/ul/hsv8bsyggz">Waze </a>
  <br/><br/>
  <button class="button is-info is-light animate__animated animate__jackInTheBox animate__delay-4s" id="confetti">רוצה עוד קונפטי 🎉</button>
  </div>`

  app.insertAdjacentHTML('afterbegin', html);
  setTimeout(() => {
    jsConfetti.addConfetti({
      // emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
      // confettiColors: [
      //   '#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7',
      // ],
      confettiRadius: 6,
      confettiNumber: 400
    })

    addConfettiBtn()
  }, 1000)
}

const addConfettiBtn = () => {

  const btn = document.getElementById('confetti');

  btn?.addEventListener('click', () => {

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



const addBtnListeners = () => {
  const addBtn = document.getElementById('addG');
  addBtn?.addEventListener('click', () => {
    increment()
  })

  const removeBtn = document.getElementById('removeG');
  removeBtn?.addEventListener('click', () => {
    decrement()
  })
}

const removeBtnListeners = () => {
  const removeBtn = document.getElementById('removeG');
  removeBtn?.removeEventListener('click', () => {
    decrement()
  })

  const addBtn = document.getElementById('addG');
  addBtn?.removeEventListener('click', () => {
    increment()
  })

}

const increment = () => {
  const guests: any = document.getElementById('guests');
  if (guests) {

    guests.value = Number(guests?.value) + 1 > 10 ? 10 : Number(guests?.value) + 1;
  }
}

const decrement = () => {
  const guests: any = document.getElementById('guests');
  guests.value = Number(guests?.value) - 1 < 0 ? 0 : Number(guests?.value) - 1;
}


const sendSMSReq = async (phone: any, message: any) => {
  // let formData = new FormData();
  // formData.append('phone', phone);
  // formData.append('message', message);

  try {
    const result = await fetch('/.netlify/functions/sendSms', {
      method: 'POST',
      body: JSON.stringify({ phone, message }),
    });
    const dataReturn = await result.json();
    console.log('sms', dataReturn);
  } catch (error) {
    console.log('sms err', error);
  }

}