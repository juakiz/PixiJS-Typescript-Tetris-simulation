interface Key {
  value: string;
  isDown: boolean;
  isUp: boolean;
  press?(): void;
  release?(): void;
}

export default function keyboard(value: string): Key {
  const key: Key = {
    value: value,
    isDown: false,
    isUp: true,
  };
  // The `downHandler`
  const downHandler = (event: KeyboardEvent): void => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };
  //The `upHandler`
  const upHandler = (event: KeyboardEvent): void => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  if (downHandler && upHandler) {
    window.addEventListener(
      "keydown", downHandler.bind(key), false
    );
    window.addEventListener(
      "keyup", upHandler.bind(key), false
    );
  }

  // // Detach event listeners
  // key.unsubscribe = () => {
  //   window.removeEventListener("keydown", downListener);
  //   window.removeEventListener("keyup", upListener);
  // };

  return key;
}
