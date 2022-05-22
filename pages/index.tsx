import { NextPage } from 'next';
import React from 'react';

import { Footer } from '../src/components/modules/Footer';
import { Header } from '../src/components/modules/Header';
import { HeadTag } from '../src/components/modules/HeadTag';
import { IndexPage } from '../src/components/pages/Index';

const Index: NextPage = () => (
  <>
    <HeadTag title="ゲーム" description="ゲーム" />
    <Header />
    <main>
      <IndexPage />
    </main>
    <Footer />
  </>
);

export default Index;
