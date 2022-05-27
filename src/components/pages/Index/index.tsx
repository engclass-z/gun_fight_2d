import React, { FCC } from 'react';

import { Direction } from '../../../lib/firebase/types/direction';
import { useRealtimeDatabase } from '../../../lib/hooks/useRealtimeDatabase';
import { Character } from '../../modules/Character';

import styles from './styles.module.scss';

/**
 * トップページ
 */
export const IndexPage: FCC = () => {
  const {
    me,
    enemy,
    bullets,
    enemyBullets,
    enemyBulletsHitIndexes,
    myDamageCount,
    enemyDamageCount,
    join,
    selectCharacter,
  } = useRealtimeDatabase();

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
          {bullets.map((bullet, i) =>
            bullet.x > 20 && bullet.x < 620 ? (
              <div
                key={i}
                className={styles.IndexPage__bullet}
                style={{ left: bullet.x, bottom: bullet.y }}
              />
            ) : null
          )}
          {enemyBullets.map((bullet, i) =>
            bullet.x > 20 && bullet.x < 620 && !enemyBulletsHitIndexes.includes(i) ? (
              <div
                key={i}
                className={styles.IndexPage__enemyBullet}
                style={{ left: bullet.x, bottom: bullet.y }}
              />
            ) : null
          )}
        </div>
      </div>
      <div className={styles.IndexPage__damageArea}>
        <p>{`自分のダメージ回数: ${myDamageCount}`}</p>
        <p>{`敵のダメージ回数: ${enemyDamageCount}`}</p>
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
