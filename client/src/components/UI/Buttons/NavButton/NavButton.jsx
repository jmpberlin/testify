import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NavButton.module.css';

const NavButton = (props) => {
  return (
    <Link to={props.to}>
      <div className={styles.menuItem}>
        <button>{props.children}</button>
      </div>
    </Link>
  );
};

export default NavButton;
