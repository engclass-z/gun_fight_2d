import { useCallback, useRef, useState } from 'react';
import { useKey } from 'react-use';

type Args = {
  shot: () => void;
  jump: () => void;
};

export const useKeyboard = ({ shot, jump }: Args) => {
  const canZPressRef = useRef(true);
  const canXPressRef = useRef(true);
  const [isMovingToLeft, setMovingToLeft] = useState(false);
  const [isMovingToRight, setMovingToRight] = useState(false);

  const onKeyPress = useCallback(
    async (event: KeyboardEvent) => {
      const { key } = event;
      if (key === 'z') {
        if (canZPressRef.current) {
          shot();
          canZPressRef.current = false;
          setTimeout(() => (canZPressRef.current = true), 500);
        }
      } else if (key === 'x') {
        if (canXPressRef.current) {
          jump();
          canXPressRef.current = false;
          setTimeout(() => (canXPressRef.current = true), 1000);
        }
      }
    },
    [jump, shot]
  );

  const onKeyDown = useCallback(async (event: KeyboardEvent) => {
    const { key } = event;
    if (key === 'ArrowLeft') {
      setMovingToLeft(true);
    } else if (key === 'ArrowRight') {
      setMovingToRight(true);
    }
  }, []);

  const onKeyUp = useCallback(async (event: KeyboardEvent) => {
    const { key } = event;
    if (key === 'ArrowLeft') {
      setMovingToLeft(false);
    } else if (key === 'ArrowRight') {
      setMovingToRight(false);
    }
  }, []);

  useKey('z', onKeyPress, { event: 'keypress' }); // ショット
  useKey('x', onKeyPress, { event: 'keypress' }); // ジャンプ

  useKey('ArrowLeft', onKeyDown, { event: 'keydown' }); // 左移動
  useKey('ArrowLeft', onKeyUp, { event: 'keyup' }); // 左移動
  useKey('ArrowRight', onKeyDown, { event: 'keydown' }); // 右移動
  useKey('ArrowRight', onKeyUp, { event: 'keyup' }); // 右移動

  return { isMovingToLeft, isMovingToRight };
};
