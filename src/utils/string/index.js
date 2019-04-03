export const getParams = string => {
  const query = string.slice(1);
  return query.split('&').reduce((params, pair) => {
    const [key, value] = pair.split('=');
    return {
      ...params,
      [key]: decodeURIComponent(value)
    };
  }, {});
};
