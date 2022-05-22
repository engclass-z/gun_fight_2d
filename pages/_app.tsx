import { AppProps } from 'next/app';
import React, { FC } from 'react';
import './_reset.modules.scss';
import './_common.modules.scss';
import '../src/lib/firebase';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => <Component {...pageProps} />;

export default MyApp;
