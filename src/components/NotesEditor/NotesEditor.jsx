import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';
import { userSelectors } from '../../ducks/users';
import { RichTextEditor, getUserIdsFromMentions } from '../RichTextEditor';
import './NotesEditor.scss';

class NotesEditor extends Component {
  static defaultProps = {
    classes: {
      editor: '',
      button: ''
    },
    placeholder: '',
    isReadOnly: false,
    isMentionsEnabled: true
  };

  updateNotes = (value, e) => {
    const { firebase, id, type } = this.props;
    firebase.updateDoc([`${type}s`, id], {
      notes: value.toJSON(),
      mentions: getUserIdsFromMentions(value)
    });
    e.preventDefault();
  };

  render() {
    const {
      placeholder,
      value,
      classes,
      users,
      usersById,
      id,
      isReadOnly,
      isMentionsEnabled
    } = this.props;
    return (
      <RichTextEditor
        isReadOnly={isReadOnly}
        key={`notes-editor__${id}`}
        id={`notes--${id}`}
        placeholder={placeholder}
        value={value}
        onBlur={this.updateNotes}
        classes={{
          container: `notes-editor ${classes.editor || ''}`,
          toolbar: 'notes-editor__toolbar',
          button: 'notes-editor__toolbar-btn',
          addOns: 'notes-editor__add-ons'
        }}
        isMentionsEnabled={isMentionsEnabled}
        mentions={{
          users,
          usersById
        }}
        marks={[
          {
            type: 'bold',
            icon: 'bold'
          },
          {
            type: 'italic',
            icon: 'italic'
          },
          {
            type: 'underlined',
            icon: 'underlined'
          }
        ]}
        inlines={[
          ...(isMentionsEnabled
            ? [
                {
                  type: 'mention',
                  icon: 'mention'
                }
              ]
            : [])
        ]}
        blocks={[
          {
            type: 'unordered-list',
            icon: 'unordered-list'
          },
          {
            type: 'ordered-list',
            icon: 'ordered-list'
          },
          {
            type: 'code',
            icon: 'code'
          }
        ]}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    users: userSelectors.getUsersArray(state),
    usersById: userSelectors.getUsersById(state)
  };
};

export default withFirebase(connect(mapStateToProps)(NotesEditor));
