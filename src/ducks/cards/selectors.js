export const getCardsById = state => {
  return state.cardsById;
};

export const getCardsArray = (state, ownProps) => {
  const { cardsById } = state;
  const { cardIds } = ownProps;
  return cardIds.map(cardId => cardsById[cardId]);
};

export const getCardTags = (state, ownProps) => {
  const { boardsById } = state;
  const { boardId, tags: cardTags } = ownProps;
  const { tags: boardTags } = boardsById[boardId];

  if (!cardTags || !boardTags) return [];
  return cardTags.map(cardTag => boardTags[cardTag]);
};
