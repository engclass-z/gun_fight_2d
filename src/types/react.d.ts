import * as React from 'react';

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/ban-types
  type FCC<P = {}> = FunctionComponent<
    P & {
      className?: string;
    }
  >;
}
