import React, { FCC } from 'react';

import styles from './styles.module.scss';

/**
 * フッター
 */
export const Footer: FCC = ({ className }) => (
  <footer className={`${styles.Footer} ${className}`}>
    <small>Powered by ***</small>
  </footer>
);
