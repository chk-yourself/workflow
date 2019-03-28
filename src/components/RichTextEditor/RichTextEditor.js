import React, { Component } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import { Link } from 'react-router-dom';
import isEqual from 'lodash.isequal';
import { Toolbar } from '../Toolbar';
import { Button } from '../Button';
import { Icon } from '../Icon';
import initialValue from './value.json';
import * as keys from '../../constants/keys';
import { MemberSearch } from '../MemberSearch';
import { withOutsideClick } from '../withOutsideClick';
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
    addOns: [],
    isReadOnly: false
  };

  state = {
    value: this.props.value
      ? Value.fromJSON(this.props.value)
      : Value.fromJSON(initialValue),
    isMentionsListVisible: false,
    query: '',
    isFocused: false
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
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>;
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>;
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
      default:
        return next();
    }
  };

  onKeyDown = (e, editor, next) => {
    const { value } = editor;
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
    }

    switch (e.key) {
      case keys.BACKSPACE: {
        editor.deleteBackward();
        e.preventDefault();
        if (isMentionsEnabled && isMentionsListVisible && lastChar === '@') {
          setTimeout(this.toggleMentionsList, 0);
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
    // e.preventDefault();
  };

  onChange = ({ value }) => {
    this.setState({
      value,
      query: this.getMention(value)
    });
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

  toggleFocus = () => {
    const { isFocused } = this.state;
    setTimeout(() => {
      this.setState(prevState => ({
        isFocused: !prevState.isFocused
      }));
      if (this.editor && !isFocused) {
        this.editor.focus();
      }
    }, 0);
  };

  onFocus = e => {
    this.toggleFocus();
  };

  onBlur = e => {
    const { isFocused } = this.state;
    const { value: prevValue, onBlur } = this.props;
    this.toggleFocus();
    if (prevValue && this.hasChanges() && onBlur) {
      const { value } = this.state;
      onBlur(value, e);
    }
  };


  onUpdate = e => {
    const { value } = this.state;
    const { onUpdate } = this.props;
    if (onUpdate && this.hasChanges()) {
      onUpdate(value, e);
    }
    this.reset();
  };

  insertMention = userId => {
    const { mentions } = this.props;
    const { map } = mentions;
    const user = map[userId];
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
          username: user.username
        },
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: `@${user.name}`
              }
            ]
          }
        ],
        type: 'mention'
      })
      .focus();

    setTimeout(() => {
      this.setState({
        query: ''
      });
      this.toggleMentionsList();
    }, 0);
  };

  onSubmit = e => {
    if (this.isEmpty()) return;
    const { value } = this.state;
    const { onSubmit } = this.props;
    onSubmit(value, e);
    this.reset();
  };

  reset = () => {
    const { value } = this.props;
    this.setState({
      value: !!value ? Value.fromJSON(value) : Value.fromJSON(initialValue),
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
    if (this.editor && isFocused) {
      this.editor.blur();
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
    const { value, isMentionsListVisible, query, isFocused } = this.state;
    return (
      <div
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
            <Button
              key={`${id}--${mark.type}`}
              size="sm"
              className={`rich-text-editor__btn ${classes.button || ''}`}
              value={mark.type}
              onClick={this.onClickMark}
              iconOnly
              isActive={this.hasMark(mark.type)}
            >
              <Icon name={mark.icon} />
            </Button>
          ))}
          {inlines.map(inline => (
            <Button
              key={`${id}--${inline.type}`}
              size="sm"
              className={`rich-text-editor__btn ${classes.button || ''}`}
              value={inline.type}
              onClick={this.onClickInline}
              iconOnly
              isActive={this.hasInline(inline.type)}
            >
              <Icon name={inline.icon} />
            </Button>
          ))}
          {blocks.map(block => (
            <Button
              key={`${id}--${block.type}`}
              size="sm"
              className={`rich-text-editor__btn ${classes.button || ''}`}
              value={block.type}
              onClick={this.onClickBlock}
              iconOnly
              isActive={this.hasBlock(block.type)}
            >
              <Icon name={block.icon} />
            </Button>
          ))}
          {addOns.length > 0 && (
            <div
              className={`rich-text-editor__add-ons ${classes.addOns || ''}`}
            >
              {addOns.map(addOn => (
                <Button
                  key={`${id}--${addOn.type}`}
                  type="button"
                  onClick={this[addOn.onClick]}
                  {...addOn.props}
                />
              ))}
            </div>
          )}
        </Toolbar>
        <Editor
          key={`editor--${id}`}
          schema={schema}
          ref={this.ref}
          value={value}
          placeholder={placeholder}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          className={`rich-text-editor ${classes.editor || ''}`}
          renderMark={this.renderMark}
          renderNode={this.renderNode}
          readOnly={isReadOnly}
        />
        {isMentionsEnabled && (
          <MemberSearch
            key={`member-search--${id}`}
            query={query}
            isActive={isMentionsListVisible}
            users={mentions.list}
            placeholder=""
            assignedMembers={[]}
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
