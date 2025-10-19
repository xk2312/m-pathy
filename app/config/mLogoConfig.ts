// config/mLogoConfig.ts
export type MVariant =
  | "auto"              // ← hinzugefügt  
  | "goldenRebirth"  // Gewinner – Standard
  | "ocean"
  | "body"
  | "loop"
  | "balance"
  | "power"
  | "oracle"
  | "minimal";

// Bühne/Theater: feste, beruhigende Koordinaten – mobile zuerst
export const M_THEATER = {
  mobile:  { width: 360, height: 200 },   // 350–450 war Vorgabe → 360 als sicherer Default
  tablet:  { width: 420, height: 200 },
  desktop: { width: 480, height: 200 },
};

// Eine einzige Umschaltstelle für alle Tests
export const M_CURRENT_VARIANT: MVariant = "goldenRebirth";
