import Head from 'next/head';
import React, { FC } from 'react';

type Props = {
  title: string;
  description: string;
};

/**
 * head タグ
 */
export const HeadTag: FC<Props> = ({ title, description }) => (
  <Head>
    <title>{title}</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="description" content={description} />
  </Head>
);
