import React from 'react';
import styles from './BackgroundWrapper.module.css';

const BackgroundWrapper = (props) => {
  return <div className={styles.outerWrapper}>{props.children}</div>;
};

export default BackgroundWrapper;
