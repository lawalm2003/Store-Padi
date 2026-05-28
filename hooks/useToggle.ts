import { useState } from 'react';

export const useToggle = (def = false) => {
  const [value, setValue] = useState(def);

  const toggle = () => {
    setValue((prev) => !prev);
  };

  return { value, toggle };
};
