const functions = require('firebase-functions');
const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp();
const firestore = admin.firestore();

exports.onUserStatusChanged = functions.database
  .ref('/status/{uid}')
  .onUpdate((change, context) => {
    const eventStatus = change.after.val();
    const userStatusFSRef = firestore.doc(`status/${context.params.uid}`);
    return change.after.ref.once('value').then(statusSnapshot => {
      const status = statusSnapshot.val();
      console.log(status, eventStatus);
      if (status.lastUpdatedAt > eventStatus.lastUpdatedAt) {
        return null;
      }
      eventStatus.lastUpdatedAt = new Date(eventStatus.lastUpdatedAt);
      return userStatusFSRef.set(eventStatus);
    });
  });
