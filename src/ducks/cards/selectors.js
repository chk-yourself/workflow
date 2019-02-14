export const getCardsById = state => {
  return state.cardsById;
};

export const getCardsArray = (state, ownProps) => {
  const { cardsById } = state;
  const { cardIds } = ownProps;
  return cardIds.map(cardId => cardsById[cardId]);
};
