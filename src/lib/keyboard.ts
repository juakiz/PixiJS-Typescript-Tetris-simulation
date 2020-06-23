interface Key {
  value: any;
  isDown: boolean;
  isUp: boolean;
  press?(): void;
  release?(): void;
  downHandler?(): void;
  upHandler?(): void;
}

export default function keyboard(value: any): Key {
  const key: Key = {
    value: value,
    isDown: false,
    isUp: true,
  };
  //The `downHandler`
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );

  // // Detach event listeners
  // key.unsubscribe = () => {
  //   window.removeEventListener("keydown", downListener);
  //   window.removeEventListener("keyup", upListener);
  // };

  return key;
}
