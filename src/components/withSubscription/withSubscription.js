/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const withSubscription = ({
  path = () => null,
  query = () => null,
  onLoad = () => null,
  onAdd = () => null,
  onModify = () => null,
  onRemove = () => null
}) => WrappedComponent => {
  class WithSubscription extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: true
      };
      this.path = path(props);
      this.query = query(props);
      this.onLoad = onLoad(props);
      this.onAdd = onAdd(props);
      this.onModify = onModify(props);
      this.onRemove = onRemove(props);
    }

    componentDidMount() {
      const { firebase } = this.props;
      const [collection, doc = null, subcollection = null, subdoc = null] = this.path.split('/');
      const ref = this.query
        ? firebase.queryCollection(this.path, this.query)
        : doc || subdoc
        ? firebase.fs.doc(this.path)
        : firebase.fs.collection(this.path);

      this.listener = ref.onSnapshot(async snapshot => {
        if (doc || subdoc) {
          this.onLoad(snapshot);
        } else {
          const changes = snapshot.docChanges();
          if (snapshot.size === changes.length) {
            await this.onLoad(changes);
            this.setState({
              isLoading: false
            });
          } else {
            changes.forEach(async change => {
              const [id, data, changeType] = await Promise.all([
                change.doc.id,
                change.doc.data(),
                change.type
              ]);
              if (changeType === 'added') {
                this.onAdd(id, data);
              } else if (changeType === 'removed') {
                this.onRemove(id, data);
              } else {
                this.onModify(id, data);
              }
            });
          }
        }
      });
    }

    componentWillUnmount() {
      this.listener && this.listener();
    }

    render() {
      const { isLoading } = this.state;
      return <WrappedComponent isLoading={isLoading} {...this.props} />;
    }
  }

  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return compose(withFirebase)(WithSubscription);
};

export default withSubscription;
