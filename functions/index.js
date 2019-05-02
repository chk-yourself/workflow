const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase_tools = require('firebase-tools');

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

exports.onGuestStatusChanged = functions.firestore
  .document('users/{userId}')
  .onUpdate((change, context) => {
    const { status, role } = change.after.data();
    const { state } = status;
    if (role === 'guest' && state === 'offline') {
      console.log('guest signed off');
    }
    return null;
  });

exports.mintAdminToken = functions.https.onCall((data, context) => {
  const uid = data.uid;
  return admin
    .auth()
    .createCustomToken(uid, { admin: true })
    .then(token => {
      return { token: token };
    });
});

exports.recursiveDelete = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB'
  })
  .https.onCall((data, context) => {
    if (!(context.auth && context.auth.token && context.auth.token.admin)) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Must be an administrative user to initiate delete.'
      );
    }
    const path = data.path;
    console.log(
      `User ${context.auth.uid} has requested to delete path ${path}`
    );
    return firebase_tools.firestore
      .delete(path, {
        project: process.env.REACT_APP_PROJECT_ID,
        recursive: true,
        yes: true,
        token: functions.config().fb.token
      })
      .then(() => {
        return {
          path: path
        };
      });
  });

exports.deleteTag = functions.firestore
  .document('users/{userId}/tags/{tagId}')
  .onUpdate((change, context) => {
    const tag = change.after.data();
    const { count } = tag;
    if (count <= 0) {
      return change.after.ref.delete();
    }
    return null;
  });
