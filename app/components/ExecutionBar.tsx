type ExecutionBarProps = {
  state: string | null;
  progress: number;
  visible: boolean;
};

export default function ExecutionBar({ state, progress, visible }: ExecutionBarProps) {
  if (!visible) return null;

  const getLabel = (state: string | null) => {
    if (!state) return "...starting";
    return `...${state.replaceAll("_", " ")}`;
  };

  return (
    <div style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "250px",
      height: "150px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "12px",
      padding: "16px",
      background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(8px)",
      zIndex: 9999
    }}>
      
      <div style={{
        width: "100%",
        height: "6px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "999px",
        overflow: "hidden"
      }}>
        <div style={{
          width: `${progress}%`,
          height: "100%",
          background: "#53E9FD",
          transition: "width 0.1s linear"
        }} />
      </div>

      <div style={{
        fontSize: "14px",
        color: "rgba(245,246,247,0.72)",
        textAlign: "center"
      }}>
        {getLabel(state)}
      </div>

    </div>
  );
}