import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash } from "lucide-react";

/**
 * Sticker Drawer with two design options
 * – Design 1: per‑sticker delete icons
 * – Design 2: bulk delete via header bin + multiselect
 *
 * Fixed buttons at the top of the viewport let the user switch designs.
 */

const INITIAL_STICKERS = [
  "#FDE68A",
  "#A5F3FC",
  "#FBCFE8",
  "#BBF7D0",
  "#C4B5FD",
  "#FCA5A5",
  "#FEF3C7",
  "#BFDBFE",
  "#FCE7F3",
];

type DesignOption = 1 | 2;

export default function App() {
  const [open, setOpen] = useState(true);
  const [stickers, setStickers] = useState(INITIAL_STICKERS);
  const [design, setDesign] = useState<DesignOption>(1);

  // option‑1 single delete
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  // option‑2 bulk delete
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [pendingBulkDelete, setPendingBulkDelete] = useState(false);

  /* helpers */
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

  /* UI */
  return (
    <>
      {/* Design switcher buttons */}
      <div className="fixed top-2 left-0 right-0 z-30 flex justify-center">
        <div className="flex gap-2 rounded-full bg-white/90 p-1 shadow-md backdrop-blur dark:bg-zinc-800/90">
          <button
            onClick={() => switchDesign(1)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              design === 1
                ? "bg-indigo-900 text-white"
                : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
            }`}
          >
            Design 1
          </button>
          <button
            onClick={() => switchDesign(2)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              design === 2
                ? "bg-indigo-900 text-white"
                : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
            }`}
          >
            Design 2
          </button>
        </div>
      </div>

      {/* Sticker Drawer */}
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
            <div className="flex w-full max-w-md flex-col rounded-t-2xl bg-white p-4 shadow-xl dark:bg-zinc-800">
              {/* Header */}
              <div className="flex items-center justify-between pb-2">
                <h2 className="text-lg font-bold text-indigo-900 dark:text-white">Stickers</h2>
                <div className="flex items-center gap-3">
                  {design === 2 && (
                    <button
                      onClick={() => {
                        setSelectMode((m) => !m);
                        setSelected(new Set());
                      }}
                      className={`rounded-full p-1 ${
                        selectMode
                          ? "bg-red-600 text-white"
                          : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                      }`}
                    >
                      <Trash className="h-5 w-5" strokeWidth={2.25} />
                    </button>
                  )}
                  <button
                    className="text-xl font-bold text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Segmented control placeholder */}
              <div className="mb-4 flex overflow-hidden rounded-full bg-zinc-200 p-1 dark:bg-zinc-700">
                <button className="flex-1 rounded-full py-1 text-sm text-zinc-600 dark:text-zinc-300">Collections</button>
                <button className="flex-1 rounded-full bg-indigo-900 py-1 text-sm font-medium text-white">Create ✨</button>
              </div>

              {/* Sticker grid */}
              <div className="grid flex-1 grid-cols-3 gap-4">
                {stickers.map((color, idx) => {
                  const isSelected = selected.has(idx);
                  return (
                    <div key={idx} className="relative">
                      {/* sticker card */}
                      <div
                        className={`flex h-20 w-full items-center justify-center rounded-xl bg-white shadow-sm dark:bg-zinc-700 ${
                          selectMode && isSelected ? "ring-4 ring-indigo-400" : ""
                        }`}
                      >
                        <div className="h-16 w-16 rounded-lg" style={{ backgroundColor: color }} />
                      </div>

                      {/* option‑1 delete icon */}
                      {design === 1 && (
                        <button
                          onClick={() => setPendingDelete(idx)}
                          className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-red-600 p-1 text-white shadow-md hover:bg-red-700"
                        >
                          <Trash className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                      )}

                      {/* option‑2 checkbox overlay */}
                      {design === 2 && selectMode && (
                        <button
                          onClick={() => toggleSelect(idx)}
                          className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/20"
                        >
                          <span
                            className={`inline-block h-6 w-6 rounded-full border-2 border-white ${
                              isSelected ? "bg-indigo-600" : "bg-transparent"
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  );
                })}
                {stickers.length === 0 && (
                  <p className="col-span-3 py-4 text-center text-sm text-zinc-500 dark:text-zinc-300">All stickers deleted.</p>
                )}
              </div>

              {/* Bulk delete CTA */}
              {design === 2 && selectMode && (
                <button
                  disabled={selected.size === 0}
                  onClick={() => setPendingBulkDelete(true)}
                  className={`mt-4 w-full rounded-xl py-2 text-sm font-medium transition-colors ${
                    selected.size === 0
                      ? "bg-zinc-300 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  Delete {selected.size} sticker{selected.size !== 1 && "s"}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation dialogs */}
      {/* Single delete */}
      <Dialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-800">
            <Dialog.Title className="mb-4 text-base font-medium text-zinc-800 dark:text-zinc-100">
              Once this sticker is deleted it can't be retrieved.
            </Dialog.Title>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPendingDelete(null)}
                className="rounded-md px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={() => pendingDelete !== null && removeSticker(pendingDelete)}
                className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete sticker
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Bulk delete */}
      <Dialog
        open={pendingBulkDelete}
        onClose={() => setPendingBulkDelete(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-800">
            <Dialog.Title className="mb-4 text-base font-medium text-zinc-800 dark:text-zinc-100">
              Once these {selected.size} stickers are deleted they can't be retrieved.
            </Dialog.Title>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPendingBulkDelete(false)}
                className="rounded-md px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={removeSelected}
                className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete {selected.size} sticker{selected.size !== 1 && "s"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
} 