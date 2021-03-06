import React, { memo } from 'react';
import PropTypes from 'prop-types';
import OrderedList from '@material-ui/icons/FormatListNumberedRounded';
import UnorderedList from '@material-ui/icons/FormatListBulletedRounded';
import Bold from '@material-ui/icons/FormatBoldRounded';
import Italic from '@material-ui/icons/FormatItalicRounded';
import Underlined from '@material-ui/icons/FormatUnderlinedRounded';
import Mention from '@material-ui/icons/AlternateEmailRounded';
import Code from '@material-ui/icons/CodeRounded';
import Link from '@material-ui/icons/InsertLinkRounded';
import IncreaseIndent from '@material-ui/icons/FormatIndentIncreaseRounded';
import DecreaseIndent from '@material-ui/icons/FormatIndentDecreaseRounded';
import { blocks, inlines, marks } from './constants';

const icons = {
  'ordered-list': OrderedList,
  'unordered-list': UnorderedList,
  'increase-indent': IncreaseIndent,
  'decrease-indent': DecreaseIndent,
  bold: Bold,
  italic: Italic,
  underlined: Underlined,
  mention: Mention,
  code: Code,
  link: Link
};

const EditorIcon = ({ name, size, className }) => {
  const Icon = icons[name];
  return (
    <Icon
      titleAccess={name}
      className={`editor-icon ${className}`}
      width={size}
      height={size}
    />
  );
};

EditorIcon.defaultProps = {
  className: '',
  size: 24
};

EditorIcon.propTypes = {
  name: PropTypes.oneOf([
    blocks.CODE,
    blocks.ORDERED_LIST,
    blocks.UNORDERED_LIST,
    blocks.INCREASE_INDENT,
    blocks.DECREASE_INDENT,
    marks.BOLD,
    marks.ITALIC,
    marks.UNDERLINED,
    inlines.MENTION
  ]).isRequired,
  className: PropTypes.string,
  size: PropTypes.number
};

export default memo(EditorIcon);
