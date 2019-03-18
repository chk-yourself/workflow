import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

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
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
  }

  // Auth API

  get currentUser() {
    return this.auth.currentUser;
  }

  signInWithGoogle = () => {
    const provider = new app.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    this.auth
      .signInWithPopup(provider)
      .then(result => {
        if (result.credential) {
          const token = result.credential.accessToken;
          console.log(token);
          const { user } = result;
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
    const provider = new app.auth.GithubAuthProvider();
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


  getTimestamp = () => app.firestore.FieldValue.serverTimestamp();

  addToArray = value => app.firestore.FieldValue.arrayUnion(value);

  removeFromArray = value => app.firestore.FieldValue.arrayRemove(value);

  deleteField = () => app.firestore.FieldValue.delete();

  getDocRef = (collection, doc, subcollection = null, subdoc = null) => {
    const docRef = this.db.doc(`${collection}/${doc}`);
    return subcollection && subdoc
      ? docRef.collection(subcollection).doc(subdoc)
      : docRef;
  };

  createBatch = () => this.db.batch();

  queryCollection = (path, [field, comparisonOperator, value]) => {
    return this.db.collection(path).where(field, comparisonOperator, value);
  };

  updateDoc = ([collection, doc, subcollection, subdoc], newValue = {}) =>
    this.getDocRef(collection, doc, subcollection, subdoc).update({
      lastUpdatedAt: this.getTimestamp(),
      ...newValue
    });

  updateBatch = (batch, ref, newValue = {}) => {
    return batch.update(ref, {
      lastUpdatedAt: this.getTimestamp(),
      ...newValue
    });
  };

  // User API

  getUserDoc = userId => this.db.collection('users').doc(userId);

  addUser = ({
    userId,
    name,
    username,
    email,
    projectIds = [],
    photoURL = null
  }) => {
    const batch = this.db.batch();
    const userRef = this.getDocRef('users', userId);
    const newFolderRef = this.getDocRef('users', userId, 'folders', '0');
    const todayFolderRef = this.getDocRef('users', userId, 'folders', '1');
    const upcomingFolderRef = this.getDocRef('users', userId, 'folders', '2');
    const laterFolderRef = this.getDocRef('users', userId, 'folders', '3');

    batch.set(userRef, {
      userId,
      name,
      username,
      email,
      projectIds,
      photoURL,
      settings: {
        tasks: {
          view: 'all',
          sortBy: 'folder'
        }
      },
      folderIds: [0, 1, 2, 3]
    });

    batch.set(newFolderRef, {
      name: 'New Tasks',
      taskIds: []
    });

    batch.set(todayFolderRef, {
      name: 'Today',
      taskIds: []
    });

    batch.set(upcomingFolderRef, {
      name: 'Upcoming',
      taskIds: []
    });

    batch.set(laterFolderRef, {
      name: 'Later',
      taskIds: []
    });

    return batch
      .commit()
      .then(() => {
        console.log('User added');
      })
      .catch(error => {
        console.error(error);
      });
  };

  updateUser = (userId, newValue = {}) =>
    this.db
      .collection('users')
      .doc(userId)
      .update(newValue);

  // Tags API

  addTag = ({ taskId, userId, name, projectId, color = 'default', projectCount, userCount }) => {
    const batch = this.db.batch();
    const userTagRef = this.getDocRef('users', userId, 'tags', name);
    const taskRef = this.getTaskDoc(taskId);

    batch.update(taskRef, {
      tags: this.addToArray(name),
      lastUpdatedAt: this.getTimestamp()
    });

    batch.set(
      userTagRef,
      {
        name,
        color,
        count: userCount
      },
      { merge: true }
    );

    if (projectId) {
      const projectRef = this.getDocRef('projects', projectId);

      batch.set(
        projectRef,
        {
          tags: {
            [name]: {
              name,
              color,
              count: projectCount
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

  removeTag = ({ taskId = null, name, userId, userCount, projectId, projectCount }, batch = this.createBatch(), shouldCommit = true) => {
    if (taskId) {
      const taskRef = this.getDocRef('tasks', taskId);
    this.updateBatch(batch, taskRef, {
      tags: this.removeFromArray(name)
    });
    }

    if (userCount !== null) {
      const userTagRef = this.getDocRef('users', userId, 'tags', name);
      if (userCount > 0) {
        this.updateBatch(batch, userTagRef, {
          count: userCount
        });
      } else {
        batch.delete(userTagRef);
      }
    }

    if (projectId) {
      const projectRef = this.getDocRef('projects', projectId);
      console.log({ projectCount });
      if (projectCount < 1) {
        this.updateBatch(batch, projectRef, {
          [`tags.${name}`]: this.deleteField()
        });
      } else {
        this.updateBatch(batch, projectRef, {
          [`tags.${name}.count`]: projectCount
        });
      }
    }
    if (shouldCommit) {
      return batch
      .commit()
      .then(() => {
        console.log('Tag deleted');
      })
      .catch(error => {
        console.error(error);
      });
    }
  };

  setTagColor = ({ userId, projectId, tag, color }) => {
    const batch = this.db.batch();
    const userTagRef = this.getDocRef('users', userId, 'tags', tag);
    if (projectId) {
      const projectRef = this.getProjectDoc(projectId);
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
    }

    this.updateBatch(batch, userTagRef, {
      color
    });

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

  addTask = ({
    name,
    projectId,
    projectName,
    listId,
    listName,
    userId,
    dueDate = null,
    folderId = null
  }) => {
    const isFolderItem = folderId && userId;

    this.db
      .collection('tasks')
      .add({
        createdBy: userId,
        createdAt: this.getTimestamp(),
        lastUpdatedAt: null,
        commentIds: [],
        subtaskIds: [],
        isCompleted: false,
        completedAt: null,
        notes: '',
        assignedTo: isFolderItem ? [userId] : [],
        folders: isFolderItem
          ? {
              [userId]: folderId
            }
          : {},
        ownerId: isFolderItem ? userId : null,
        dueDate,
        listId,
        listName,
        projectId,
        projectName,
        name
      })
      .then(ref => {
        if (isFolderItem) {
          this.updateDoc(['users', userId, 'folders', folderId], {
            taskIds: this.addToArray(ref.id)
          });
        } else {
          this.updateDoc(['lists', listId], {
            taskIds: this.addToArray(ref.id)
          });
        }
      });
  };

  updateTask = (taskId, newValue = {}) => {
    console.log('task updated');
    this.getTaskDoc(taskId).update({
      lastUpdatedAt: this.getTimestamp(),
      ...newValue
    });
  };

  removeAssignee = ({ taskId, userId, folderId }, batch = this.createBatch(), shouldCommit = true) => {
    const folderRef = this.getDocRef('users', userId, 'folders', folderId);
    this.updateBatch(batch, folderRef, {
      taskIds: this.removeFromArray(taskId)
    });

    if (shouldCommit) {
      const taskRef = this.getDocRef('tasks', taskId);
      this.updateBatch(batch, taskRef, {
        assignedTo: this.removeFromArray(userId),
        [`folders.${userId}`]: this.deleteField()
      });
  
      return batch
        .commit()
        .then(() => {
          console.log('Removed member from task');
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  addAssignee = ({ taskId, projectId, userId }) => {
    const batch = this.db.batch();
    const taskRef = this.getDocRef('tasks', taskId);
    const projectRef = this.getDocRef('projects', projectId);
    const newFolderRef = this.getDocRef('users', userId, 'folders', '0');
    batch.update(newFolderRef, {
      taskIds: this.addToArray(taskId),
      lastUpdatedAt: this.getTimestamp()
    });
    batch.update(taskRef, {
      assignedTo: this.addToArray(userId),
      [`folders.${userId}`]: '0',
      lastUpdatedAt: this.getTimestamp()
    });
    batch.update(projectRef, {
      memberIds: this.addToArray(userId),
      lastUpdatedAt: this.getTimestamp()
    });
    return batch
      .commit()
      .then(() => {
        console.log('Assigned task to member');
      })
      .catch(error => {
        console.error(error);
      });
  };

  deleteTask = (
    { taskId, listId, assignedTo, subtaskIds, commentIds, folders },
    batch = this.createBatch(),
    shouldCommit = true
  ) => {
    const taskRef = this.getDocRef('tasks', taskId);
    batch.delete(taskRef);

    if (listId) {
      const listRef = this.getDocRef('lists', listId);
      this.updateBatch(batch, listRef, {
        taskIds: this.removeFromArray(taskId)
      });
    }

    // Delete subtasks
    if (subtaskIds.length > 0) {
      subtaskIds.forEach(subtaskId => {
        this.deleteSubtask({ subtaskId }, batch, false);
      });
      console.log('1. Subtasks deleted.');
    }

    // Delete task assignments
    if (assignedTo.length > 0) {
      assignedTo.forEach(userId => {
        const folderId = folders[userId];
        const folderRef = this.getDocRef('users', userId, 'folders', folderId);
        this.updateBatch(batch, folderRef, {
          taskIds: this.removeFromArray(taskId)
        });
      });
      console.log('2. Removed task assignments.');
    }

    // Delete comments
    if (commentIds.length > 0) {
      commentIds.forEach(commentId => {
        const commentRef = this.getDocRef('comments', commentId);
        batch.delete(commentRef);
      });
      console.log('3. Task comments deleted.');
    }

    if (shouldCommit) {
      return batch
      .commit()
      .then(() => {
        console.log('task deleted');
      })
      .catch(error => {
        console.error(error);
      });
    }
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

  moveTaskToFolder = ({
    userId,
    taskId,
    origFolderId,
    newFolderId,
    updatedTaskIds
  }) => {
    const batch = this.db.batch();
    const taskRef = this.getDocRef('tasks', taskId);
    const origFolderRef = this.getDocRef(
      'users',
      userId,
      'folders',
      origFolderId
    );
    const newFolderRef = this.getDocRef(
      'users',
      userId,
      'folders',
      newFolderId
    );
    batch.update(taskRef, {
      [`folders.${userId}`]: newFolderId,
      lastUpdatedAt: this.getTimestamp()
    });
    batch.update(origFolderRef, {
      taskIds: this.removeFromArray(taskId),
      lastUpdatedAt: this.getTimestamp()
    });
    batch.update(newFolderRef, {
      taskIds: updatedTaskIds,
      lastUpdatedAt: this.getTimestamp()
    });
    return batch
      .commit()
      .then(() => {
        console.log('Task moved to new folder');
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

  updateSubtask = async (subtaskId, newValue = {}) => {
    await this.getSubtaskDoc(subtaskId).update({
      lastUpdatedAt: this.getTimestamp(),
      ...newValue
    });
  };

  deleteSubtask = (
    { subtaskId, taskId = null },
    batch = this.createBatch(),
    shouldCommit = true
  ) => {
    const subtaskRef = this.getDocRef('subtasks', subtaskId);
    batch.delete(subtaskRef);

    if (taskId) {
      const taskRef = this.getTaskDoc(taskId);
      this.updateBatch(batch, taskRef, {
        subtaskIds: this.removeFromArray(subtaskId)
      });
    }

    if (shouldCommit) {
      return batch
        .commit()
        .then(() => {
          console.log('Subtask deleted.');
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  // Comment API

  addComment = ({ userId, memberIds = [], projectId, taskId, content }) => {
    this.db
      .collection('comments')
      .add({
        createdAt: this.getTimestamp(),
        lastUpdatedAt: this.getTimestamp(),
        isPinned: false,
        from: userId,
        to: memberIds,
        likes: {},
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
}

export default Firebase;
