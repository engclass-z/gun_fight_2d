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

export const useRealtimeDatabase = () => {
  const [me, setMe] = useState<User | null>(null);
  const [enemy, setEnemy] = useState<User | null>(null);

  const uidRef = useRef('');
  const beginTimestampRef = useRef(-1);
  const isJumpingRef = useRef(false);

  const shot = useCallback(() => {
    // console.log('shot');
  }, []);

  const jump = useCallback(() => {
    setMe((prev) => {
      if (!prev) return null;
      if (prev.y !== GROUND_Y) return prev;
      isJumpingRef.current = true;
      return { ...prev, vy: 40 };
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
                x: prev.x - (prev.x > 20 ? 3 : 0),
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
                x: prev.x + (prev.x < 620 ? 3 : 0),
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
                y: prev.y + prev.vy * 0.2,
                vy: prev.vy - 9.8 * 0.2,
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
    }, 33);
    return () => clearTimeout(timer);
  }, [isMovingToLeft, isMovingToRight, me?.vy, me?.y]);

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
      setEnemy({ uid, x, y, character, direction, vy });
    }
  }, []);

  // キャラクターを選択
  const selectCharacter = useCallback((id: number) => {
    setMe((prev) => (prev ? { ...prev, character: id } : prev));
  }, []);

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

  const onUserChange = useCallback((v: any) => {
    if (!v) return;
    const { uid, value } = v;
    const { x, y, character, direction, vy } = value;

    if (uid === uidRef.current) return;
    setEnemy({ uid, x, y, character, direction, vy });
  }, []);

  // 初期化
  useEffect(() => {
    (async () => {
      if (!isInitialized) {
        isInitialized = true;
        uidRef.current = (await FirebaseAuth.anonymousSignIn()) || '';
        beginTimestampRef.current = new Date().getTime();
        FirebaseDatabase.listen('join', onJoin);
      }
    })();
  }, []);

  return {
    me,
    enemy,
    join,
    selectCharacter,
  };
};
