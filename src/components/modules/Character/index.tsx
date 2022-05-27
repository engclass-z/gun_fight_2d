import React, { FCC } from 'react';

import { Direction } from '../../../lib/firebase/types/direction';

import styles from './styles.module.scss';

const IMAGE_PATH = 'img/character.bmp';

const getPosition = (id: number, direction: Direction) => {
  switch (id) {
    case 1: {
      if (direction === Direction.left) return { x: 1, y: 3 };
      if (direction === Direction.right) return { x: 1, y: 1 };
      if (direction === Direction.front) return { x: 1, y: 2 };
      break;
    }
    case 2: {
      if (direction === Direction.left) return { x: 1, y: 7 };
      if (direction === Direction.right) return { x: 1, y: 5 };
      if (direction === Direction.front) return { x: 1, y: 6 };
      break;
    }
    case 3: {
      if (direction === Direction.left) return { x: 7, y: 3 };
      if (direction === Direction.right) return { x: 7, y: 1 };
      if (direction === Direction.front) return { x: 7, y: 2 };
      break;
    }
    case 4: {
      if (direction === Direction.left) return { x: 4, y: 7 };
      if (direction === Direction.right) return { x: 4, y: 5 };
      if (direction === Direction.front) return { x: 4, y: 6 };
      break;
    }
  }
  return { x: -1, y: -1 };
};

type Props = {
  id: number;
  direction: Direction;
};

/**
 * キャラクター
 */
export const Character: FCC<Props> = ({ id, direction, className }) => {
  const { x, y } = getPosition(id, direction);
  return (
    <div className={`${styles.Character} ${className}`}>
      <div className={styles.Character__inner}>
        <img
          className={styles.Character__image}
          src={IMAGE_PATH}
          alt=""
          style={{
            objectPosition: `${-32 * x}px ${-32 * y}px`,
          }}
        />
      </div>
    </div>
  );
};
