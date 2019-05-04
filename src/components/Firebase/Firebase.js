import * as firebase from 'firebase/app';

require('firebase/database');
require('firebase/auth');
require('firebase/firestore');
require('firebase/storage');

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
    this.storage = firebase.storage();
  }

  // Auth API

  get currentUser() {
    return this.auth.currentUser;
  }

  // Refreshes current user, if signed in
  reload = () => {
    this.currentUser.reload();
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

  signInAsGuest = () => {
    return this.auth.signInAnonymously().then(user => console.log(user));
  };

  createUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  signInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  signOut = () => this.auth.signOut();

  sendPasswordResetEmail = email => {
    const actionCodeSettings = {
      url: `${process.env.REACT_APP_BASE_URL}/login`,
      handleCodeInApp: true
    };
    return this.auth.sendPasswordResetEmail(email, actionCodeSettings);
  };

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
    console.log(this.currentUser);
    return this.currentUser.sendEmailVerification(actionCodeSettings);
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
    this.getDocRef(...path)
      .update({
        lastUpdatedAt: this.getTimestamp(),
        ...newValue
      })
      .catch(error => {
        console.error(`Error updating document at path '${path}': ${error}`);
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

  createDemoProject = userId => {
    return this.cloneProject(
      {
        name: 'Tutorial',
        userId,
        projectId: process.env.REACT_APP_DEMO_PROJECT_ID,
        workspaceId: 'DEMO'
      },
      {
        includeNotes: true,
        includeSubtasks: true,
        includeMembers: true,
        isDemo: true
      }
    )
      .then(() => {
        console.log('created demo project');
      })
      .catch(error => {
        console.error(error);
      });
  };

  createGuest = userId => {
    return this.createUser({
      userId,
      name: 'Guest',
      displayName: 'Guest',
      email: 'guest@workspace.com',
      about: '',
      role: 'guest',
      isGuest: true,
      workspaceIds: ['DEMO'],
      workspaces: {
        DEMO: {
          id: 'DEMO',
          name: 'Demo'
        }
      }
    })
      .then(() => {
        console.log('Guest created');
        return this.updateDoc('workspaces', 'DEMO', {
          [`members.${userId}.activeTaskCount`]: 0,
          [`members.${userId}.role`]: 'guest',
          memberIds: this.addToArray(userId)
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  deleteGuest = userId => {};

  deactivateAccount = async (userId, options = {}) => {
    const isGuest = 'isGuest' in options ? options.isGuest : false;
    // Delete workspace folders
    const workspaceIds = await this.getCollection(`users/${userId}/workspaces`)
      .get()
      .then(snapshot => {
        let workspaces = [];
        snapshot.forEach(workspaceDoc => {
          workspaces = workspaces.concat(workspaceDoc.id);
        });
        return workspaces;
      })
      .catch(error => {
        console.error(error);
      });
    return Promise.all([
      this.getCollection(`users/${userId}/tags`)
        .get()
        .then(tagSnapshot => {
          const tagBatch = this.createBatch();
          tagSnapshot.forEach(tagDoc => {
            return tagBatch.delete(tagDoc.ref);
          });
          return tagBatch.commit().then(() => {
            console.log('Deleted user tags');
          });
        }),
      this.queryCollection('notifications', ['recipientId', '==', userId])
        .get()
        .then(notificationSnapshot => {
          const notificationBatch = this.createBatch();
          notificationSnapshot.forEach(notificationDoc => {
            notificationBatch.delete(notificationDoc.ref);
          });
          return notificationBatch.commit().then(() => {
            console.log('Deleted user notifications');
          });
        }),
      ...workspaceIds.map(async workspaceId => {
        const workspaceBatch = this.createBatch();

        workspaceBatch.delete(
          this.getDocRef('users', userId, 'workspaces', workspaceId)
        );
        const workspaceData = await this.getDocRef('workspaces', workspaceId)
          .get()
          .then(workspaceSnap => {
            return workspaceSnap.data();
          });
        const { memberIds, members, pendingInvites } = workspaceData;
        const { projectIds, role } = members[userId];
        if (memberIds.length === 1) {
          // Delete projects
          projectIds.forEach(async projectId => {
            const projectData = await this.getDocRef('projects', projectId)
              .get()
              .then(projectSnapshot => {
                return projectSnapshot.data();
              });
            const { listIds } = projectData;
            this.deleteProject({
              userId,
              projectId,
              workspaceId,
              listIds
            });
          });
          // Delete workspace invites
          if (pendingInvites.length > 0) {
            const inviteBatch = this.createBatch();
            const [inviteRefs, notificationRefs] = await Promise.all([
              this.queryCollection('invites', ['type', '==', 'workspace'])
                .where('data.id', '==', workspaceId)
                .get()
                .then(inviteSnapshot => {
                  let invites = [];
                  inviteSnapshot.forEach(inviteDoc => {
                    invites = invites.concat(inviteDoc.ref);
                  });
                  return invites;
                }),
              this.queryCollection('notifications', [
                'event.type',
                '==',
                'invite'
              ])
                .where('source.type', '==', 'workspace')
                .where('source.id', '==', workspaceId)
                .get()
                .then(notificationSnapshot => {
                  let notifications = [];
                  notificationSnapshot.forEach(notificationDoc => {
                    notifications = [...notifications, notificationDoc.ref];
                  });
                  return notifications;
                })
            ]);
            [...inviteRefs, ...notificationRefs].forEach(ref => {
              inviteBatch.delete(ref);
            });
            inviteBatch.commit().catch(error => {
              console.error(error);
            });
          }
          workspaceBatch.delete(this.getDocRef('workspaces', workspaceId));
        } else {
          let deletedProjects = [null];
          projectIds.forEach(async projectId => {
            const projectData = await this.getDocRef('projects', projectId)
              .get()
              .then(projectSnapshot => {
                return projectSnapshot.data();
              });
            const { memberIds: projectMembers, listIds, isDemo } = projectData;
            const filteredMembers = projectMembers.filter(
              projectMemberId => projectMemberId !== userId
            );
            if (projectMembers.length > 1 && !isGuest) {
              const newOwnerId = filteredMembers[0];
              this.updateBatch(workspaceBatch, ['projects', projectId], {
                ownerId: newOwnerId,
                memberIds: this.removeFromArray(userId)
              });
            } else {
              deletedProjects = deletedProjects.concat(projectId);
              this.deleteProject(
                {
                  userId,
                  projectId,
                  workspaceId,
                  listIds,
                  memberIds: isGuest ? filteredMembers : []
                },
                workspaceBatch,
                false
              );
            }
          });
          if (role === 'owner') {
            const newOwnerId = memberIds.filter(
              memberId => memberId !== userId
            )[0];
            this.updateBatch(workspaceBatch, ['workspaces', workspaceId], {
              memberIds: this.removeFromArray(userId),
              projectIds: this.removeFromArray(...deletedProjects),
              [`members.${userId}`]: this.deleteField(),
              [`members.${newOwnerId}.role`]: 'owner'
            }).catch(error => {
              console.error(`Error updating projects: ${error}`);
            });
          } else {
            this.updateBatch(workspaceBatch, ['workspaces', workspaceId], {
              memberIds: this.removeFromArray(userId),
              projectIds: this.removeFromArray(...deletedProjects),
              [`members.${userId}`]: this.deleteField()
            });
          }
        }
        return workspaceBatch.commit();
      })
    ])
      .then(() => {
        workspaceIds.forEach(workspaceId => {
          this.getCollection(
            `users/${userId}/workspaces/${workspaceId}/folders`
          )
            .get()
            .then(folderSnapshot => {
              const folderBatch = this.createBatch();
              folderSnapshot.forEach(folderDoc => {
                folderBatch.delete(folderDoc.ref);
              });
              return folderBatch.commit();
            });
        });
      })
      .then(async () => {
        // Remove user from task assignments
        const taskBatch = await this.queryCollection('tasks', [
          'assignedTo',
          'array-contains',
          userId
        ])
          .get()
          .then(taskSnapshot => {
            const batch = this.createBatch();
            taskSnapshot.forEach(taskDoc => {
              this.updateBatch(batch, taskDoc.ref, {
                assignedTo: this.removeFromArray(userId)
              });
            });
            return batch;
          });
        return taskBatch.commit().then(() => {
          console.log('Account deactivation: removed user from assigned tasks');
        });
      })
      .then(() => {
        return this.db.ref(`status/${userId}`).remove();
      })
      .then(() => {
        return this.getDocRef('users', userId).delete();
      })
      .then(() => {
        return this.currentUser.delete();
      })
      .catch(error => {
        console.error(error);
      });
  };

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
    photoURL = null,
    role = 'member',
    isGuest = false
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
      role,
      isGuest,
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

  addTag = ({ taskId, userId, name, projectId, color = 'default' }) => {
    const batch = this.createBatch();

    this.updateBatch(batch, ['tasks', taskId], {
      tagIds: this.addToArray(name),
      [`tags.${name}`]: {
        name,
        color
      }
    });

    if (!projectId) {
      this.setBatch(
        batch,
        ['users', userId, 'tags', name],
        {
          name,
          color,
          count: this.plus(1)
        },
        true
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

  removeTag = ({ taskId, name, userId, projectId }) => {
    if (!projectId) {
      this.updateDoc(['users', userId, 'tags', name], {
        count: this.minus(1)
      });
    }

    return this.updateDoc(['tasks', taskId], {
      tagIds: this.removeFromArray(name),
      [`tags.${name}`]: this.deleteField()
    });
  };

  setTagColor = ({ userId, projectId, taskId, tag, color }) => {
    const batch = this.createBatch();
    this.updateBatch(batch, ['tasks', taskId], {
      [`tags.${tag}.color`]: color
    });

    if (!projectId) {
      this.updateBatch(batch, ['users', userId, 'tags', tag], {
        color
      });
    }

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

  cloneProject = async (
    { name, userId, projectId, workspaceId },
    {
      includeNotes = true,
      includeSubtasks = true,
      includeMembers = true,
      isDemo = false
    }
  ) => {
    const [project, listsById, tasksById, subtasksById] = await Promise.all([
      this.getDocRef('projects', projectId)
        .get()
        .then(snapshot => {
          return snapshot.data();
        }),
      this.queryCollection('lists', ['projectId', '==', projectId])
        .get()
        .then(snapshot => {
          const lists = {};
          snapshot.forEach(doc => {
            const listId = doc.id;
            const listData = doc.data();
            lists[listId] = {
              ...listData
            };
          });
          return lists;
        }),
      this.queryCollection('tasks', ['projectId', '==', projectId])
        .get()
        .then(snapshot => {
          const tasks = {};
          snapshot.forEach(doc => {
            const taskId = doc.id;
            const taskData = doc.data();
            tasks[taskId] = {
              ...taskData
            };
          });
          return tasks;
        }),
      includeSubtasks
        ? this.queryCollection('subtasks', ['projectId', '==', projectId])
            .get()
            .then(snapshot => {
              const subtasks = {};
              snapshot.forEach(doc => {
                const subtaskId = doc.id;
                const subtaskData = doc.data();
                subtasks[subtaskId] = {
                  ...subtaskData
                };
              });
              return subtasks;
            })
        : () => null
    ]);
    const clonedProjectId = await this.createProject({
      ...project,
      name,
      notes: includeNotes ? project.notes : null,
      memberIds: isDemo
        ? [...project.memberIds, userId]
        : includeMembers
        ? project.memberIds
        : [userId],
      userId,
      workspaceId,
      isDuplicate: true,
      isDemo
    });
    console.log(clonedProjectId);
    project.listIds.forEach(async listId => {
      const list = listsById[listId];
      const { name, taskIds } = list;
      console.log(clonedProjectId);
      const clonedListId = await this.createList({
        name,
        userId,
        projectId: clonedProjectId,
        workspaceId
      });
      taskIds.forEach(async taskId => {
        const task = tasksById[taskId];
        const { subtaskIds } = task;
        const clonedTaskId = await this.createTask({
          ...task,
          projectId: clonedProjectId,
          projectName: name,
          listId: clonedListId,
          userId,
          workspaceId
        });
        if (includeSubtasks) {
          subtaskIds.forEach(subtaskId => {
            const subtask = subtasksById[subtaskId];
            this.createSubtask({
              ...subtask,
              userId,
              workspaceId,
              projectId: clonedProjectId,
              taskId: clonedTaskId
            });
          });
        }
      });
    });
  };

  createProject = async ({
    userId,
    name,
    workspaceId,
    color = 'default',
    layout = 'board',
    isPrivate = false,
    memberIds = [],
    notes = null,
    isDuplicate = false,
    isDemo = false
  }) => {
    const projectId = await this.fs
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
        workspaceId,
        isDuplicate,
        isDemo
      })
      .then(ref => {
        return ref.id;
      })
      .catch(error => {
        console.error(error.message);
      });

    console.log(projectId);

    const batch = this.createBatch();
    memberIds.forEach(memberId => {
      this.updateBatch(batch, ['users', memberId, 'workspaces', workspaceId], {
        projectIds: this.addToArray(projectId)
      });
      this.updateBatch(batch, ['workspaces', workspaceId], {
        projectIds: this.addToArray(projectId),
        [`members.${memberId}.projectIds`]: this.addToArray(projectId)
      });
    });

    return batch
      .commit()
      .then(() => {
        console.log(`Created Project: ${name}`);
        return projectId;
      })
      .catch(error => {
        console.error(error.message);
      });
  };

  deleteProject = async (
    { userId, projectId, workspaceId, listIds, memberIds = [] },
    batch = this.createBatch(),
    shouldCommit = true
  ) => {
    const projectRef = this.getDocRef('projects', projectId);
    batch.delete(projectRef);
    // delete tasks
    this.queryCollection('tasks', ['projectId', '==', projectId])
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const taskId = doc.id;
          const taskData = doc.data();
          this.deleteTask(
            {
              taskId,
              ...taskData,
              userId,
              listId: null
            },
            {
              deleteMode: 'project'
            }
          );
        });
      })
      .catch(error => {
        console.error(error);
      });
    // delete lists
    listIds.forEach(listId => {
      const listRef = this.getDocRef('lists', listId);
      batch.delete(listRef);
    });
    memberIds.forEach(memberId => {
      this.getDocRef(
        'users',
        memberId,
        'workspaces',
        workspaceId,
        'folders',
        projectId
      ).delete();
      this.updateBatch(batch, ['users', memberId, 'workspaces', workspaceId], {
        projectIds: this.removeFromArray(projectId)
      });
      this.updateBatch(batch, ['workspaces', workspaceId], {
        [`members.${memberId}.projectIds`]: this.removeFromArray(projectId),
        projectIds: this.removeFromArray(projectId)
      });
    });
    if (shouldCommit) {
      return batch
        .commit()
        .then(() => {
          console.log('Project deleted');
        })
        .catch(error => {
          console.error(error);
        });
    }
    return batch;
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
            console.log(error.message);
          });
      });
  };

  createList = async ({ name, userId, workspaceId, projectId }) => {
    const listId = await this.fs
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
        return ref.id;
      })
      .catch(error => {
        console.error(error.message);
      });

    return this.updateDoc(['projects', projectId], {
      listIds: this.addToArray(listId)
    }).then(() => {
      return listId;
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

  createTask = async ({
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

    const taskId = await this.fs
      .collection('tasks')
      .add({
        ownerId: userId,
        createdAt: this.getTimestamp(),
        lastUpdatedAt: null,
        commentIds: [],
        subtaskIds: [],
        tagIds: [],
        tags: {},
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
        return ref.id;
      })
      .catch(error => {
        console.error(error);
      });

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
        console.log('Created task');
        return taskId;
      })
      .catch(error => {
        console.error(error);
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

  removeAssignee = ({
    projectId,
    userId,
    folderId,
    workspaceId,
    taskId,
    dueDate = null
  }) => {
    const batch = this.createBatch();
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
        ['users', userId, 'workspaces', workspaceId, 'folders', `${+dueDate}`],
        {
          taskIds: this.removeFromArray(taskId)
        }
      );
    }

    this.updateBatch(
      batch,
      ['users', userId, 'workspaces', workspaceId, 'folders', projectId],
      {
        taskIds: this.removeFromArray(taskId)
      }
    );

    this.updateBatch(batch, ['tasks', taskId], {
      assignedTo: this.removeFromArray(userId),
      [`folders.${userId}`]: this.deleteField()
    });

    return batch
      .commit()
      .then(() => {
        console.log('Removed assignee');
      })
      .catch(error => {
        console.error(error);
      });
  };

  removeProjectMember = async ({ projectId, userId, workspaceId }) => {
    const batch = this.createBatch();
    this.updateBatch(batch, ['users', userId, 'workspaces', workspaceId], {
      projectIds: this.removeFromArray(projectId)
    });
    this.updateBatch(batch, ['projects', projectId], {
      memberIds: this.removeFromArray(userId)
    });
    this.updateBatch(batch, ['workspaces', workspaceId], {
      [`members.${userId}.projectIds`]: this.removeFromArray(projectId)
    });

    const assignedTasks = await this.queryCollection('tasks', [
      'projectId',
      '==',
      projectId
    ])
      .where('assignedTo', 'array-contains', userId)
      .get()
      .then(snapshot => {
        let tasks = [];
        snapshot.forEach(doc => {
          tasks = tasks.concat(doc.ref);
        });
        return tasks;
      });
    assignedTasks.forEach(ref => {
      this.updateBatch(batch, ref, {
        assignedTo: this.removeFromArray(userId)
      });
    });

    return batch
      .commit()
      .then(() => {
        console.log('Removed project member');
      })
      .catch(error => {
        console.error(error);
      });
  };

  addProjectMember = ({ projectId, userId, workspaceId }) => {
    const batch = this.createBatch();

    this.updateBatch(batch, ['projects', projectId], {
      memberIds: this.addToArray(userId)
    });

    this.updateBatch(batch, ['workspaces', workspaceId], {
      [`members.${userId}.projectIds`]: this.addToArray(projectId)
    });

    this.updateBatch(batch, ['users', userId, 'workspaces', workspaceId], {
      projectIds: this.addToArray(projectId)
    });

    return batch
      .commit()
      .then(() => {
        console.log('Added project member');
      })
      .catch(error => {
        console.error(error);
      });
  };

  addAssignee = ({
    projectId,
    projectName,
    userId,
    workspaceId,
    taskId,
    dueDate = null
  }) => {
    const batch = this.createBatch();

    this.updateBatch(batch, ['projects', projectId], {
      memberIds: this.addToArray(userId)
    });

    this.updateBatch(batch, ['workspaces', workspaceId], {
      [`members.${userId}.projectIds`]: this.addToArray(projectId),
      [`members.${userId}.activeTaskCount`]: this.plus(1)
    });

    this.updateBatch(batch, ['users', userId, 'workspaces', workspaceId], {
      projectIds: this.addToArray(projectId)
    });

    this.setBatch(
      batch,
      ['users', userId, 'workspaces', workspaceId, 'folders', projectId],
      {
        name: projectName,
        taskIds: this.addToArray(taskId)
      },
      true
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
      this.setBatch(
        batch,
        ['users', userId, 'workspaces', workspaceId, 'folders', `${+dueDate}`],
        {
          taskIds: this.addToArray(taskId)
        },
        true
      );
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
      userId,
      workspaceId,
      tags
    },
    options = {}
  ) => {
    const batch = options.batch || this.createBatch();
    const shouldCommit =
      'shouldCommit' in options ? options.shouldCommit : true;
    const deleteMode = options.deleteMode || 'task';
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
      assignedTo.forEach(memberId => {
        const folderId = folders[memberId];
        this.updateBatch(batch, ['workspaces', workspaceId], {
          [`members.${memberId}.activeTaskCount`]: this.minus(1)
        });

        this.updateBatch(
          batch,
          ['users', memberId, 'workspaces', workspaceId, 'folders', folderId],
          {
            taskIds: this.removeFromArray(taskId)
          }
        );

        if (!projectId) {
          this.updateBatch(
            batch,
            ['users', memberId, 'workspaces', workspaceId, 'folders', '4'],
            {
              taskIds: this.removeFromArray(taskId)
            }
          );
        } else if (deleteMode !== 'project') {
          this.updateBatch(
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
              taskIds: this.removeFromArray(taskId)
            }
          );
        }

        if (!dueDate) {
          this.updateBatch(
            batch,
            ['users', memberId, 'workspaces', workspaceId, 'folders', '5'],
            {
              taskIds: this.removeFromArray(taskId)
            }
          );
        } else {
          this.updateBatch(
            batch,
            [
              'users',
              memberId,
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

    if (!projectId) {
      Object.keys(tags).forEach(tag => {
        this.updateBatch(batch, ['users', userId, 'tags', tag], {
          count: this.minus(1)
        });
      });
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

  createSubtask = async ({
    userId,
    name,
    workspaceId,
    memberIds = [],
    taskId,
    projectId = null,
    dueDate = null
  }) => {
    const subtaskId = await this.fs
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
        return ref.id;
      })
      .catch(error => {
        console.error(error);
      });

    this.updateDoc(['tasks', taskId], {
      subtaskIds: this.addToArray(subtaskId)
    }).then(() => {
      return subtaskId;
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

  createComment = async ({
    from,
    content,
    workspaceId,
    to = [],
    projectId = null,
    taskId = null,
    createdAt = this.getTimestamp()
  }) => {
    const commentId = await this.fs
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
        return ref.id;
      })
      .catch(error => {
        console.error(`Error creating comment: ${error}`);
      });

    if (taskId) {
      this.updateDoc(['tasks', taskId], {
        commentIds: this.addToArray(commentId)
      });
    }

    return Promise.all(
      to.map(user => {
        this.createNotification({
          workspaceId,
          recipientId: user.userId,
          source: {
            user: from,
            type: 'comment',
            id: commentId,
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
      })
    )
      .then(() => {
        return commentId;
      })
      .catch(error => {
        console.error(error);
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
    return this.fs
      .collection('notifications')
      .add({
        recipientId,
        workspaceId,
        source,
        event,
        isActionPending,
        createdAt: this.getTimestamp(),
        isActive: true
      })
      .catch(error => {
        console.error(error);
      });
  };
}

export default Firebase;
