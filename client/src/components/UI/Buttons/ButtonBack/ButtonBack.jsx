import React from 'react';
import { Link } from 'react-router-dom';

const ButtonBack = (props) => {
  return (
    <button onClick={props.onClick}>
      <Link to={props.to}>{props.children}</Link>
    </button>
  );
};
export default ButtonBack;
