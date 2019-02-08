import React from 'react';
import { Link } from 'react-router-dom';

const BoardTile = props => {
  return (
    <li className="board-grid__tile">
      <Link
        className="board-grid__link"
        to={`/home/board/${props.boardId}`}
        onClick={props.onClick}
      >
        <span className="board-grid__title">{props.title}</span>
      </Link>
    </li>
  );
};

export default BoardTile;
