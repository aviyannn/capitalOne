// src/components/CarSelector.tsx
import React, { useState } from "react";

type ToyotaModel = "Camry" | "Corolla" | "Prius" | "Highlander" | "RAV4";

export type CarChoice = {
  model: ToyotaModel;
  trim?: string;
  price?: number;
};

const MODEL_PRICES: Record<ToyotaModel, number> = {
  Camry: 30000,
  Corolla: 23000,
  Prius: 28000,
  Highlander: 38000,
  RAV4: 32000,
};

const MODELS: { model: ToyotaModel; blurb: string }[] = [
  { model: "Camry", blurb: "Comfort + efficiency" },
  { model: "Corolla", blurb: "Reliable + budget-friendly" },
  { model: "Prius", blurb: "Hybrid fuel saver" },
  { model: "Highlander", blurb: "Family SUV space" },
  { model: "RAV4", blurb: "Popular compact SUV" },
];

export default function CarSelector({
  onSelect,
}: {
  onSelect: (car: CarChoice) => void;
}) {
  const [picked, setPicked] = useState<ToyotaModel | null>(null);
  const [saving, setSaving] = useState(false);

  function handleChoose(m: ToyotaModel) {
    setPicked(m);
  }

  async function handleSelect() {
    if (!picked) return;
    setSaving(true);
    onSelect({ model: picked, price: MODEL_PRICES[picked] });
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {MODELS.map(({ model, blurb }) => {
          const active = picked === model;
          return (
            <button
              key={model}
              type="button"
              onClick={() => handleChoose(model)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleChoose(model);
                }
              }}
              className={[
                "rounded-2xl p-4 text-left transition",
                "bg-black/45 border shadow-xl backdrop-blur-xl",
                active
                  ? "border-purple-400/60 ring-2 ring-purple-400/40"
                  : "border-blue-500/20 hover:border-blue-400/40",
              ].join(" ")}
            >
              <div className="text-white font-semibold text-lg">{model}</div>
              <div className="text-blue-200/85 text-sm">{blurb}</div>
              <div className="mt-2 text-blue-100/80 text-sm">
                Est. price ${MODEL_PRICES[model].toLocaleString()}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          disabled={!picked || saving}
          onClick={handleSelect}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold shadow-lg disabled:opacity-60"
        >
          {saving ? "Selecting…" : picked ? `Select ${picked}` : "Select"}
        </button>
      </div>
    </div>
  );
}
