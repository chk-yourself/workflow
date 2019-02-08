import firebase from 'firebase';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};

class Firebase {
  constructor() {
    firebase.initializeApp(config);
    this.auth = firebase.auth();
    this.db = firebase.firestore();
  }

  // Auth API
  createUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  signInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  signOut = () => this.auth.signOut();

  passwordReset = email => this.auth.sendPasswordResetEmail(email);

  passwordUpdate = newPassword =>
    this.auth.currentUser.updatePassword(newPassword);

  // User API

  addUser = ({ userId, name, username, email, boardIds = [] }) =>
    this.db
      .collection('users')
      .doc(userId)
      .set({ userId, name, username, email, boardIds });

  updateUser = (userId, newValue = {}) =>
    this.db
      .collection('users')
      .doc(userId)
      .update(newValue);

  updateBoard = (boardId, newValue = {}) =>
    this.db
      .collection('boards')
      .doc(boardId)
      .update(newValue);

  updateList = (listId, newValue = {}) =>
    this.db
      .collection('lists')
      .doc(listId)
      .update(newValue);

  updateCard = (cardId, newValue = {}) =>
    this.db
      .collection('cards')
      .doc(cardId)
      .update(newValue);

  getUserDoc = userId => this.db.collection('users').doc(userId);

  getBoardDoc = boardId => this.db.collection('boards').doc(boardId);

  getTimestamp = () => firebase.firestore.FieldValue.serverTimestamp();

  addToArray = value => firebase.firestore.FieldValue.arrayUnion(value);

  addBoard = ({ userId, boardTitle }) => {
    this.db
      .collection('boards')
      .add({
        title: boardTitle,
        createdAt: this.getTimestamp(),
        lastModifiedAt: this.getTimestamp(),
        listIds: [],
        authorId: userId,
        memberIds: [userId]
      })
      .then(ref => {
        this.updateUser(userId, {
          boardIds: this.addToArray(ref.id)
        });
      });
  };

  addList = ({ boardId, listTitle }) => {
    this.db
      .collection('lists')
      .add({
        title: listTitle,
        createdAt: this.getTimestamp(),
        lastModifiedAt: this.getTimestamp(),
        cardIds: [],
        boardId
      })
      .then(ref => {
        this.updateBoard(boardId, {
          listIds: this.addToArray(ref.id),
          lastModifiedAt: this.getTimestamp()
        });
      });
  };

  addCard = ({ boardId, listId, cardTitle }) => {
    this.db
      .collection('cards')
      .add({
        title: cardTitle,
        createdAt: this.getTimestamp(),
        lastModifiedAt: this.getTimestamp(),
        listId,
        boardId
      })
      .then(ref => {
        this.updateList(listId, {
          cardIds: this.addToArray(ref.id),
          lastModifiedAt: this.getTimestamp()
        });
      });
  };
}

export default Firebase;
