"use client";

type Props = {
  onClearChat?: () => void;
  onSystemMessage?: any;
  messages?: any[];
  setInput?: (value: string) => void;
  canClear?: boolean;
};

export default function Saeule({ onClearChat }: Props) {
  return (
    <aside className="flex flex-col h-full p-4">
      
      {/* Top Icon Strip */}
      <div className="flex items-center gap-4">
        
        {/* Archive */}
        <button
          title="Archive"
          onClick={() => {
            window.location.href = "/archive";
          }}
          className="opacity-60 hover:opacity-100 transition"
        >
          🗂️
        </button>

        {/* Export */}
        <button
          title="Export chat (CSV / JSON)"
          onClick={() => {
            console.log("export trigger");
          }}
          className="opacity-60 hover:opacity-100 transition"
        >
          ⬆️
        </button>

        {/* New Chat */}
        <button
          title="New chat"
          onClick={() => onClearChat?.()}
          className="opacity-60 hover:opacity-100 transition"
        >
          ✨
        </button>

      </div>

    </aside>
  );
}