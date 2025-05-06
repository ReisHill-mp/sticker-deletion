import React, { useState, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash, Check } from "lucide-react";

const SNAP_YELLOW = "#FFFC00";
const SNAP_NAVY = "#0F1B4C";
const SNAP_RED = "#FC4B4E";

const INITIAL_STICKERS = [
  "sticker_01.png",
  "sticker_02.png",
  "sticker_03.png",
  "sticker_04.png",
  "sticker_05.png",
  "sticker_05-1.png",
  "sticker_06.png",
  "sticker_07.png",
  "sticker_08.png",
  "sticker_08-1.png",
  "sticker_09.png",
];

type DesignOption = 1 | 2;
interface SpawnedSticker {
  image: string;
  id: number;
  x: number;
  y: number;
}

export default function App() {
  const [open] = useState(true);
  const [design, setDesign] = useState<DesignOption>(1);
  const [stickers, setStickers] = useState(INITIAL_STICKERS);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [pendingBulkDelete, setPendingBulkDelete] = useState(false);

  const [spawned, setSpawned] = useState<SpawnedSticker[]>([]);
  const nextId = useRef(0);

  /* Helpers */
  const spawnSticker = (image: string) => {
    const id = nextId.current++;
    const x = Math.random() * 80 + 10;
    const y = Math.random() * 70 + 10;
    setSpawned((s) => [...s, { image, id, x, y }]);
  };

  const switchDesign = (d: DesignOption) => {
    setDesign(d);
    setSelectMode(false);
    setSelected(new Set());
  };

  const removeSticker = (idx: number) => {
    setStickers((prev) => prev.filter((_, i) => i !== idx));
    setPendingDelete(null);
  };

  const removeSelected = () => {
    setStickers((prev) => prev.filter((_, i) => !selected.has(i)));
    setSelected(new Set());
    setPendingBulkDelete(false);
    setSelectMode(false);
  };

  const toggleSelect = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: "#f3f4f6" }}>
      {/* Spawned stickers */}
      {spawned.map(({ id, image, x, y }) => (
        <img
          key={id}
          src={`/img/${image}`}
          className="absolute h-20 w-20 rounded-xl shadow-md object-contain"
          style={{ left: `${x}vw`, top: `${y}vh` }}
          alt="Sticker"
        />
      ))}

      {/* Design switcher */}
      <div className="fixed top-2 left-0 right-0 z-30 flex justify-center">
        <div className="flex gap-2 rounded-full bg-white/90 p-1 shadow-md backdrop-blur">
          {[1, 2].map((opt) => (
            <button
              key={opt}
              onClick={() => switchDesign(opt as DesignOption)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                design === opt ? "text-white" : "text-zinc-700 hover:bg-zinc-100"
              }`}
              style={{ backgroundColor: design === opt ? SNAP_NAVY : "transparent" }}
            >
              Design {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
            className="fixed bottom-0 left-0 right-0 z-20 flex justify-center"
          >
            <div className="flex w-full max-w-md flex-col rounded-t-3xl bg-white p-4 shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between pb-2">
                <h2 className="text-lg font-bold" style={{ color: SNAP_NAVY }}>
                  Stickers
                </h2>
                <div className="flex items-center gap-3">
                  {design === 2 && (
                    <button
                      onClick={() => {
                        setSelectMode((m) => !m);
                        setSelected(new Set());
                      }}
                      className="rounded-full p-1"
                    >
                      <Trash className="h-6 w-6" strokeWidth={2.25} style={{ color: SNAP_NAVY }} />
                    </button>
                  )}
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full text-2xl font-bold"
                    style={{ color: SNAP_NAVY }}
                    aria-label="Close icon (inactive)"
                  >
                    ×
                  </span>
                </div>
              </div>

              {/* Segment control */}
              <div className="mb-4 flex overflow-hidden rounded-full bg-zinc-200 p-1">
                <button className="flex-1 rounded-full py-1 text-sm text-zinc-600">Collections</button>
                <button
                  className="flex-1 rounded-full py-1 text-sm font-medium text-white"
                  style={{ backgroundColor: SNAP_NAVY }}
                >
                  Create ✨
                </button>
              </div>

              {/* Sticker grid */}
              <div className="grid flex-1 grid-cols-3 gap-4">
                {stickers.map((image, idx) => {
                  const isSelected = selected.has(idx);
                  const handleClick = () => {
                    if (design === 2 && selectMode) {
                      toggleSelect(idx);
                    } else {
                      spawnSticker(image);
                    }
                  };
                  return (
                    <div key={idx} className="relative">
                      {design === 2 && selectMode && (
                        <button
                          onClick={() => toggleSelect(idx)}
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
                          src={`/img/${image}`}
                          className="h-20 w-20 rounded-xl object-contain"
                          alt="Sticker"
                        />
                      </button>

                      {design === 1 && (
                        <button
                          onClick={() => setPendingDelete(idx)}
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

              {/* Bulk delete CTA */}
              {design === 2 && selectMode && (
                <button
                  disabled={selected.size === 0}
                  onClick={() => setPendingBulkDelete(true)}
                  className={`mt-4 w-full rounded-xl py-2 text-sm font-medium transition-colors ${
                    selected.size === 0 ? "bg-zinc-300 text-zinc-600" : "text-white hover:brightness-95"
                  }`}
                  style={{ backgroundColor: selected.size === 0 ? "" : SNAP_RED }}
                >
                  Delete {selected.size} sticker{selected.size !== 1 && "s"}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation dialogs */}
      <Dialog open={pendingDelete !== null} onClose={() => setPendingDelete(null)} className="relative z-50">
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <Dialog.Title className="mb-4 text-base font-medium text-zinc-800">
              Once this sticker is deleted it can't be retrieved.
            </Dialog.Title>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPendingDelete(null)}
                className="rounded-md px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                onClick={() => pendingDelete !== null && removeSticker(pendingDelete)}
                className="rounded-md px-3 py-1 text-sm font-medium text-white hover:brightness-95"
                style={{ backgroundColor: SNAP_RED }}
              >
                Delete sticker
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog open={pendingBulkDelete} onClose={() => setPendingBulkDelete(false)} className="relative z-50">
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <Dialog.Title className="mb-4 text-base font-medium text-zinc-800">
              Once these {selected.size} stickers are deleted they can't be retrieved.
            </Dialog.Title>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPendingBulkDelete(false)}
                className="rounded-md px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                onClick={removeSelected}
                className="rounded-md px-3 py-1 text-sm font-medium text-white hover:brightness-95"
                style={{ backgroundColor: SNAP_RED }}
              >
                Delete {selected.size} sticker{selected.size !== 1 && "s"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
