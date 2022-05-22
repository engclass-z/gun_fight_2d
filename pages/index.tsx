import { NextPage } from 'next';
import React from 'react';

import { Footer } from '../src/components/modules/Footer';
import { Header } from '../src/components/modules/Header';
import { HeadTag } from '../src/components/modules/HeadTag';
import { MainTag } from '../src/components/modules/MainTag';
import { IndexPage } from '../src/components/pages/Index';

const Index: NextPage = () => (
  <>
    <HeadTag title="ゲーム" description="ゲーム" />
    <Header />
    <MainTag>
      <IndexPage />
    </MainTag>
    <Footer />
  </>
);

export default Index;
