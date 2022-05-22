import React, { FCC } from 'react';

import styles from './styles.module.scss';

/**
 * ヘッダー
 */
export const Header: FCC = ({ className }) => (
  <header className={`${styles.Header} ${className}`} />
);
