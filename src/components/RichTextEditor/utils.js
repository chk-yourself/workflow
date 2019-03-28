import { Value } from 'slate';

export const fromJSON = value => Value.fromJSON(value);

export const getUserIdsFromMentions = value => {
  const { document } = value;
  return document
    .getInlinesByType('mention')
    .map(mention => mention.data.get('userId'))
    .toJS();
};

export const getMentionedUsers = value => {
  const { document } = value;
  return document
    .getInlinesByType('mention')
    .map(mention => ({
      userId: mention.data.get('userId'),
      name: mention.data.get('name'),
      username: mention.data.get('username')
    }))
    .toJS();
};
