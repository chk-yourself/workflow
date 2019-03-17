import React from 'react';
import './ListBadge.scss';
import { Badge } from '../Badge';

const ListBadge = ({ name }) => (
  <Badge className="list-badge" icon="chevron-right">
    {name}
  </Badge>
);

export default ListBadge;
