import React from 'react';
import { Link } from 'react-router-dom';

const BoardTile = props => {
  const { boardId, boardTitle, onClick } = props;
  return (
    <li className="board-grid__tile">
      <Link
        className="board-grid__link"
        to={`/home/board/${boardId}`}
        onClick={onClick}
      >
        <span className="board-grid__title">{boardTitle}</span>
      </Link>
    </li>
  );
};

export default BoardTile;
