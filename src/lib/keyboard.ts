interface Key {
  value: string;
  isDown: boolean;
  isUp: boolean;
  press?(): void;
}

export default function keyboard(value: string): Key {
  const key: Key = {
    value: value,
    isDown: false,
    isUp: true,
  };
  window.addEventListener(
    "keydown", ((event: KeyboardEvent): void => {
      if (event.key === key.value) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
      }
    }).bind(key), false
  );

  return key;
}
