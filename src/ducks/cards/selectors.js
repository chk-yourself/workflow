export const getCardsById = state => {
  return state.cardsById;
};

export const getCardsArray = state => {
  const { cardsById } = state;
  return Object.keys(cardsById).map(cardId => {
    return {
      cardId,
      ...cardsById[cardId]
    };
  });
};
