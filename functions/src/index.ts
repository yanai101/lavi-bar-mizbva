import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


exports.sandSMS = functions.firestore.document('/guest-list/{doc}').onCreate((snap,contex)=>{
  console.log('direstor function', snap.data());
  console.log('direstor function', contex.params.doc);
  return null
})


exports.nextWeekSMS = functions.pubsub.schedule