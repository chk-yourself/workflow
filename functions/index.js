const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const firestore = admin.firestore();

exports.onUserStatusChanged = functions.database
  .ref('/status/{uid}')
  .onUpdate((change, context) => {
    const eventStatus = change.after.val();
    const userRef = firestore.doc(`users/${context.params.uid}`);
    return change.after.ref.once('value').then(statusSnapshot => {
      const status = statusSnapshot.val();
      console.log(status, eventStatus);
      if (status.lastUpdatedAt > eventStatus.lastUpdatedAt) {
        return null;
      }
      eventStatus.lastUpdatedAt = new Date(eventStatus.lastUpdatedAt);
      return userRef.update({
        status: eventStatus
      });
    });
  });
