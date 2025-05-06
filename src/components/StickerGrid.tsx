import { Check, Trash } from "lucide-react";
import { SNAP_NAVY, SNAP_RED } from "../constants";
import { DesignOption } from "../types";

interface StickerGridProps {
  stickers: string[];
  design: DesignOption;
  selectMode: boolean;
  selected: Set<number>;
  onToggleSelect: (idx: number) => void;
  onSpawnSticker: (image: string) => void;
  onDeleteSticker: (idx: number) => void;
}

export const StickerGrid = ({
  stickers,
  design,
  selectMode,
  selected,
  onToggleSelect,
  onSpawnSticker,
  onDeleteSticker,
}: StickerGridProps) => {
  return (
    <div className="grid flex-1 grid-cols-3 gap-4">
      {stickers.map((image, idx) => {
        const isSelected = selected.has(idx);
        const handleClick = () => {
          if (design === 2 && selectMode) {
            onToggleSelect(idx);
          } else {
            onSpawnSticker(image);
          }
        };
        return (
          <div key={idx} className="relative">
            {design === 2 && selectMode && (
              <button
                onClick={() => onToggleSelect(idx)}
                className="absolute -top-2 -left-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors"
                style={{
                  borderColor: isSelected ? "#ef4444" : SNAP_NAVY,
                  backgroundColor: isSelected ? "#ef4444" : "white",
                  boxShadow: isSelected ? "0 0 0 2px #fee2e2" : undefined,
                }}
              >
                {isSelected && (
                  <Check
                    className="h-4 w-4"
                    strokeWidth={3}
                    color="white"
                    fill="white"
                  />
                )}
              </button>
            )}

            <button
              onClick={handleClick}
              className={`flex h-24 w-full items-center justify-center rounded-2xl bg-white shadow-sm transition-transform active:scale-95 ${
                selectMode && isSelected ? "ring-4 ring-red-200" : ""
              }`}
            >
              <img
                src={image}
                className="h-20 w-20 rounded-xl object-contain"
                alt="Sticker"
              />
            </button>

            {design === 1 && (
              <button
                onClick={() => onDeleteSticker(idx)}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full p-1 text-white shadow-md hover:brightness-95"
                style={{ backgroundColor: SNAP_RED }}
              >
                <Trash className="h-6 w-6" strokeWidth={2.5} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}; 