import React, { FCC } from 'react';

import { Direction } from '../../../lib/firebase/types/direction';
import { useRealtimeDatabase } from '../../../lib/hooks/useRealtimeDatabase';
import { Character } from '../../modules/Character';

import styles from './styles.module.scss';

/**
 * トップページ
 */
export const IndexPage: FCC = () => {
  const { me, enemy, join, selectCharacter } = useRealtimeDatabase();

  return (
    <section className={styles.IndexPage}>
      <div className={styles.IndexPage__inner}>
        <div className={styles.IndexPage__gameArea}>
          {me && (
            <div className={styles.IndexPage__player} style={{ left: me.x, bottom: me.y }}>
              <Character id={me.character} direction={me.direction} />
            </div>
          )}
          {enemy && (
            <div className={styles.IndexPage__player} style={{ left: enemy.x, bottom: enemy.y }}>
              <Character id={enemy.character} direction={enemy.direction} />
            </div>
          )}
        </div>
      </div>
      <div className={styles.IndexPage__buttonArea}>
        <button type="button" onClick={join}>
          参加
        </button>
      </div>
      <div className={styles.IndexPage__charaArea}>
        {[1, 2, 3, 4].map((id) => (
          <div
            key={id}
            className={
              me?.character === id
                ? styles.IndexPage__charaButtonActive
                : styles.IndexPage__charaButtonInactive
            }
          >
            <button
              className={styles.IndexPage__charaButton}
              type="button"
              onClick={() => selectCharacter(id)}
            >
              <Character id={id} direction={Direction.front} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
