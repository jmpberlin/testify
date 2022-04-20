import React from 'react';
import { Link } from 'react-router-dom';

const ButtonNext = (props) => {
  return (
    <button type={props.type} disabled={props.disabled}>
      <Link to={props.to}>{props.children}</Link>
    </button>
  );
};

export default ButtonNext;