export default function VariantsPreview() {
  const variants = [
    { id: "mode_onboarding", color: "bg-blue-500", hover: "hover:bg-blue-600" },
    { id: "mode_research", color: "bg-green-400", hover: "hover:bg-green-500" },
    { id: "mode_m13", color: "bg-violet-400", hover: "hover:bg-violet-500" },
    { id: "mode_calm", color: "bg-sky-500", hover: "hover:bg-sky-600" },
    { id: "mode_play", color: "bg-orange-400", hover: "hover:bg-orange-500" },
    { id: "mode_oracle", color: "bg-rose-400", hover: "hover:bg-rose-500" },
    { id: "mode_joy", color: "bg-red-400", hover: "hover:bg-red-500" },
    { id: "mode_vision", color: "bg-cyan-500", hover: "hover:bg-cyan-600" },
    { id: "mode_empathy", color: "bg-lime-400", hover: "hover:bg-lime-500" },
    { id: "mode_love", color: "bg-fuchsia-500", hover: "hover:bg-fuchsia-600" },
    { id: "mode_wisdom", color: "bg-purple-400", hover: "hover:bg-purple-500 italic" },
    { id: "mode_truth", color: "bg-neutral-800 text-white", hover: "hover:bg-neutral-700" },
    { id: "mode_peace", color: "bg-zinc-300", hover: "hover:bg-zinc-200" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
      {variants.map(({ id, color, hover }) => (
        <a
          key={id}
          href="#showcases"
          role="button"
          aria-label={id}
          onClick={() => console.log(`${id}_click`)}
          className={`
            ${color} ${hover}
            rounded-2xl px-5 py-3 text-center font-medium text-black
            shadow-md transition-all duration-150 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-white/60
          `}
        >
          {id}
        </a>
      ))}
    </div>
  );
}
