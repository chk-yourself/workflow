import app from 'firebase/app';
import 'firebase/database';
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
    this.fs = app.firestore();
    this.db = app.database();
  }

  // Auth API

  get currentUser() {
    return this.auth.currentUser;
  }

  // Refreshes current user, if signed in
  reload = () => {
    this.auth.reload();
  };

  isNewUser = user => {
    const { creationTime, lastSignInTime } = user.metadata;
    return creationTime === lastSignInTime;
  };

  signInWithGoogle = () => {
    const provider = new app.auth.GoogleAuthProvider();
    this.auth
      .signInWithPopup(provider)
      .then(result => {
        if (result.credential) {
          const token = result.credential.accessToken;
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

  createUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  signInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  signOut = () => this.auth.signOut();

  passwordReset = email => this.auth.sendPasswordResetEmail(email);

  passwordUpdate = newPassword =>
    this.auth.currentUser.updatePassword(newPassword);

  sendSignInLinkToEmail = email => {
    const actionCodeSettings = {
      url: `${process.env.REACT_APP_BASE_URL}/login`,
      // This must be true.
      handleCodeInApp: true
    };
    this.auth
      .sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('loginEmail', email);
      })
      .catch(error => {
        console.log(error);
      });
  };

  sendEmailVerification = () => {
    const actionCodeSettings = {
      url: `${process.env.REACT_APP_BASE_URL}/login`,
      // This must be true.
      handleCodeInApp: true
    };
    this.currentUser
      .sendEmailVerification(actionCodeSettings)
      .then(() => {
        console.log('verification email sent');
      })
      .catch(error => {
        console.log(error);
      });
  };

  // Utility API

  getTimestamp = () => app.firestore.FieldValue.serverTimestamp();

  addToArray = value => app.firestore.FieldValue.arrayUnion(value);

  removeFromArray = value => app.firestore.FieldValue.arrayRemove(value);

  deleteField = () => app.firestore.FieldValue.delete();

  plus = value => app.firestore.FieldValue.increment(value);

  minus = value => app.firestore.FieldValue.increment(-value);

  getDocRef = (...args) => {
    try {
      if (args.length % 2 !== 0) {
        throw new Error('Invalid Argument: Must follow pattern `collection/subcollection...`');
      }
    let path = args.join('/');
    return this.fs.doc(path);
    } catch (error) {
      console.error(error);
    }
  };

  queryCollection = (path, [field, comparisonOperator, value]) => {
    return this.fs.collection(path).where(field, comparisonOperator, value);
  };

  updateDoc = ([collection, doc, subcollection, subdoc], newValue = {}) =>
    this.getDocRef(collection, doc, subcollection, subdoc).update({
      lastUpdatedAt: this.getTimestamp(),
      ...newValue
    });

  createBatch = () => this.fs.batch();

  updateBatch = (batch, ref, newValue = {}) => {
    const doc = Array.isArray(ref) ? this.getDocRef(...ref) : ref;
    return batch.update(doc, {
      lastUpdatedAt: this.getTimestamp(),
      ...newValue
    });
  };

  setBatch = (batch, ref, newValue = {}, merge = false) => {
    const doc = Array.isArray(ref) ? this.getDocRef(...ref) : ref;
    return merge ? batch.set(doc, newValue, { merge: true }) : batch.set(doc, newValue);
  };

  // User Presence

  initPresenceDetection = uid => {
    const userStatusDBRef = this.db.ref(`/status/${uid}`);
    const isOfflineDB = {
      state: 'offline',
      lastUpdatedAt: app.database.ServerValue.TIMESTAMP
    };

    const isOnlineDB = {
      state: 'online',
      lastUpdatedAt: app.database.ServerValue.TIMESTAMP
    };

    const userStatusFSRef = this.fs.doc(`/status/${uid}`);
    const isOfflineFS = {
      state: 'offline',
      lastUpdatedAt: this.getTimestamp()
    };

    const isOnlineFS = {
      state: 'online',
      lastUpdatedAt: this.getTimestamp()
    };

    this.db.ref('.info/connected').on('value', snapshot => {
      if (snapshot.val() === false) {
        userStatusFSRef.set(isOfflineFS);
        return;
      }

      userStatusDBRef
        .onDisconnect()
        .set(isOfflineDB)
        .then(() => {
          userStatusDBRef.set(isOnlineDB);
          userStatusFSRef.set(isOnlineFS);
        });
    });
  };

  // Workspace API

  createWorkspace = ({ name, members }) => {};

  // User API

  getUserDoc = userId => this.fs.collection('users').doc(userId);

  createAccount = ({ userId, email, profile, workspace, workspaces }) => {

    if (workspaces.length > 0) {
      const batch = this.createBatch();
      workspaces.forEach(workspace => {
        this.updateBatch(batch, ['workspaces', workspace.id], {
          [`members.${userId}`]: {
            email,
            userId,
            name: profile.name,
            role: 'member',
            username: profile.username
          },
          invites: this.removeFromArray(email)
        });
      });
      batch
      .commit()
      .then(() => {
        console.log('added member to workspaces');
      })
      .catch(error => {
        console.error(error);
      });
    }

    if (workspace) {
      const { invites } = workspace;
      this.fs
      .collection('workspaces')
      .add({
        createdAt: this.getTimestamp(),
        name: workspace.name,
        members: {
          [userId]: {
            userId,
            email,
            name: profile.name,
            username: profile.username,
            role: 'owner'
          }
        },
        invites,
        ownerId: userId
      })
      .then(ref => {
        const { id: workspaceId } = ref;
        const from = {
          userId,
          username: profile.username,
          name: profile.name
        };
        this.createUser({
          userId,
          email,
          name: profile.name,
          username: profile.username,
          about: profile.about,
          workspaces: [...workspaces, { id: workspaceId, name: workspace.name}]
        });
        invites.forEach(emailInvite => {
          this.fs
            .collection('users')
            .where('email', '==', emailInvite)
            .get()
            .then(doc => {
              if (doc.exists) {
                this.createNotification({
                  userId: doc.id,
                  source: {
                    user: { ...from },
                    type: 'workspace',
                    id: workspaceId,
                    data: {
                      name: workspace.name
                    },
                    parent: null
                  },
                  event: {
                    type: 'invite',
                    publishedAt: this.getTimestamp()
                  }
                });
              } else {
                this.fs.collection('invites').add({
                  to: emailInvite,
                  publishedAt: this.getTimestamp(),
                  type: 'workspace',
                  data: {
                    id: workspaceId,
                    name: workspace.name
                  },
                  from: { ...from }
                });
              }
            });
        });
      });
    } else {
      this.createUser({
        userId,
        email,
        workspaces,
        name: profile.name,
        username: profile.username,
        about: profile.about
      });
    }
  };

  createUser = ({
    userId,
    name,
    username,
    email,
    about,
    workspaces,
    photoURL = null
  }) => {
    const batch = this.createBatch();
    this.setBatch(batch, ['users', userId], {
      userId,
      name,
      username,
      email,
      about,
      photoURL,
      workspaces: workspaces.map(workspace => ({
        ...workspace,
        folderIds: [0, 1, 2, 3]
      })),
      projectIds: [],
      settings: {
        activeWorkspace: workspaces[workspaces.length - 1],
        tasks: {
          view: 'all',
          sortBy: 'folder'
        }
      }
    });

    workspaces.forEach(workspace => {

    this.setBatch(batch, ['users', userId, 'workspaces', workspace.id, 'folders', '0'], {
      name: 'New Tasks',
      taskIds: [],
      workspaceId: workspace.id
    });

    this.setBatch(batch, ['users', userId, 'workspaces', workspace.id, 'folders', '1'], {
      name: 'Today',
      taskIds: [],
      workspaceId: workspace.id
    });

    this.setBatch(batch, ['users', userId, 'workspaces', workspace.id, 'folders', '2'], {
      name: 'Upcoming',
      taskIds: [],
      workspaceId: workspace.id
    });

    this.setBatch(batch, ['users', userId, 'workspaces', workspace.id, 'folders', '3'], {
      name: 'Later',
      taskIds: [],
      workspaceId: workspace.id
    });

    this.setBatch(batch, ['users', userId, 'workspaces', workspace.id, 'folders', '4'], {
      name: 'No Project',
      taskIds: [],
      workspaceId: workspace.id
    });

    this.setBatch(batch, ['users', userId, 'workspaces', workspace.id, 'folders', '5'], {
      name: 'No Due Date',
      taskIds: [],
      workspaceId: workspace.id
    });
    });

    return batch
      .commit()
      .then(() => {
        console.log('User added');
      })
      .catch(error => {
        console.log(error);
      });
  };

  updateUser = (userId, newValue = {}) =>
    this.fs
      .collection('users')
      .doc(userId)
      .update(newValue);

  // Tags API

  addTag = ({
    taskId,
    userId,
    name,
    projectId,
    color = 'default',
    projectCount,
    userCount
  }) => {
    const batch = this.fs.batch();
    const userTagRef = this.getDocRef('users', userId, 'tags', name);

    this.updateBatch(batch, ['tasks', taskId], {
      tags: this.addToArray(name)
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

  removeTag = (
    { taskId = null, name, userId, userCount, projectId, projectCount },
    batch = this.createBatch(),
    shouldCommit = true
  ) => {
    if (taskId) {
      this.updateBatch(batch, ['tasks', taskId], {
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
    const batch = this.fs.batch();
    const userTagRef = this.getDocRef('users', userId, 'tags', tag);
    if (projectId) {
      const projectRef = this.getDocRef('projects', projectId);
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

  getProjectDoc = projectId => this.fs.collection('projects').doc(projectId);

  updateProject = (projectId, newValue = {}) =>
    this.getProjectDoc(projectId).update({
      lastUpdatedAt: this.getTimestamp(),
      ...newValue
    });

  updateProjectName = ({ projectId, name }) => {
    const batch = this.createBatch();

    this.updateBatch(batch, ['projects', projectId], {
      name
    });

    // Update tasks assigned to list
    this.fs
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
    layout = 'board',
    isPrivate = false,
    memberIds = [],
    notes = null
  }) => {
    this.fs
      .collection('projects')
      .add({
        createdAt: this.getTimestamp(),
        lastUpdatedAt: null,
        listIds: [],
        ownerId: userId,
        settings: {
          isPrivate,
          layout,
          tasks: {
            view: 'all',
            sortBy: 'none'
          }
        },
        memberIds,
        notes,
        color,
        name
      })
      .then(ref => {
        const batch = this.createBatch();

        memberIds.forEach(memberId => {
          this.updateBatch(batch, ['users', memberId], {
            projectIds: this.addToArray(ref.id)
          });
          batch.set(this.getDocRef('users', memberId, 'folders', ref.id), {
            name,
            taskIds: []
          });
        });

        return batch
          .commit()
          .then(() => {
            console.log(`Created Project: ${name}`);
          })
          .catch(error => {
            console.error(error);
          });
      });
  };

  // List API

  updateListName = ({ listId, name }) => {
    const batch = this.createBatch();

    this.updateBatch(batch, ['lists', listId], {
      name
    });

    // Update tasks assigned to list
    this.fs
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
            console.log('List name updated.');
          })
          .catch(error => {
            console.error(error);
          });
      });
  };

  addList = ({ name, projectId = null, userId = null }) => {
    this.fs
      .collection('lists')
      .add({
        ownerId: userId,
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
    const batch = this.createBatch();
    const listRef = this.getDocRef('lists', listId);

    // Delete list
    batch.delete(listRef);

    // Remove list id from project
    this.updateBatch(batch, ['projects', projectId], {
      listIds: this.removeFromArray(listId)
    });

    // Delete tasks assigned to list
    this.fs
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

  getTaskDoc = taskId => this.fs.collection('tasks').doc(taskId);

  addTask = ({
    name,
    projectId,
    projectName,
    listId,
    listName,
    userId,
    dueDate = null,
    folderId = null,
    assignedTo = []
  }) => {
    const isFolderItem = !!folderId;

    this.fs
      .collection('tasks')
      .add({
        ownerId: userId,
        createdAt: this.getTimestamp(),
        lastUpdatedAt: null,
        commentIds: [],
        subtaskIds: [],
        isCompleted: false,
        completedAt: null,
        notes: null,
        assignedTo: isFolderItem ? [userId] : assignedTo,
        folders: isFolderItem
          ? {
              [userId]: '0'
            }
          : {},
        dueDate,
        listId,
        listName,
        projectId,
        projectName,
        name
      })
      .then(ref => {
        if (isFolderItem) {
          const batch = this.createBatch();

          if (!projectId && folderId !== '4') {
            this.updateBatch(batch, ['users', userId, 'folders', '4'], {
              taskIds: this.addToArray(ref.id)
            });
          }

          if (!dueDate && folderId !== '5') {
            this.updateBatch(batch, ['users', userId, 'folders', '5'], {
              taskIds: this.addToArray(ref.id)
            });
          }

          if (dueDate) {
            console.log(`${+dueDate}`);
            batch.set(
              this.getDocRef('users', userId, 'folders', `${+dueDate}`),
              {
                taskIds: this.addToArray(ref.id)
              },
              { merge: true }
            );
          }

          if (folderId !== '0') {
            this.updateBatch(batch, ['users', userId, 'folders', '0'], {
              taskIds: this.addToArray(ref.id)
            });
          }

          this.updateBatch(batch, ['users', userId, 'folders', folderId], {
            taskIds: this.addToArray(ref.id)
          });

          return batch
            .commit()
            .then(() => {
              console.log('Added task');
            })
            .catch(error => {
              console.error(error);
            });
        }
        this.updateDoc(['lists', listId], {
          taskIds: this.addToArray(ref.id)
        });
      });
  };

  updateTask = (taskId, newValue = {}) => {
    console.log('task updated');
    this.getTaskDoc(taskId).update({
      lastUpdatedAt: this.getTimestamp(),
      ...newValue
    });
  };

  setTaskDueDate = ({ taskId, prevDueDate, newDueDate, assignedTo = [] }) => {
    const batch = this.createBatch();

    this.updateBatch(batch, ['tasks', taskId], {
      dueDate: newDueDate
    });

    if (assignedTo.length > 0) {
      assignedTo.forEach(userId => {
        if (prevDueDate === null) {
          this.updateBatch(batch, ['users', userId, 'folders', '5'], {
            taskIds: this.removeFromArray(taskId)
          });
        } else {
          batch.set(
            this.getDocRef('users', userId, 'folders', `${+prevDueDate}`),
            {
              taskIds: this.removeFromArray(taskId)
            },
            { merge: true }
          );
        }

        if (newDueDate === null) {
          this.updateBatch(batch, ['users', userId, 'folders', '5'], {
            taskIds: this.addToArray(taskId)
          });
        } else {
          batch.set(
            this.getDocRef('users', userId, 'folders', `${+newDueDate}`),
            {
              taskIds: this.addToArray(taskId)
            },
            { merge: true }
          );
        }
      });
    }

    return batch
      .commit()
      .then(() => {
        console.log('Set task due date');
      })
      .catch(error => {
        console.error(error);
      });
  };

  removeAssignee = (
    { projectId, userId, folderId, taskId = null, dueDate = null },
    batch = this.createBatch(),
    shouldCommit = true
  ) => {
    if (!taskId) {
      this.updateBatch(batch, ['users', userId], {
        projectIds: this.removeFromArray(projectId)
      });
      this.updateBatch(batch, ['projects', projectId], {
        memberIds: this.removeFromArray(userId)
      });
    } else {
      this.updateBatch(batch, ['users', userId, 'folders', folderId], {
        taskIds: this.removeFromArray(taskId)
      });

      if (!dueDate) {
        this.updateBatch(batch, ['users', userId, 'folders', '5'], {
          taskIds: this.removeFromArray(taskId)
        });
      } else {
        this.updateBatch(batch, ['users', userId, 'folders', `${+dueDate}`], {
          taskIds: this.removeFromArray(taskId)
        });
      }
      if (projectId) {
        this.updateBatch(batch, ['users', userId, 'folders', projectId], {
          taskIds: this.removeFromArray(taskId)
        });
      }
    }

    if (shouldCommit) {
      if (taskId) {
        this.updateBatch(batch, ['tasks', taskId], {
          assignedTo: this.removeFromArray(userId),
          [`folders.${userId}`]: this.deleteField()
        });
      }

      return batch
        .commit()
        .then(() => {
          console.log('Removed assignee');
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  addAssignee = ({
    projectId,
    projectName,
    userId,
    taskId = null,
    dueDate = null
  }) => {
    const batch = this.fs.batch();

    this.updateBatch(batch, ['projects', projectId], {
      memberIds: this.addToArray(userId)
    });

    this.updateBatch(batch, ['users', userId], {
      projectIds: this.addToArray(projectId)
    });

    if (taskId) {
      batch.set(
        this.getDocRef('users', userId, 'folders', projectId),
        {
          name: projectName,
          taskIds: this.addToArray(taskId)
        },
        { merge: true }
      );

      this.updateBatch(batch, ['users', userId, 'folders', '0'], {
        taskIds: this.addToArray(taskId)
      });
      this.updateBatch(batch, ['tasks', taskId], {
        assignedTo: this.addToArray(userId),
        [`folders.${userId}`]: '0'
      });

      if (!dueDate) {
        this.updateBatch(batch, ['users', userId, 'folders', '5'], {
          taskIds: this.addToArray(taskId)
        });
      } else {
        batch.set(
          this.getDocRef('users', userId, 'folders', `${+dueDate}`),
          {
            taskIds: this.addToArray(taskId)
          },
          { merge: true }
        );
      }
    }

    return batch
      .commit()
      .then(() => {
        console.log('Added assignee');
      })
      .catch(error => {
        console.error(error);
      });
  };

  deleteTask = (
    {
      taskId,
      assignedTo,
      folders,
      subtaskIds,
      commentIds,
      dueDate = null,
      listId = null,
      projectId = null
    },
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

        if (!projectId) {
          this.updateBatch(batch, ['users', userId, 'folders', '4'], {
            taskIds: this.removeFromArray(taskId)
          });
        } else {
          this.updateBatch(batch, ['users', userId, 'folders', projectId], {
            taskIds: this.removeFromArray(taskId)
          });
        }

        if (!dueDate) {
          this.updateBatch(batch, ['users', userId, 'folders', '5'], {
            taskIds: this.removeFromArray(taskId)
          });
        } else {
          this.updateBatch(
            batch,
            ['users', userId, 'folders', `${dueDate.toMillis()}`],
            {
              taskIds: this.removeFromArray(taskId)
            }
          );
        }
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

  moveTaskToList = ({
    taskId,
    origListId,
    newListId,
    updatedTaskIds,
    newListName
  }) => {
    const batch = this.createBatch();
    this.updateBatch(batch, ['tasks', taskId], {
      listId: newListId,
      listName: newListName
    });

    this.updateBatch(batch, ['lists', origListId], {
      taskIds: this.removeFromArray(taskId)
    });

    this.updateBatch(batch, ['lists', newListId], {
      taskIds: updatedTaskIds
    });

    return batch
      .commit()
      .then(() => {
        console.log(`Moved task to ${newListName}`);
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
    updatedTaskIds,
    type = 'default'
  }) => {
    const batch = this.createBatch();

    switch (type) {
      case 'dueDate': {
        this.updateBatch(batch, ['tasks', taskId], {
          dueDate: new Date(+newFolderId)
        });
        break;
      }
      default: {
        this.updateBatch(batch, ['tasks', taskId], {
          [`folders.${userId}`]: newFolderId
        });
      }
    }

    this.updateBatch(batch, ['users', userId, 'folders', origFolderId], {
      taskIds: this.removeFromArray(taskId)
    });
    this.updateBatch(batch, ['users', userId, 'folders', newFolderId], {
      taskIds: updatedTaskIds
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

  getSubtaskDoc = subtaskId => this.fs.collection('subtasks').doc(subtaskId);

  addSubtask = ({
    userId,
    name,
    memberIds = [],
    projectId = null,
    taskId = null,
    dueDate = null
  }) => {
    this.fs
      .collection('subtasks')
      .add({
        createdAt: this.getTimestamp(),
        lastUpdatedAt: null,
        isCompleted: false,
        ownerId: userId,
        assignedTo: [userId, ...memberIds],
        completedAt: null,
        dueDate,
        projectId,
        taskId,
        name
      })
      .then(ref => {
        if (taskId === null) return;
        this.updateDoc(['tasks', taskId], {
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
      this.updateBatch(batch, ['tasks', taskId], {
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

  addComment = ({
    from,
    to = [],
    projectId = null,
    taskId = null,
    content,
    createdAt = this.getTimestamp()
  }) => {
    this.fs
      .collection('comments')
      .add({
        createdAt,
        lastUpdatedAt: null,
        isPinned: false,
        likes: {},
        from,
        to,
        projectId,
        taskId,
        content
      })
      .then(ref => {
        this.updateDoc(['tasks', taskId], {
          commentIds: this.addToArray(ref.id)
        });

        if (to.length > 0) {
          to.forEach(user => {
            this.createNotification({
              userId: user.userId,
              source: {
                user: from,
                type: 'comment',
                id: ref.id,
                parent: {
                  type: taskId ? 'task' : 'project',
                  id: taskId || projectId
                }
              },
              event: {
                type: 'mention',
                publishedAt: createdAt
              }
            });
          });
        }
      });
  };

  /**
   * @param {String} userId - user id of recipient
   * @param {Object} source - info about where and by whom the event was triggered { userId, taskId, commentId, projectId }
   * @param {Object} event - info about event itself {type: mention, update, or reminder, publishedAt, data }
   */

  createNotification = ({ userId, source, event }) => {
    this.getDocRef('users', userId)
      .collection('notifications')
      .add({
        source,
        event,
        createdAt: this.getTimestamp(),
        isActive: true
      });
  };
}

export default Firebase;
