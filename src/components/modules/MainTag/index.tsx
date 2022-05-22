import React, { FC } from 'react';

import styles from './styles.module.scss';

type Props = {
  className?: string;
  children: React.ReactNode;
};

/**
 * ヘッダー
 */
export const MainTag: FC<Props> = ({ className, children }) => (
  <main className={`${styles.MainTag} ${className}`}>{children}</main>
);
