import React from "react";

export default function StarButton({
  loading,
  onClick,
  className,
}: {
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "flex items-center justify-center " +
        "mx-auto rounded-full px-12 py-5 " +
        "bg-gradient-to-r from-[#8E2DE2] via-[#6A82FB] to-[#FC5C7D] " +
        "text-white text-2xl font-extrabold shadow-lg border-none outline-none " +
        "transition-all duration-150 " +
        "hover:scale-110 hover:shadow-2xl " +
        (loading
          ? "animate-pulse pointer-events-none opacity-75"
          : "opacity-95") +
        (className ? " " + className : "")
      }
      style={{
        minWidth: "260px",
        minHeight: "68px",
        letterSpacing: "0.04em",
        boxShadow: "0 9px 30px 0 #7a5dfa66"
      }}
      disabled={loading}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block animate-spin">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="#fff" strokeWidth="2" opacity="0.11" />
              {[0, 1, 2, 3, 4].map((_, i) => (
                <circle
                  key={i}
                  cx={14 + 12 * Math.cos((i * 2 * Math.PI) / 5)}
                  cy={14 + 12 * Math.sin((i * 2 * Math.PI) / 5)}
                  r="2"
                  fill="#fff"
                  opacity="0.7"
                />
              ))}
            </svg>
          </span>
          <span className="text-2xl">Launching…</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          Get Started <span className="ml-1 text-yellow-200 text-3xl">✨</span>
        </span>
      )}
    </button>
  );
}
