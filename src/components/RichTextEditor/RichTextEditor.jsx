import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import { Link } from 'react-router-dom';
import isEqual from 'lodash.isequal';
import { Toolbar } from '../Toolbar';
import { Button } from '../Button';
import initialValue from './value.json';
import * as keys from '../../constants/keys';
import { MemberSearch } from '../MemberSearch';
import { withOutsideClick } from '../withOutsideClick';
import EditorIcon from './EditorIcon';
import IconButton from './EditorIconButton';
import './RichTextEditor.scss';

const DEFAULT_BLOCK = 'paragraph';

const schema = {
  inlines: {
    mention: {
      isVoid: true
    }
  }
};

class RichTextEditor extends Component {
  static defaultProps = {
    classes: {
      container: '',
      toolbar: '',
      editor: '',
      button: '',
      addOns: ''
    },
    placeholder: '',
    marks: [],
    blocks: [],
    inlines: [],
    isMentionsEnabled: false,
    onSubmit: () => null,
    onBlur: () => {},
    addOns: [],
    isReadOnly: false,
    value: null,
    id: null
  };

  static propTypes = {
    id: PropTypes.string,
    classes: PropTypes.shape({
      container: PropTypes.string,
      toolbar: PropTypes.string,
      editor: PropTypes.string,
      button: PropTypes.string,
      addOns: PropTypes.string
    }),
    placeholder: PropTypes.string,
    onSubmit: PropTypes.func,
    onBlur: PropTypes.func,
    isMentionsEnabled: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    marks: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        icon: PropTypes.string
      })
    ),
    blocks: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        icon: PropTypes.string
      })
    ),
    inlines: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        icon: PropTypes.string
      })
    ),
    addOns: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        onClick: PropTypes.func,
        props: PropTypes.objectOf(PropTypes.any)
      })
    )
  };

  state = {
    value: this.props.value
      ? Value.fromJSON(this.props.value)
      : Value.fromJSON(initialValue),
    isMentionsListVisible: false,
    query: '',
    isFocused: false,
    userSuggestions: this.props.mentions.users,
    selectedMember: '',
    selectedIndex: null
  };

  isEmpty = () => {
    const { value } = this.state;
    return isEqual(initialValue, value.toJSON());
  };

  hasChanges = () => {
    const { value } = this.state;
    const { value: prevValue } = this.props;
    return !isEqual(prevValue, value.toJSON());
  };

  hasMark = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type === type);
  };

  hasInline = type => {
    const { value, isMentionsListVisible } = this.state;
    return (
      value.inlines.some(inline => inline.type === type) ||
      (type === 'mention' && isMentionsListVisible)
    );
  };

  hasBlock = type => {
    const { value } = this.state;
    if (['ordered-list', 'unordered-list'].includes(type)) {
      const {
        value: { document, blocks }
      } = this.state;
      if (blocks.size === 0) return false;
      const parent = document.getParent(blocks.first().key);
      return this.hasBlock('list-item') && parent && parent.type === type;
    }
    return value.blocks.some(node => node.type === type);
  };

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>;
      case 'code':
        return <code {...attributes}>{children}</code>;
      case 'italic':
        return <em {...attributes}>{children}</em>;
      case 'underlined':
        return <u {...attributes}>{children}</u>;
      default:
        return next();
    }
  };

  renderNode = (props, editor, next) => {
    const { attributes, children, node } = props;
    const { data } = node;

    switch (node.type) {
      case 'paragraph':
        return <p {...attributes}>{children}</p>;
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>;
      case 'unordered-list':
        return <ul {...attributes}>{children}</ul>;
      case 'ordered-list':
        return <ol {...attributes}>{children}</ol>;
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>;
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>;
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      case 'mention':
        return (
          <Link className="mention" to={data.get('href')} {...attributes}>
            {node.text}
          </Link>
        );
      case 'code':
        return (
          <pre>
            <code {...attributes}>{children}</code>
          </pre>
        );
      default:
        return next();
    }
  };

  onKeyDown = (e, editor, next) => {
    const { value } = editor;
    const { document } = value;
    const { isMentionsEnabled } = this.props;
    const { isMentionsListVisible } = this.state;
    const endOffset = value.selection.end.offset;
    const lastChar = value.endText.text.slice(endOffset - 1, endOffset);
    if (e.ctrlKey || e.metaKey) {
      let mark;
      switch (e.key) {
        case 'b': {
          mark = 'bold';
          break;
        }
        case 'i': {
          mark = 'italic';
          break;
        }
        case 'u': {
          mark = 'underlined';
          break;
        }
        default: {
          return next();
        }
      }
      editor.toggleMark(mark);
      e.preventDefault();
    } else if (
      isMentionsListVisible &&
      (e.key === keys.TAB ||
        e.key === keys.ARROW_DOWN ||
        e.key === keys.ARROW_UP ||
        e.key === keys.ENTER)
    ) {
      const { userSuggestions, selectedIndex, selectedMember, query } = this.state;
      const lastIndex = userSuggestions.length - 1;
      const nextIndex = selectedIndex === lastIndex ? 0 : selectedIndex + 1;
      const prevIndex = selectedIndex === 0 ? lastIndex : selectedIndex - 1;
      switch (e.key) {
        case keys.TAB:
        case keys.ARROW_DOWN: {
          this.setState({
            selectedMember: !query
              ? userSuggestions[0].userId
              : userSuggestions[nextIndex].userId,
            selectedIndex: !query ? 0 : nextIndex
          });
          break;
        }
        case keys.ARROW_UP: {
          this.setState({
            selectedMember: !query
              ? userSuggestions[lastIndex].userId
              : userSuggestions[prevIndex].userId,
            selectedIndex: !query ? lastIndex : prevIndex
          });
          break;
        }
        case keys.ENTER: {
          if (selectedMember === '') return next();
          this.insertMention(selectedMember);
          break;
        }
        default: {
          return next();
        }
      }
      e.preventDefault();
    } else {
      const firstText = document.getFirstText();
      const nextText = document.getNextText(firstText.key);
      switch (e.key) {
        case keys.BACKSPACE: {
          e.preventDefault();
          if (firstText.text === '' && !nextText) {
            if (this.hasBlock('list-item')) {
              const parent = document.getParent(value.focusBlock.key);
              const ancestor = document.getParent(parent.key);
              if (ancestor && ancestor.object === 'document') {
                editor
                  .moveToRangeOfNode(value.focusBlock)
                  .setBlocks(DEFAULT_BLOCK)
                  .moveToRangeOfNode(parent)
                  .unwrapBlock(parent.type)
                  .normalize(document);
              } else {
                editor.unwrapBlock(parent.type);
              }
            }
            if (this.hasBlock('code')) {
              editor.unwrapBlock('code').setBlocks(DEFAULT_BLOCK);
            }
          } else {
            editor.deleteBackward();
            if (isMentionsEnabled && isMentionsListVisible && lastChar === '@') {
              setTimeout(() => {
                this.setState({
                  query: '',
                  userSuggestions: this.props.mentions.users,
                  selectedMember: '',
                  selectedIndex: null,
                  isMentionsListVisible: false
                });
              }, 0);
            }
          }
          break;
        }
        case '@': {
          this.toggleMentionsList();
          break;
        }
        default: {
          return next();
        }
      }
    }
  };

  onChange = ({ value }) => {
    const { mentions } = this.props;
    const { users } = mentions;
    const { selectedMember } = this.state;
    const query = this.getMention(value);
    const userSuggestions = query
      ? users.filter(user => this.matchUser(user, query))
      : users;
    const newIndex = userSuggestions.findIndex(
      mention => mention.userId === selectedMember
    );
    const persistSelectedMember = newIndex !== -1;
    this.setState({
      value,
      query,
      userSuggestions,
      selectedMember: persistSelectedMember
        ? selectedMember
        : userSuggestions.length > 0
        ? userSuggestions[0].userId
        : '',
      selectedIndex: persistSelectedMember ? newIndex : 0
    });
  };

  matchUser = (user, query) => {
    if (query === '') return false;
    const { name, email, displayName } = user;
    const regExp = new RegExp(query, 'i');
    return regExp.test(name) || regExp.test(email) || regExp.test(displayName);
  };

  onClickMark = e => {
    e.preventDefault();
    const type = e.target.value;
    this.editor.toggleMark(type);
    this.editor.focus();
  };

  onClickInline = e => {
    e.preventDefault();
    const type = e.target.value;
    const { value } = this.editor;
    if (type === 'mention') {
      const startOffset = value.selection.start.offset;
      const endOffset = value.selection.end.offset;
      const selectedText = value.startText.text.slice(startOffset, endOffset);
      this.editor
        .insertText(`@${selectedText}`)
        .moveToEndOfText()
        .focus();
      setTimeout(() => {
        this.toggleMentionsList();
        if (!this.editor.value.selection.start.offset) {
          this.editor.normalize().moveTo(selectedText.length + 1);
        }
      }, 0);
    }
  };

  onClickBlock = e => {
    e.preventDefault();
    const type = e.target.value;
    const { editor } = this;
    const { value } = editor;
    const { document } = value;

    if (type !== 'unordered-list' && type !== 'ordered-list') {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock('list-item');

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_BLOCK : type)
          .unwrapBlock('unordered-list')
          .unwrapBlock('ordered-list');
      } else {
        editor.setBlocks(isActive ? DEFAULT_BLOCK : type);
      }
    } else {
      const isList = this.hasBlock('list-item');
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type);
      });

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_BLOCK)
          .unwrapBlock('unordered-list')
          .unwrapBlock('ordered-list');
      } else if (isList) {
        editor
          .unwrapBlock(type === 'unordered-list' ? 'ordered-list' : 'unordered-list')
          .wrapBlock(type);
      } else {
        editor.setBlocks('list-item').wrapBlock(type);
      }
    }
  };

  getMention = value => {
    if (!value.startText) {
      return '';
    }

    const startOffset = value.selection.start.offset;
    const textBefore = value.startText.text.slice(0, startOffset);
    const result = /@(\S*)$/.exec(textBefore);

    return result == null ? '' : result[1];
  };

  toggleMentionsList = () => {
    this.setState(prevState => ({
      isMentionsListVisible: !prevState.isMentionsListVisible
    }));
  };

  onClick = (event, editor, next) => {
    if (editor.value.selection.isBlurred) {
      editor.moveToRangeOfDocument().focus();
    } else {
      return next();
    }
  };

  onFocus = () => {
    setTimeout(() => {
      this.setState({
        isFocused: true
      });
    }, 0);
  };

  onBlur = (e, editor, next) => {
    const { value: prevValue, onBlur } = this.props;
    setTimeout(() => {
      this.setState({
        isFocused: false,
        isMentionsListVisible: false
      });
    }, 0);
    if (prevValue !== undefined && this.hasChanges() && onBlur) {
      const { value } = this.state;
      onBlur(value, e);
    } else {
      return next();
    }
  };

  onUpdate = e => {
    e.preventDefault();
    const { value } = this.state;
    const { onUpdate } = this.props;
    if (onUpdate && this.hasChanges()) {
      onUpdate(value, e);
    }
    this.reset();
  };

  insertMention = userId => {
    const { mentions } = this.props;
    const { usersById } = mentions;
    const user = usersById[userId];
    const { query } = this.state;

    this.editor.deleteBackward(query.length + 1);
    const selectedRange = this.editor.value.selection;

    this.editor
      .insertText(' ')
      .insertInlineAtRange(selectedRange, {
        data: {
          href: `/0/${user.userId}/profile`,
          userId: user.userId,
          name: user.name,
          displayName: user.displayName
        },
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: `@${user.displayName}`
              }
            ]
          }
        ],
        type: 'mention'
      })
      .focus();

    setTimeout(() => {
      this.setState({
        query: '',
        userSuggestions: this.props.mentions.users,
        selectedMember: '',
        selectedIndex: null,
        isMentionsListVisible: false
      });
    }, 0);
  };

  onSubmit = e => {
    e.preventDefault();
    if (this.isEmpty()) return;
    const { value } = this.state;
    const { onSubmit } = this.props;
    onSubmit(value, e);
    this.reset();
  };

  reset = () => {
    const { value } = this.props;
    this.setState({
      value: value ? Value.fromJSON(value) : Value.fromJSON(initialValue),
      isMentionsListVisible: false,
      query: '',
      isFocused: false
    });
  };

  ref = editor => {
    this.editor = editor;
  };

  onOutsideClick = e => {
    const { isFocused } = this.state;
    if (!this.editor || !isFocused) return;
    this.editor.blur();
  };

  getAddOnCallback = type => {
    switch (type) {
      case 'submit': {
        return this.onSubmit;
      }
      case 'update': {
        return this.onUpdate;
      }
      case 'reset': {
        return this.reset;
      }
      default: {
        return null;
      }
    }
  };

  render() {
    const {
      id,
      classes,
      placeholder,
      marks,
      inlines,
      blocks,
      isMentionsEnabled,
      mentions,
      addOns,
      isReadOnly,
      innerRef
    } = this.props;
    const { value, isMentionsListVisible, query, isFocused, selectedMember } = this.state;
    return (
      <div
        id={id}
        ref={innerRef}
        className={`rich-text-editor__container ${
          isFocused ? 'is-focused' : ''
        } ${classes.container || ''}`}
      >
        <Toolbar
          className={`rich-text-editor__toolbar ${classes.toolbar || ''}`}
          isActive={isFocused}
        >
          {marks.map(mark => (
            <IconButton
              key={mark.type}
              className={classes.button}
              type={mark.type}
              onMouseDown={this.onClickMark}
              isActive={this.hasMark(mark.type)}
              icon={mark.icon}
            />
          ))}
          {inlines.map(inline => (
            <IconButton
              key={inline.type}
              className={classes.button}
              type={inline.type}
              onMouseDown={this.onClickInline}
              isActive={this.hasInline(inline.type)}
              icon={inline.icon}
            />
          ))}
          {blocks.map(block => (
            <IconButton
              key={block.type}
              className={classes.button}
              type={block.type}
              onMouseDown={this.onClickBlock}
              isActive={this.hasBlock(block.type)}
              icon={block.icon}
            />
          ))}
          {addOns.length > 0 && (
            <div className={`rich-text-editor__add-ons ${classes.addOns || ''}`}>
              {addOns.map((addOn, i) => (
                <Button
                  key={`${addOn.type}-${i}`}
                  type="button"
                  disabled={addOn.type === 'submit' ? this.isEmpty() : false}
                  onMouseDown={addOn.onClick || this.getAddOnCallback(addOn.type)}
                  {...addOn.props}
                />
              ))}
            </div>
          )}
        </Toolbar>
        <Editor
          schema={schema}
          ref={this.ref}
          value={value}
          placeholder={placeholder}
          onClick={this.onClick}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          className={`rich-text-editor ${classes.editor || ''}`}
          renderMark={this.renderMark}
          renderNode={this.renderNode}
          readOnly={isReadOnly}
          tabIndex={0}
        />
        {isMentionsEnabled && (
          <MemberSearch
            query={query}
            isActive={isMentionsListVisible}
            users={mentions.users}
            placeholder=""
            assignedMembers={[]}
            selectedMember={selectedMember}
            onSelectMember={this.insertMention}
            type="hidden"
            classes={{
              wrapper: 'rich-text-editor__mentions-wrapper',
              list: 'rich-text-editor__mentions-list'
            }}
          />
        )}
      </div>
    );
  }
}

export default withOutsideClick(RichTextEditor);
