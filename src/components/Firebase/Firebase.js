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

  signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    this.auth
      .signInWithPopup(provider)
      .then(result => {
        if (result.credential) {
          const token = result.credential.accessToken;
          console.log(token);
          const user = result.user;
        }
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;

        if (errorCode === 'auth/account-exists-with-different-credential') {
          alert(
            'You have already signed up with a different auth provider for that email.'
          );
        } else {
          console.error(error);
        }
      });
  };

  signInWithGithub = () => {
    const provider = new firebase.auth.GithubAuthProvider();
    this.auth.signInWithRedirect(provider);
  };

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

  deleteField = () => firebase.firestore.FieldValue.delete();

  // User API

  getUserDoc = userId => this.db.collection('users').doc(userId);

  addUser = ({
    userId,
    name,
    username,
    email,
    projectIds = [],
    photoURL = null
  }) =>
    this.db
      .collection('users')
      .doc(userId)
      .set({
        userId,
        name,
        username,
        email,
        projectIds,
        photoURL,
        listIds: [],
        defaultLists: {
          '0': {
            name: 'New Tasks',
            taskIds: []
          },
          '1': {
            name: 'Today',
            taskIds: []
          },
          '2': {
            name: 'Upcoming',
            taskIds: []
          },
          '3': {
            name: 'Later',
            taskIds: []
          }
        }
      });

  updateUser = (userId, newValue = {}) =>
    this.db
      .collection('users')
      .doc(userId)
      .update(newValue);

  // Tags API

  addTag = ({ taskId, userId, text, projectId = null, color = 'default' }) => {
    const batch = this.db.batch();
    const userRef = this.getUserDoc(userId);
    const taskRef = this.getTaskDoc(taskId);

    batch.update(taskRef, {
      tags: this.addToArray(text),
      lastUpdatedAt: this.getTimestamp()
    });

    batch.set(
      userRef,
      {
        tags: {
          [text]: {
            text,
            color,
            lastUsedAt: this.getTimestamp()
          }
        },
        lastUpdatedAt: this.getTimestamp()
      },
      { merge: true }
    );

    if (projectId) {
      const projectRef = this.getProjectDoc(projectId);

    batch.set(
      projectRef,
      {
        tags: {
          [text]: {
            text,
            color,
            lastUsedAt: this.getTimestamp()
          }
        },
        lastUpdatedAt: this.getTimestamp()
      },
      { merge: true }
    );
    }


    return batch
      .commit()
      .then(() => {
        console.log('tag added');
      })
      .catch(error => {
        console.error(error);
      });
  };

  removeTag = ({ taskId, tag }) => {
    this.updateTask(taskId, {
      tags: this.removeFromArray(tag)
    });
  };

  setTagColor = ({ userId, projectId, tag, color }) => {
    const batch = this.db.batch();
    const userRef = this.getUserDoc(userId);
    const projectRef = this.getProjectDoc(projectId);

    batch.set(
      userRef,
      {
        tags: {
          [tag]: {
            color
          }
        },
        lastUpdatedAt: this.getTimestamp()
      },
      { merge: true }
    );

    batch.set(
      projectRef,
      {
        tags: {
          [tag]: {
            color
          }
        },
        lastUpdatedAt: this.getTimestamp()
      },
      { merge: true }
    );

    return batch
      .commit()
      .then(() => {
        console.log('tag color updated');
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Project API

  getProjectDoc = projectId => this.db.collection('projects').doc(projectId);

  updateProject = (projectId, newValue = {}) =>
    this.getProjectDoc(projectId).update({
      lastUpdatedAt: this.getTimestamp(),
      ...newValue
    });

    updateProjectName = ({ projectId, name }) => {
      const batch = this.db.batch();
      const projectRef = this.getProjectDoc(projectId);
  
      // Delete list
      batch.update(projectRef, {
        name,
        lastUpdatedAt: this.getTimestamp()
      });
  
      // Update tasks assigned to list
      this.db
        .collection('tasks')
        .where('projectId', '==', projectId)
        .get()
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            batch.update(doc.ref, {
              projectName: name
            });
          });
          return batch
            .commit()
            .then(() => {
              console.log('project name updated');
            })
            .catch(error => {
              console.error(error);
            });
        });
    };

  addProject = ({
    userId,
    name,
    color = 'default',
    view = 'board',
    isPrivate = false
  }) => {
    this.db
      .collection('projects')
      .add({
        createdAt: this.getTimestamp(),
        lastUpdatedAt: null,
        listIds: [],
        createdBy: userId,
        memberIds: [userId],
        notes: '',
        isFavorited: false,
        color,
        view,
        isPrivate,
        name
      })
      .then(ref => {
        this.updateUser(userId, {
          projectIds: this.addToArray(ref.id)
        });
      });
  };

  // List API

  getListDoc = listId => this.db.collection('lists').doc(listId);

  updateList = (listId, newValue = {}) =>
    this.getListDoc(listId).update({
      lastUpdatedAt: this.getTimestamp(),
      ...newValue
    });

    updateListName = ({ listId, name }) => {
      const batch = this.db.batch();
      const listRef = this.getListDoc(listId);
  
      // Delete list
      batch.update(listRef, {
        name,
        lastUpdatedAt: this.getTimestamp()
      });
  
      // Update tasks assigned to list
      this.db
        .collection('tasks')
        .where('listId', '==', listId)
        .get()
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            batch.update(doc.ref, {
              listName: name
            });
          });
          return batch
            .commit()
            .then(() => {
              console.log('list name updated');
            })
            .catch(error => {
              console.error(error);
            });
        });
    };

  addList = ({ name, projectId = null, userId = null }) => {
    this.db
      .collection('lists')
      .add({
        createdAt: this.getTimestamp(),
        lastUpdatedAt: null,
        taskIds: [],
        projectId,
        name
      })
      .then(ref => {
        if (projectId) {
          this.updateProject(projectId, {
            listIds: this.addToArray(ref.id)
          });
        }
        if (userId) {
          this.updateUser(userId, {
            listIds: this.addToArray(ref.id)
          });
        }
      });
  };

  deleteList = ({ listId, projectId }) => {
    const batch = this.db.batch();
    const listRef = this.getListDoc(listId);
    const projectRef = this.getProjectDoc(projectId);

    // Delete list
    batch.delete(listRef);

    // Remove list id from project
    batch.update(projectRef, {
      listIds: this.removeFromArray(listId),
      lastUpdatedAt: this.getTimestamp()
    });

    // Delete tasks assigned to list
    this.db
      .collection('tasks')
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

  // Task API

  getTaskDoc = taskId => this.db.collection('tasks').doc(taskId);

  addTask = ({ name, projectId, projectName, listId, listName, userId = null, defaultKey = null }) => {
    const isDefaultListItem = defaultKey && userId;
    
    this.db
      .collection('tasks')
      .add({
        createdAt: this.getTimestamp(),
        lastUpdatedAt: null,
        commentIds: [],
        subtaskIds: [],
        isCompleted: false,
        completedAt: null,
        dueDate: null,
        notes: '',
        assignedTo: isDefaultListItem ? [userId] : [],
        ownerId: isDefaultListItem ? userId : null,
        listId,
        listName,
        projectId,
        projectName,
        name
      })
      .then(ref => {
        if (isDefaultListItem) {
          this.updateUser(userId, {
            [`defaultLists.${defaultKey}.taskIds`]: this.addToArray(ref.id)
          });
        } else {
          this.updateList(listId, {
            taskIds: this.addToArray(ref.id),
          });
        };
      });
  };

  updateTask = (taskId, newValue = {}) => {
    this.getTaskDoc(taskId).update({
      lastUpdatedAt: this.getTimestamp(),
      ...newValue
    });
  };

  removeAssignee = ({ taskId, userId }) => {
    const batch = this.db.batch();
    const taskRef = this.getTaskDoc(taskId);
    const userRef = this.getUserDoc(userId);
    batch.update(userRef, {
      'defaultLists.0.taskIds': this.removeFromArray(taskId),
      'defaultLists.1.taskIds': this.removeFromArray(taskId),
      'defaultLists.2.taskIds': this.removeFromArray(taskId),
      'defaultLists.3.taskIds': this.removeFromArray(taskId),
      lastUpdatedAt: this.getTimestamp()
    });

    batch.update(taskRef, {
      assignedTo: this.removeFromArray(userId),
      lastUpdatedAt: this.getTimestamp()
    });

    return batch
      .commit()
      .then(() => {
        console.log('Removed member from task');
      })
      .catch(error => {
        console.error(error);
      });
  };

  assignMember = ({ taskId, projectId, userId }) => {
    const batch = this.db.batch();
    const taskRef = this.getTaskDoc(taskId);
    const projectRef = this.getProjectDoc(projectId);
    const userRef = this.getUserDoc(userId);
    batch.update(userRef, {
      'defaultLists.0.taskIds': this.addToArray(taskId),
      lastUpdatedAt: this.getTimestamp()
    });
    batch.update(taskRef, {
      assignedTo: this.addToArray(userId),
      lastUpdatedAt: this.getTimestamp()
    });
    batch.update(projectRef, {
      memberIds: this.addToArray(userId),
      lastUpdatedAt: this.getTimestamp()
    });
    return batch
      .commit()
      .then(() => {
        console.log('assigned task to member');
      })
      .catch(error => {
        console.error(error);
      });
  };

  deleteTask = ({
    taskId,
    listId,
    assignedTo = [],
    defaultKey = null,
    userId = null
  }) => {
    const batch = this.db.batch();
    const taskRef = this.getTaskDoc(taskId);
    batch.delete(taskRef);

    if (listId) {
      const listRef = this.getListDoc(listId);
      batch.update(listRef, {
        taskIds: this.removeFromArray(taskId),
        lastUpdatedAt: this.getTimestamp()
      });
    }

    if (defaultKey) {
      const userRef = this.getUserDoc(userId);
      batch.update(userRef, {
        [`defaultLists.${defaultKey}.taskIds`]: this.removeFromArray(taskId),
        lastUpdatedAt: this.getTimestamp()
      });
    }

    // Delete subtasks assigned to task
    this.db
      .collection('subtasks')
      .where('taskId', '==', taskId)
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        console.log('1. delete task subtasks');
      })
      .then(() => {
        assignedTo.forEach(memberId => {
          if (userId && memberId === userId) return;
          const memberRef = this.getUserDoc(memberId);
          batch.update(memberRef, {
            'defaultLists.0.taskIds': this.removeFromArray(taskId),
            'defaultLists.1.taskIds': this.removeFromArray(taskId),
            'defaultLists.2.taskIds': this.removeFromArray(taskId),
            'defaultLists.3.taskIds': this.removeFromArray(taskId),
            lastUpdatedAt: this.getTimestamp()
          });
        });
        console.log('2. remove task assignment');
      })
      .then(() => {
        this.db
          .collection('comments')
          .where('taskId', '==', taskId)
          .get()
          .then(snapshot => {
            snapshot.docs.forEach(doc => {
              batch.delete(doc.ref);
            });
            console.log('3. delete task comments');
            return batch
              .commit()
              .then(() => {
                console.log('task deleted');
              })
              .catch(error => {
                console.error(error);
              });
          });
      });
  };

  moveTaskToList = ({ taskId, origListId, newListId, updatedTaskIds }) => {
    const batch = this.db.batch();
    const taskRef = this.getTaskDoc(taskId);
    const origListRef = this.getListDoc(origListId);
    const newListRef = this.getListDoc(newListId);
    batch.update(taskRef, {
      listId: newListId,
      lastUpdatedAt: this.getTimestamp()
    });
    batch.update(origListRef, {
      taskIds: this.removeFromArray(taskId),
      lastUpdatedAt: this.getTimestamp()
    });
    batch.update(newListRef, {
      taskIds: updatedTaskIds,
      lastUpdatedAt: this.getTimestamp()
    });
    return batch
      .commit()
      .then(() => {
        console.log('task moved');
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Subtask API

  getSubtaskDoc = subtaskId => this.db.collection('subtasks').doc(subtaskId);

  addSubtask = ({
    userId,
    name,
    memberIds = [],
    projectId = null,
    taskId = null,
    dueDate = null
  }) => {
    this.db
      .collection('subtasks')
      .add({
        createdAt: this.getTimestamp(),
        lastUpdatedAt: this.getTimestamp(),
        isCompleted: false,
        createdBy: userId,
        assignedTo: [userId, ...memberIds],
        completedAt: null,
        dueDate,
        projectId,
        taskId,
        name
      })
      .then(ref => {
        if (taskId === null) return;
        this.updateTask(taskId, {
          subtaskIds: this.addToArray(ref.id)
        });
      });
  };

  updateSubtask = (subtaskId, newValue = {}) => {
    this.getSubtaskDoc(subtaskId).update({
      lastUpdatedAt: this.getTimestamp(),
      ...newValue
    });
  };

  deleteSubtask = ({ subtaskId, taskId = null }) => {
    const batch = this.db.batch();
    const subtaskRef = this.getSubtaskDoc(subtaskId);
    batch.delete(subtaskRef);

    if (taskId) {
      const taskRef = this.getTaskDoc(taskId);
      batch.update(taskRef, {
        subtaskIds: this.removeFromArray(subtaskId),
        lastUpdatedAt: this.getTimestamp()
      });
    }
    return batch
      .commit()
      .then(() => {
        console.log('subtask deleted');
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Comment API
  getCommentDoc = commentId => this.db.collection('comments').doc(commentId);

  addComment = ({ userId, memberIds = [], projectId, taskId, content }) => {
    this.db
      .collection('comments')
      .add({
        createdAt: this.getTimestamp(),
        lastUpdatedAt: this.getTimestamp(),
        isPinned: false,
        from: userId,
        to: memberIds,
        likes: [],
        projectId,
        taskId,
        content
      })
      .then(ref => {
        this.updateTask(taskId, {
          commentIds: this.addToArray(ref.id)
        });
      });
  };

  updateComment = (commentId, newValue = {}) => {
    this.getCommentDoc(commentId).update({
      lastUpdatedAt: this.getTimestamp(),
      ...newValue
    });
  };
}

export default Firebase;
