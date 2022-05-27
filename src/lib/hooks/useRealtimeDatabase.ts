import { useCallback, useEffect, useRef, useState } from 'react';

import FirebaseAuth from '../firebase/api/auth';
import FirebaseDatabase from '../firebase/api/database';
import { Direction } from '../firebase/types/direction';

import { useKeyboard } from './useKeyboard';

let isInitialized = false;

const GROUND_Y = 20;

type User = {
  uid: string;
  x: number;
  y: number;
  character: number;
  direction: Direction;
  vy: number;
};

type Bullet = {
  x: number;
  y: number;
  shooter: string;
  vx: number;
  timestamp: number;
};

export const useRealtimeDatabase = () => {
  const [me, setMe] = useState<User | null>(null);
  const [enemy, setEnemy] = useState<User | null>(null);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemyBullets, setEnemyBullets] = useState<Bullet[]>([]);
  const [enemyBulletsHitIndexes, setEnemyBulletHitIndexes] = useState<number[]>([]);
  const [myDamageCount, setMyDamageCount] = useState(0);
  const [enemyDamageCount, setEnemyDamageCount] = useState(0);

  const uidRef = useRef('');
  const beginTimestampRef = useRef(-1);
  const isJumpingRef = useRef(false);

  const shot = useCallback(() => {
    setMe((prev) => {
      if (!prev) return prev;
      setBullets((prevBullets) => [
        ...prevBullets,
        {
          x: prev.x,
          y: prev.y + 64,
          shooter: prev.uid,
          vx: prev.direction === Direction.left ? -10 : 10,
          timestamp: new Date().getTime(),
        },
      ]);
      return prev;
    });
  }, [me?.x, me?.y, me?.character, me?.direction, me?.vy, me?.uid]);

  const jump = useCallback(() => {
    setMe((prev) => {
      if (!prev) return null;
      if (prev.y !== GROUND_Y) return prev;
      isJumpingRef.current = true;
      return { ...prev, vy: 60 };
    });
  }, []);

  const { isMovingToLeft, isMovingToRight } = useKeyboard({ shot, jump });

  // キャラクターの移動と向き変更
  useEffect(() => {
    const timer = setInterval(() => {
      // 左に動く
      if (isMovingToLeft) {
        setMe((prev) =>
          prev
            ? {
                ...prev,
                x: prev.x - (prev.x > 40 ? 6 : 0),
                direction: Direction.left,
              }
            : prev
        );
      }
      // 右に動く
      if (isMovingToRight) {
        setMe((prev) =>
          prev
            ? {
                ...prev,
                x: prev.x + (prev.x < 600 ? 6 : 0),
                direction: Direction.right,
              }
            : prev
        );
      }
      // ジャンプ中
      if (me && me.y >= GROUND_Y && isJumpingRef.current) {
        setMe((prev) =>
          prev
            ? {
                ...prev,
                y: prev.y + prev.vy * 0.4 >= GROUND_Y ? prev.y + prev.vy * 0.4 : GROUND_Y,
                vy: prev.vy - 9.8 * 2 * 0.4,
              }
            : prev
        );
      } else {
        isJumpingRef.current = false;
        setMe((prev) =>
          prev
            ? {
                ...prev,
                vy: 0,
                y: GROUND_Y,
              }
            : prev
        );
      }

      // 玉の動き
      if (bullets.length) {
        setBullets((prev) => {
          return prev.map((bullet) => {
            const willX = bullet.x + bullet.vx * 1.5;
            return {
              ...bullet,
              x: willX,
            };
          });
        });
      }
    }, 33);
    return () => clearTimeout(timer);
  }, [isMovingToLeft, isMovingToRight, me?.vy, me?.y, bullets]);

  const join = useCallback(async () => {
    await FirebaseDatabase.write('join', {
      uid: uidRef.current,
      value: {
        x: enemy ? 580 : 60,
        y: GROUND_Y,
        character: 1,
        direction: enemy ? Direction.left : Direction.right,
        vy: 0,
        timestamp: new Date().getTime(),
      },
    });
  }, [enemy]);

  const onJoin = useCallback((v: any) => {
    if (!v) return;
    const { uid, value } = v;
    const { x, y, character, direction, vy, timestamp } = value;

    if (timestamp < beginTimestampRef.current) return;

    if (uid === uidRef.current) {
      setMe({ uid, x, y, character, direction, vy });
    } else {
      FirebaseDatabase.listen(`userChange/${uid}`, onUserChange);
      FirebaseDatabase.listen(`bullet/${uid}`, onBulletChange);
      setEnemy({ uid, x, y, character, direction, vy });
    }
  }, []);

  // キャラクターを選択
  const selectCharacter = useCallback((id: number) => {
    setMe((prev) => (prev ? { ...prev, character: id } : prev));
  }, []);

  // 霊が自分にあたった判定
  useEffect(() => {
    if (!me) return;
    const hits: number[] = [];
    enemyBullets?.forEach((bullet, i) => {
      const { x, y } = bullet;
      if (x > me.x - 32 && x < me.x + 32 && y - 32 < me.y + 64 && y - 32 > me.y) {
        hits.push(i);
      }
    });
    setEnemyBulletHitIndexes((prev) => Array.from(new Set([...prev, ...hits])));
  }, [enemyBullets, me?.x, me?.y]);

  useEffect(() => {
    (async () => {
      await FirebaseDatabase.write('damage', {
        uid: uidRef.current,
        timestamp: new Date().getTime(),
        count: enemyBulletsHitIndexes.length,
      });
    })();
  }, [enemyBulletsHitIndexes.length]);

  // キャラクター情報変更を送信
  useEffect(() => {
    (async () => {
      if (!me) return;
      await FirebaseDatabase.write(`userChange/${me.uid}`, {
        uid: uidRef.current,
        value: {
          ...me,
          timestamp: new Date().getTime(),
        },
      });
    })();
  }, [me?.x, me?.y, me?.character, me?.direction, me?.vy]);

  // 弾情報を送信
  useEffect(() => {
    (async () => {
      if (!me) return;
      await FirebaseDatabase.write(`bullet/${me.uid}`, {
        uid: uidRef.current,
        value: {
          bullets,
          timestamp: new Date().getTime(),
        },
      });
    })();
  }, [bullets]);

  const onUserChange = useCallback((v: any) => {
    if (!v) return;
    const { uid, value } = v;
    const { x, y, character, direction, vy } = value;

    if (uid === uidRef.current) return;
    setEnemy({ uid, x, y, character, direction, vy });
  }, []);

  const onBulletChange = useCallback((v: any) => {
    if (!v) return;
    const { uid, value } = v;
    const { bullets } = value;

    if (uid === uidRef.current) return;
    if (!bullets) return;
    setEnemyBullets(bullets);
  }, []);

  const onDamage = useCallback((v: any) => {
    if (!v) return;
    const { uid, timestamp, count } = v;

    if (timestamp < beginTimestampRef.current) return;

    if (uid === uidRef.current) {
      setMyDamageCount(count);
    } else {
      setEnemyDamageCount(count);
    }
  }, []);

  // 初期化
  useEffect(() => {
    (async () => {
      if (!isInitialized) {
        isInitialized = true;
        uidRef.current = (await FirebaseAuth.anonymousSignIn()) || '';
        beginTimestampRef.current = new Date().getTime();
        FirebaseDatabase.listen('join', onJoin);
        FirebaseDatabase.listen('damage', onDamage);
      }
    })();
  }, []);

  return {
    me,
    enemy,
    bullets,
    enemyBullets,
    enemyBulletsHitIndexes,
    myDamageCount,
    enemyDamageCount,
    join,
    selectCharacter,
  };
};
