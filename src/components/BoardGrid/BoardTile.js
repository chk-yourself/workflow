import React from 'react';
import { Link } from 'react-router-dom';

const BoardTile = props => {
  return (
    <li className="board-tile">
      <Link
        className="board-tile__link"
        to={`/home/board/${props.boardId}`}
        onClick={props.onClick}
      >
        {props.title}
      </Link>
    </li>
  );
};

export default BoardTile;
