import { useState, useRef } from "react";
import { INITIAL_STICKERS } from "../constants";
import { SpawnedSticker } from "../types";

export const useStickers = () => {
  const [stickers, setStickers] = useState(INITIAL_STICKERS);
  const [spawned, setSpawned] = useState<SpawnedSticker[]>([]);
  const nextId = useRef(0);

  const spawnSticker = (image: string) => {
    const id = nextId.current++;
    const x = Math.random() * 80 + 10;
    const y = Math.random() * 70 + 10;
    setSpawned((s) => [...s, { image, id, x, y }]);
  };

  const removeSticker = (idx: number) => {
    setStickers((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeSelected = (selected: Set<number>) => {
    setStickers((prev) => prev.filter((_, i) => !selected.has(i)));
  };

  return {
    stickers,
    spawned,
    spawnSticker,
    removeSticker,
    removeSelected,
  };
}; 