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

  // Utility API

  getTimestamp = () => firebase.firestore.FieldValue.serverTimestamp();
  addToArray = value => firebase.firestore.FieldValue.arrayUnion(value);
  removeFromArray = value => firebase.firestore.FieldValue.arrayRemove(value);

  // User API

  getUserDoc = userId => this.db.collection('users').doc(userId);

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

  // Board API

  getBoardDoc = boardId => this.db.collection('boards').doc(boardId);

  updateBoard = (boardId, newValue = {}) =>
    this.getBoardDoc(boardId).update({
      lastModifiedAt: this.getTimestamp(),
      ...newValue
    });

  addBoard = ({ userId, boardTitle }) => {
    this.db
      .collection('boards')
      .add({
        createdAt: this.getTimestamp(),
        lastModifiedAt: this.getTimestamp(),
        listIds: [],
        authorId: userId,
        memberIds: [userId],
        boardTitle
      })
      .then(ref => {
        this.updateUser(userId, {
          boardIds: this.addToArray(ref.id)
        });
      });
  };

  // List API

  getListDoc = listId => this.db.collection('lists').doc(listId);

  updateList = (listId, newValue = {}) =>
    this.getListDoc(listId).update({
      lastModifiedAt: this.getTimestamp(),
      ...newValue
    });

  addList = ({ boardId, listTitle }) => {
    this.db
      .collection('lists')
      .add({
        createdAt: this.getTimestamp(),
        lastModifiedAt: this.getTimestamp(),
        cardIds: [],
        boardId,
        listTitle
      })
      .then(ref => {
        this.updateBoard(boardId, {
          listIds: this.addToArray(ref.id),
          lastModifiedAt: this.getTimestamp()
        });
      });
  };

  deleteList = ({ listId, boardId }) => {
    const batch = this.db.batch();
    const listRef = this.getListDoc(listId);
    const boardRef = this.getBoardDoc(boardId);

    // Delete list
    batch.delete(listRef);

    // Remove list id from board
    batch.update(boardRef, {
      listIds: this.removeFromArray(listId),
      lastModifiedAt: this.getTimestamp()
    });

    // Delete cards assigned to list
    this.db
      .collection('cards')
      .where('listId', '==', listId)
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        return batch
          .commit()
          .then(() => {
            console.log('list deleted');
          })
          .catch(error => {
            console.error(error);
          });
      });
  };

  // Card API

  getCardDoc = cardId => this.db.collection('cards').doc(cardId);

  addCard = ({ boardId, listId, cardTitle }) => {
    this.db
      .collection('cards')
      .add({
        createdAt: this.getTimestamp(),
        lastModifiedAt: this.getTimestamp(),
        listId,
        boardId,
        cardTitle
      })
      .then(ref => {
        this.updateList(listId, {
          cardIds: this.addToArray(ref.id),
          lastModifiedAt: this.getTimestamp()
        });
      });
  };

  updateCard = (cardId, newValue = {}) => {
    this.getCardDoc(cardId).update({
      lastModifiedAt: this.getTimestamp(),
      ...newValue
    });
  };

  deleteCard = ({ cardId, listId }) => {
    const batch = this.db.batch();
    const cardRef = this.getCardDoc(cardId);
    const listRef = this.getListDoc(listId);
    batch.delete(cardRef);
    batch.update(listRef, {
      cardIds: this.removeFromArray(cardId),
      lastModifiedAt: this.getTimestamp()
    });

    return batch
      .commit()
      .then(() => {
        console.log('card deleted');
      })
      .catch(error => {
        console.error(error);
      });
  };

  moveCardToList = ({ cardId, origListId, newListId, updatedCardIds }) => {
    const batch = this.db.batch();
    const cardRef = this.getCardDoc(cardId);
    const origListRef = this.getListDoc(origListId);
    const newListRef = this.getListDoc(newListId);
    batch.update(cardRef, {
      listId: newListId,
      lastModifiedAt: this.getTimestamp()
    });
    batch.update(origListRef, {
      cardIds: this.removeFromArray(cardId),
      lastModifiedAt: this.getTimestamp()
    });
    batch.update(newListRef, {
      cardIds: updatedCardIds,
      lastModifiedAt: this.getTimestamp()
    });
    return batch
      .commit()
      .then(() => {
        console.log('card moved');
      })
      .catch(error => {
        console.error(error);
      });
  };
}

export default Firebase;
