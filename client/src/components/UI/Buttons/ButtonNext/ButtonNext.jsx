import React from 'react';
import { Link } from 'react-router-dom';

const ButtonNext = (props) => {
  return (
    <Link to={props.to}>
      <button disabled={props.disabled}>{props.children}</button>
    </Link>
  );
};

export default ButtonNext;
