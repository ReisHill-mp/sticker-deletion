import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash } from "lucide-react";
import { SNAP_NAVY, SNAP_RED } from "./constants";
import { DesignOption } from "./types";
import { useStickers } from "./hooks/useStickers";
import { StickerGrid } from "./components/StickerGrid";
import { DeleteConfirmationDialog } from "./components/DeleteConfirmationDialog";

export default function App() {
  const [open] = useState(true);
  const [design, setDesign] = useState<DesignOption>(1);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [pendingBulkDelete, setPendingBulkDelete] = useState(false);

  const { stickers, spawned, spawnSticker, removeSticker, removeSelected } = useStickers();

  const switchDesign = (d: DesignOption) => {
    setDesign(d);
    setSelectMode(false);
    setSelected(new Set());
  };

  const toggleSelect = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const handleRemoveSelected = () => {
    removeSelected(selected);
    setSelected(new Set());
    setPendingBulkDelete(false);
    setSelectMode(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: "#f3f4f6" }}>
      {/* Spawned stickers */}
      {spawned.map(({ id, image, x, y }) => (
        <img
          key={id}
          src={image}
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
              <StickerGrid
                stickers={stickers}
                design={design}
                selectMode={selectMode}
                selected={selected}
                onToggleSelect={toggleSelect}
                onSpawnSticker={spawnSticker}
                onDeleteSticker={setPendingDelete}
              />

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
      <DeleteConfirmationDialog
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete !== null && removeSticker(pendingDelete)}
        title="Once this sticker is deleted it can't be retrieved."
        confirmText="Delete sticker"
      />

      <DeleteConfirmationDialog
        isOpen={pendingBulkDelete}
        onClose={() => setPendingBulkDelete(false)}
        onConfirm={handleRemoveSelected}
        title={`Once these ${selected.size} stickers are deleted they can't be retrieved.`}
        confirmText={`Delete ${selected.size} sticker${selected.size !== 1 ? "s" : ""}`}
      />
    </div>
  );
}
