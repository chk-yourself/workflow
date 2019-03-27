import { Value } from 'slate';

export const fromJSON = value => Value.fromJSON(value);

export const getUserIdsFromMentions = value => {
  const { document } = value;
  return document
    .getInlinesByType('mention')
    .map(mention => mention.data.get('userId'))
    .toJS();
};
