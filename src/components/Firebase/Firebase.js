import * as firebase from 'firebase/app';

require('firebase/database');
require('firebase/auth');
require('firebase/firestore');

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
    this.fs = firebase.firestore();
    this.db = firebase.database();
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
    const provider = new firebase.auth.GoogleAuthProvider();
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
    const provider = new firebase.auth.GithubAuthProvider();
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

  sendPasswordResetEmail = email => this.auth.sendPasswordResetEmail(email);

  getEmailAuthCredential = (email, password) =>
    firebase.auth.EmailAuthProvider.credential(email, password);

  reauthenticateWithEmailAuthCredential = (email, password) => {
    const credential = this.getEmailAuthCredential(email, password);
    return this.currentUser.reauthenticateAndRetrieveDataWithCredential(
      credential
    );
  };

  updatePassword = newPassword => this.currentUser.updatePassword(newPassword);

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

  getTimestamp = () => firebase.firestore.FieldValue.serverTimestamp();

  addToArray = value => firebase.firestore.FieldValue.arrayUnion(value);

  removeFromArray = value => firebase.firestore.FieldValue.arrayRemove(value);

  deleteField = () => firebase.firestore.FieldValue.delete();

  plus = value => firebase.firestore.FieldValue.increment(value);

  minus = value => firebase.firestore.FieldValue.increment(-value);

  getDocRef = (...args) => {
    try {
      if (args.length % 2 !== 0) {
        throw new Error(
          'Invalid Argument: Must follow pattern `collection/subcollection...`'
        );
      }
      const path = args.join('/');
      return this.fs.doc(path);
    } catch (error) {
      console.error(error);
    }
  };

  getCollection = name => {
    return this.fs.collection(name);
  };

  queryCollection = (path, [field, comparisonOperator, value]) => {
    return this.fs.collection(path).where(field, comparisonOperator, value);
  };

  updateDoc = (path = [], newValue = {}) =>
    this.getDocRef(...path).update({
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
    return merge
      ? batch.set(doc, newValue, { merge: true })
      : batch.set(doc, newValue);
  };

  // User Presence

  initPresenceDetection = uid => {
    const userStatusDBRef = this.db.ref(`/status/${uid}`);
    const isOfflineDB = {
      state: 'offline',
      lastUpdatedAt: firebase.database.ServerValue.TIMESTAMP
    };

    const isOnlineDB = {
      state: 'online',
      lastUpdatedAt: firebase.database.ServerValue.TIMESTAMP
    };

    const userRefFS = this.getDocRef('users', uid);
    const offlineStatusFS = {
      state: 'offline',
      lastUpdatedAt: this.getTimestamp()
    };

    const onlineStatusFS = {
      state: 'online',
      lastUpdatedAt: this.getTimestamp()
    };

    this.db.ref('.info/connected').on('value', snapshot => {
      if (snapshot.val() === false) {
        userRefFS.update({
          status: offlineStatusFS
        });
        return;
      }

      userStatusDBRef
        .onDisconnect()
        .set(isOfflineDB)
        .then(() => {
          userStatusDBRef.set(isOnlineDB);
          userRefFS.update({
            status: onlineStatusFS
          });
        });
    });
  };

  // Workspace API

  createWorkspaceSettings = ({ userId, workspaceId }, batch = null) => {
    if (batch) {
      this.setBatch(batch, ['users', userId, 'workspaces', workspaceId], {
        folderIds: ['0', '1', '2', '3'],
        projectIds: []
      });
    } else {
      this.getDocRef('users', userId, 'workspaces', workspaceId).set({
        folderIds: ['0', '1', '2', '3'],
        projectIds: []
      });
    }
  };

  createWorkspace = ({ user, name, invites }) => {
    // Create workspace doc
    const { userId } = user;
    this.fs
      .collection('workspaces')
      .add({
        createdAt: this.getTimestamp(),
        name,
        memberIds: [userId],
        members: {
          [userId]: {
            userId,
            role: 'owner',
            activeTaskCount: 0,
            projectIds: []
          }
        },
        pendingInvites: invites,
        ownerId: userId,
        projectIds: []
      })
      .then(ref => {
        const workspaceId = ref.id;
        const batch = this.createBatch();
        // Create workspace settings
        this.createWorkspaceSettings({ userId, workspaceId }, batch);

        // Create workspace folders
        this.createWorkspaceFolders({ userId, workspaceId }, batch, false);

        // Update user doc
        this.updateBatch(batch, ['users', userId], {
          workspaceIds: this.addToArray(workspaceId),
          'settings.activeWorkspace': workspaceId,
          [`workspaces.${workspaceId}`]: {
            id: workspaceId,
            name
          }
        });
        // Send/store invites
        invites.forEach(email => {
          this.createWorkspaceInvite({
            email,
            workspaceId,
            workspaceName: name,
            from: { ...user }
          });
        });
        return batch
          .commit()
          .then(() => {
            console.log('created workspace');
          })
          .catch(error => {
            console.error(error);
          });
      });
  };

  acceptWorkspaceInvite = ({ user, workspace, from, notificationId }) => {
    const batch = this.createBatch();
    const { userId, email } = user;
    const { id: workspaceId, name: workspaceName } = workspace;

    // Update workspace
    this.updateBatch(batch, ['workspaces', workspaceId], {
      memberIds: this.addToArray(userId),
      pendingInvites: this.removeFromArray(email),
      [`members.${userId}`]: {
        userId,
        role: 'member',
        activeTaskCount: 0,
        projectIds: []
      }
    });

    // Update user
    this.updateBatch(batch, ['users', userId], {
      workspaceIds: this.addToArray(workspaceId),
      [`workspaces.${workspaceId}`]: {
        id: workspaceId,
        name: workspaceName
      }
    });

    // Send rsvp notification to inviter
    this.createNotification({
      recipientId: from,
      workspaceId,
      source: {
        user: {
          userId: user.userId,
          name: user.name
        },
        type: 'workspace',
        id: workspaceId,
        data: {
          name: workspaceName
        },
        parent: null
      },
      event: {
        type: 'rsvp',
        data: {
          state: 'accepted'
        },
        publishedAt: this.getTimestamp()
      }
    });

    // Create workspace subdoc
    this.createWorkspaceSettings({ userId, workspaceId }, batch);

    // Create workspace folders
    this.createWorkspaceFolders({ userId, workspaceId }, batch, false);

    // Update notification
    this.updateBatch(batch, ['notifications', notificationId], {
      isActionPending: false
    });

    return batch
      .commit()
      .then(() => {
        console.log('Accepted workspace invite');
      })
      .catch(error => {
        console.log(error);
      });
  };

  declineWorkspaceInvite = ({ user, workspace, from, notificationId }) => {
    const batch = this.createBatch();
    const { email } = user;
    const { id: workspaceId, name: workspaceName } = workspace;
    // Update workspace
    this.updateBatch(batch, ['workspaces', workspaceId], {
      pendingInvites: this.removeFromArray(email)
    });

    // Send rsvp notification to inviter
    this.createNotification({
      recipientId: from,
      workspaceId,
      source: {
        user: {
          userId: user.userId,
          name: user.name
        },
        type: 'workspace',
        id: workspaceId,
        data: {
          name: workspaceName
        },
        parent: null
      },
      event: {
        type: 'rsvp',
        data: {
          state: 'declined'
        },
        publishedAt: this.getTimestamp()
      }
    });

    // Update notification
    this.updateBatch(batch, ['notifications', notificationId], {
      isActionPending: false
    });

    return batch
      .commit()
      .then(() => {
        console.log('Declined workspace invite');
      })
      .catch(error => {
        console.log(error);
      });
  };

  updateWorkspaceName = async ({
    workspaceId,
    name,
    memberIds,
    pendingInvites
  }) => {
    const batch = this.createBatch();
    this.updateBatch(batch, ['workspaces', workspaceId], {
      name
    });
    memberIds.forEach(memberId => {
      this.updateBatch(batch, ['users', memberId], {
        [`workspaces.${workspaceId}.name`]: name
      });
    });

    if (pendingInvites.length > 0) {
      const [inviteRefs, notificationRefs] = await Promise.all([
        this.fs
          .collection('invites')
          .where('type', '==', 'workspace')
          .where('data.id', '==', workspaceId)
          .get()
          .then(snapshot => {
            let invites = [];
            snapshot.forEach(doc => {
              invites = invites.concat(doc.ref);
            });
            return invites;
          }),
        this.fs
          .collection('notifications')
          .where('event.type', '==', 'invite')
          .where('source.type', '==', 'workspace')
          .where('source.id', '==', workspaceId)
          .get()
          .then(snapshot => {
            let notifications = [];
            snapshot.forEach(doc => {
              notifications = [...notifications, doc.ref];
            });
            return notifications;
          })
      ]);
      inviteRefs.forEach(ref => {
        this.updateBatch(batch, ref, {
          'data.name': name
        });
      });
      notificationRefs.forEach(ref => {
        this.updateBatch(batch, ref, {
          'source.data.name': name
        });
      });
    }

    return batch
      .commit()
      .then(() => {
        console.log('Updated workspace name');
      })
      .catch(error => {
        console.log(error);
      });
  };

  // User API

  getUserDoc = userId => this.fs.collection('users').doc(userId);

  createAccount = ({ userId, email, profile, workspace, invites }) => {
    const workspaces = {};
    let workspaceIds = [];
    const from = {
      userId,
      name: profile.name
    };
    if (invites.length > 0) {
      const batch = this.createBatch();
      invites.forEach(invite => {
        const {
          isAccepted,
          from: { userId: inviterId },
          data: { id: workspaceId, name: workspaceName }
        } = invite;
        const inviteRef = this.getDocRef('invites', invite.id);
        batch.delete(inviteRef);
        this.createNotification({
          workspaceId,
          recipientId: inviterId,
          source: {
            user: { ...from },
            type: 'workspace',
            id: workspaceId,
            data: {
              name: workspaceName
            },
            parent: null
          },
          event: {
            type: 'rsvp',
            data: {
              state: isAccepted ? 'accepted' : 'declined'
            },
            publishedAt: this.getTimestamp()
          }
        });
        if (isAccepted) {
          workspaces[workspaceId] = {
            id: workspaceId,
            name: workspaceName
          };
          workspaceIds = workspaceIds.concat(workspaceId);
          this.updateBatch(batch, ['workspaces', workspaceId], {
            memberIds: this.addToArray(userId),
            pendingInvites: this.removeFromArray(email),
            [`members.${userId}`]: {
              userId,
              role: 'member',
              activeTaskCount: 0,
              projectIds: []
            }
          });
        } else {
          this.updateBatch(batch, ['workspaces', workspaceId], {
            pendingInvites: this.removeFromArray(email)
          });
        }
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
      this.fs
        .collection('workspaces')
        .add({
          createdAt: this.getTimestamp(),
          name: workspace.name,
          memberIds: [userId],
          members: {
            [userId]: {
              userId,
              role: 'owner',
              activeTaskCount: 0,
              projectIds: []
            }
          },
          pendingInvites: workspace.invites,
          ownerId: userId,
          projectIds: []
        })
        .then(ref => {
          const { id: workspaceId } = ref;
          this.createUser({
            userId,
            email,
            name: profile.name,
            displayName: profile.displayName || profile.name,
            about: profile.about,
            workspaceIds: [...workspaceIds, workspaceId],
            workspaces: {
              ...workspaces,
              [workspaceId]: {
                id: workspaceId,
                name: workspace.name
              }
            }
          });
          workspace.invites.forEach(emailTo => {
            this.createWorkspaceInvite({
              email: emailTo,
              workspaceId,
              workspaceName: workspace.name,
              from
            });
          });
        });
    } else {
      this.createUser({
        userId,
        email,
        workspaces,
        workspaceIds,
        name: profile.name,
        displayName: profile.displayName || profile.name,
        about: profile.about
      });
    }
  };

  createWorkspaceInvite = ({ email, workspaceId, workspaceName, from }) => {
    this.fs
      .collection('users')
      .where('email', '==', email)
      .get()
      .then(snapshot => {
        if (snapshot.size > 0) {
          snapshot.forEach(doc => {
            const { activeWorkspace } = doc.data().settings;
            this.createNotification({
              workspaceId: activeWorkspace,
              recipientId: doc.id,
              isActionPending: true,
              source: {
                user: from,
                type: 'workspace',
                id: workspaceId,
                data: {
                  name: workspaceName
                },
                parent: null
              },
              event: {
                type: 'invite',
                publishedAt: this.getTimestamp()
              }
            });
          });
        } else {
          this.fs.collection('invites').add({
            to: email,
            createdAt: this.getTimestamp(),
            type: 'workspace',
            data: {
              id: workspaceId,
              name: workspaceName
            },
            from
          });
        }
      });
  };

  createWorkspaceFolders = (
    { userId, workspaceId },
    batch = this.createBatch,
    shouldCommit = true
  ) => {
    this.setBatch(
      batch,
      ['users', userId, 'workspaces', workspaceId, 'folders', '0'],
      {
        name: 'New Tasks',
        taskIds: [],
        workspaceId
      }
    );

    this.setBatch(
      batch,
      ['users', userId, 'workspaces', workspaceId, 'folders', '1'],
      {
        name: 'Today',
        taskIds: [],
        workspaceId
      }
    );

    this.setBatch(
      batch,
      ['users', userId, 'workspaces', workspaceId, 'folders', '2'],
      {
        name: 'Upcoming',
        taskIds: [],
        workspaceId
      }
    );

    this.setBatch(
      batch,
      ['users', userId, 'workspaces', workspaceId, 'folders', '3'],
      {
        name: 'Later',
        taskIds: [],
        workspaceId
      }
    );

    this.setBatch(
      batch,
      ['users', userId, 'workspaces', workspaceId, 'folders', '4'],
      {
        name: 'No Project',
        taskIds: [],
        workspaceId
      }
    );

    this.setBatch(
      batch,
      ['users', userId, 'workspaces', workspaceId, 'folders', '5'],
      {
        name: 'No Due Date',
        taskIds: [],
        workspaceId
      }
    );
    if (shouldCommit) {
      return batch
        .commit()
        .then(() => {
          console.log('Created user folders');
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  createUser = ({
    userId,
    name,
    displayName,
    email,
    about,
    workspaces,
    workspaceIds,
    photoURL = null
  }) => {
    const batch = this.createBatch();
    this.setBatch(batch, ['users', userId], {
      userId,
      name,
      displayName,
      email,
      about,
      photoURL,
      workspaces,
      workspaceIds,
      linkedin: '',
      github: '',
      createdAt: this.getTimestamp(),
      settings: {
        activeWorkspace: workspaceIds[workspaceIds.length - 1],
        tasks: {
          view: 'all',
          sortBy: 'folder'
        }
      }
    });

    workspaceIds.forEach(workspaceId => {
      this.createWorkspaceSettings({ userId, workspaceId }, batch);
      this.createWorkspaceFolders({ userId, workspaceId }, batch, false);
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

  updateUserName = async ({ userId, name }) => {
    const batch = this.createBatch();
    this.updateBatch(batch, ['users', userId], {
      name
    });
    const [inviteRefs, notificationRefs] = await Promise.all([
      this.queryCollection('invites', ['from.userId', '==', userId])
        .get()
        .then(snapshot => {
          let invites = [];
          snapshot.forEach(doc => {
            invites = invites.concat(doc.ref);
          });
          return invites;
        }),
      this.queryCollection('notifications', [
        'source.user.userId',
        '==',
        userId
      ])
        .get()
        .then(snapshot => {
          let notifications = [];
          snapshot.forEach(doc => {
            notifications = notifications.concat(doc.ref);
          });
          return notifications;
        })
    ]);

    inviteRefs.forEach(ref => {
      this.updateBatch(batch, ref, {
        'from.name': name
      });
    });

    notificationRefs.forEach(ref => {
      this.updateBatch(batch, ref, {
        'source.user.name': name
      });
    });
    return batch
      .commit()
      .then(() => {
        console.log('Updated user name');
      })
      .catch(error => {
        console.error(error);
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
    const batch = this.createBatch();
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
    workspaceId,
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
        name,
        workspaceId
      })
      .then(ref => {
        const batch = this.createBatch();
        const { id: projectId } = ref;
        memberIds.forEach(memberId => {
          this.updateBatch(
            batch,
            ['users', memberId, 'workspaces', workspaceId],
            {
              projectIds: this.addToArray(projectId)
            }
          );
          this.updateBatch(batch, ['workspaces', workspaceId], {
            projectIds: this.addToArray(projectId),
            [`members.${userId}.projectIds`]: this.addToArray(projectId)
          });
          this.setBatch(
            batch,
            [
              'users',
              memberId,
              'workspaces',
              workspaceId,
              'folders',
              projectId
            ],
            {
              name,
              taskIds: []
            }
          );
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

  addList = ({ name, userId, workspaceId, projectId }) => {
    this.fs
      .collection('lists')
      .add({
        ownerId: userId,
        createdAt: this.getTimestamp(),
        lastUpdatedAt: null,
        taskIds: [],
        projectId,
        name,
        workspaceId
      })
      .then(ref => {
        this.updateDoc(['projects', projectId], {
          listIds: this.addToArray(ref.id)
        });
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
    workspaceId,
    dueDate = null,
    folderId = null,
    assignedTo = [],
    isPrivate = false
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
        name,
        workspaceId,
        isPrivate
      })
      .then(ref => {
        const { id: taskId } = ref;
        const batch = this.createBatch();

        if (listId) {
          this.updateBatch(batch, ['lists', listId], {
            taskIds: this.addToArray(taskId)
          });
          if (assignedTo.length > 0) {
            assignedTo.forEach(memberId => {
              this.updateBatch(batch, ['workspaces', workspaceId], {
                [`members.${memberId}.activeTaskCount`]: this.plus(1)
              });
            });
          }
        }

        if (isFolderItem) {
          this.updateBatch(batch, ['workspaces', workspaceId], {
            [`members.${userId}.activeTaskCount`]: this.plus(1)
          });

          if (!projectId && folderId !== '4') {
            this.updateBatch(
              batch,
              ['users', userId, 'workspaces', workspaceId, 'folders', '4'],
              {
                taskIds: this.addToArray(taskId)
              }
            );
          }

          if (!dueDate && folderId !== '5') {
            this.updateBatch(
              batch,
              ['users', userId, 'workspaces', workspaceId, 'folders', '5'],
              {
                taskIds: this.addToArray(taskId)
              }
            );
          }

          if (dueDate) {
            console.log(`${+dueDate}`);
            batch.set(
              this.getDocRef(
                'users',
                userId,
                'workspaces',
                workspaceId,
                'folders',
                `${+dueDate}`
              ),
              {
                taskIds: this.addToArray(taskId)
              },
              { merge: true }
            );
          }

          if (folderId !== '0') {
            this.updateBatch(
              batch,
              ['users', userId, 'workspaces', workspaceId, 'folders', '0'],
              {
                taskIds: this.addToArray(taskId)
              }
            );
          }

          this.updateBatch(
            batch,
            ['users', userId, 'workspaces', workspaceId, 'folders', folderId],
            {
              taskIds: this.addToArray(taskId)
            }
          );
        }
        return batch
          .commit()
          .then(() => {
            console.log('Added task');
          })
          .catch(error => {
            console.error(error);
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

  setTaskDueDate = ({
    taskId,
    prevDueDate,
    newDueDate,
    workspaceId,
    assignedTo = []
  }) => {
    const batch = this.createBatch();

    this.updateBatch(batch, ['tasks', taskId], {
      dueDate: newDueDate
    });

    if (assignedTo.length > 0) {
      assignedTo.forEach(userId => {
        if (prevDueDate === null) {
          this.updateBatch(
            batch,
            ['users', userId, 'workspaces', workspaceId, 'folders', '5'],
            {
              taskIds: this.removeFromArray(taskId)
            }
          );
        } else {
          batch.set(
            this.getDocRef(
              'users',
              userId,
              'workspaces',
              workspaceId,
              'folders',
              `${+prevDueDate}`
            ),
            {
              taskIds: this.removeFromArray(taskId)
            },
            { merge: true }
          );
        }

        if (newDueDate === null) {
          this.updateBatch(
            batch,
            ['users', userId, 'workspaces', workspaceId, 'folders', '5'],
            {
              taskIds: this.addToArray(taskId)
            }
          );
        } else {
          batch.set(
            this.getDocRef(
              'users',
              userId,
              'workspaces',
              workspaceId,
              'folders',
              `${+newDueDate}`
            ),
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
    { projectId, userId, folderId, workspaceId, taskId = null, dueDate = null },
    batch = this.createBatch(),
    shouldCommit = true
  ) => {
    if (!taskId) {
      this.updateBatch(batch, ['users', userId, 'workspaces', workspaceId], {
        projectIds: this.removeFromArray(projectId)
      });
      this.updateBatch(batch, ['projects', projectId], {
        memberIds: this.removeFromArray(userId)
      });
      this.updateBatch(batch, ['workspaces', workspaceId], {
        [`members.${userId}.projectIds`]: this.removeFromArray(projectId)
      });
    } else {
      this.updateBatch(
        batch,
        ['users', userId, 'workspaces', workspaceId, 'folders', folderId],
        {
          taskIds: this.removeFromArray(taskId)
        }
      );

      this.updateBatch(batch, ['workspaces', workspaceId], {
        [`members.${userId}.activeTaskCount`]: this.minus(1)
      });

      if (!dueDate) {
        this.updateBatch(
          batch,
          ['users', userId, 'workspaces', workspaceId, 'folders', '5'],
          {
            taskIds: this.removeFromArray(taskId)
          }
        );
      } else {
        this.updateBatch(
          batch,
          [
            'users',
            userId,
            'workspaces',
            workspaceId,
            'folders',
            `${+dueDate}`
          ],
          {
            taskIds: this.removeFromArray(taskId)
          }
        );
      }
      if (projectId) {
        this.updateBatch(
          batch,
          ['users', userId, 'workspaces', workspaceId, 'folders', projectId],
          {
            taskIds: this.removeFromArray(taskId)
          }
        );
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
    workspaceId,
    taskId = null,
    dueDate = null
  }) => {
    const batch = this.fs.batch();

    this.updateBatch(batch, ['projects', projectId], {
      memberIds: this.addToArray(userId)
    });

    this.updateBatch(batch, ['workspaces', workspaceId], {
      [`members.${userId}.projectIds`]: this.addToArray(projectId),
      [`members.${userId}.activeTaskCount`]: this.plus(taskId ? 1 : 0)
    });

    this.updateBatch(batch, ['users', userId, 'workspaces', workspaceId], {
      projectIds: this.addToArray(projectId)
    });

    if (taskId) {
      batch.set(
        this.getDocRef(
          'users',
          userId,
          'workspaces',
          workspaceId,
          'folders',
          projectId
        ),
        {
          name: projectName,
          taskIds: this.addToArray(taskId)
        },
        { merge: true }
      );

      this.updateBatch(
        batch,
        ['users', userId, 'workspaces', workspaceId, 'folders', '0'],
        {
          taskIds: this.addToArray(taskId)
        }
      );
      this.updateBatch(batch, ['tasks', taskId], {
        assignedTo: this.addToArray(userId),
        [`folders.${userId}`]: '0'
      });

      if (!dueDate) {
        this.updateBatch(
          batch,
          ['users', userId, 'workspaces', workspaceId, 'folders', '5'],
          {
            taskIds: this.addToArray(taskId)
          }
        );
      } else {
        batch.set(
          this.getDocRef(
            'users',
            userId,
            'workspaces',
            workspaceId,
            'folders',
            `${+dueDate}`
          ),
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
      projectId = null,
      workspaceId
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
        const folderRef = this.getDocRef(
          'users',
          userId,
          'workspaces',
          workspaceId,
          'folders',
          folderId
        );
        this.updateBatch(batch, ['workspaces', workspaceId], {
          [`members.${userId}.activeTaskCount`]: this.minus(1)
        });

        this.updateBatch(batch, folderRef, {
          taskIds: this.removeFromArray(taskId)
        });

        if (!projectId) {
          this.updateBatch(
            batch,
            ['users', userId, 'workspaces', workspaceId, 'folders', '4'],
            {
              taskIds: this.removeFromArray(taskId)
            }
          );
        } else {
          this.updateBatch(
            batch,
            ['users', userId, 'workspaces', workspaceId, 'folders', projectId],
            {
              taskIds: this.removeFromArray(taskId)
            }
          );
        }

        if (!dueDate) {
          this.updateBatch(
            batch,
            ['users', userId, 'workspaces', workspaceId, 'folders', '5'],
            {
              taskIds: this.removeFromArray(taskId)
            }
          );
        } else {
          this.updateBatch(
            batch,
            [
              'users',
              userId,
              'workspaces',
              workspaceId,
              'folders',
              `${dueDate.toMillis()}`
            ],
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
    workspaceId,
    type = 'default'
  }) => {
    const batch = this.createBatch();

    switch (type) {
      case 'dueDate': {
        this.updateBatch(batch, ['tasks', taskId], {
          dueDate: newFolderId === '5' ? null : new Date(+newFolderId)
        });
        break;
      }
      default: {
        this.updateBatch(batch, ['tasks', taskId], {
          [`folders.${userId}`]: newFolderId
        });
      }
    }

    this.updateBatch(
      batch,
      ['users', userId, 'workspaces', workspaceId, 'folders', origFolderId],
      {
        taskIds: this.removeFromArray(taskId)
      }
    );
    this.updateBatch(
      batch,
      ['users', userId, 'workspaces', workspaceId, 'folders', newFolderId],
      {
        taskIds: updatedTaskIds
      }
    );
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
    workspaceId,
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
        name,
        workspaceId
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
    content,
    workspaceId,
    to = [],
    projectId = null,
    taskId = null,
    createdAt = this.getTimestamp()
  }) => {
    this.fs
      .collection('comments')
      .add({
        createdAt,
        from,
        to,
        projectId,
        taskId,
        content,
        workspaceId,
        lastUpdatedAt: null,
        isPinned: false,
        likes: {}
      })
      .then(ref => {
        if (taskId) {
          this.updateDoc(['tasks', taskId], {
            commentIds: this.addToArray(ref.id)
          });
        }

        if (to.length > 0) {
          to.forEach(user => {
            this.createNotification({
              workspaceId,
              recipientId: user.userId,
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

  createNotification = ({
    recipientId,
    workspaceId,
    source,
    event,
    isActionPending = false
  }) => {
    return this.fs.collection('notifications').add({
      recipientId,
      workspaceId,
      source,
      event,
      isActionPending,
      createdAt: this.getTimestamp(),
      isActive: true
    });
  };
}

export default Firebase;
