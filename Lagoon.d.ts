/**
 * Types for the generated feral-react-gradient export in `Lagoon.jsx`.
 *
 * The module itself is plain bundle output (React component + paint helper),
 * so this sibling declaration keeps the import type-safe without compiling
 * the generated file. Recipe: "Lagoon" — an animated WATERCOLOR wash, 2048×1506.
 */
import type { CSSProperties, ComponentType } from "react";

export interface LagoonArtProps {
  className?: string;
  /**
   * Overrides land on the wrapper element, so a full-bleed hero can pass
   * `{ position: "absolute", inset: 0, height: "100%", aspectRatio: "auto" }`
   * to replace the recipe's natural aspect box.
   */
  style?: CSSProperties;
  /** Clock speed. Recipe default is 26; 0 freezes the wash. */
  speed?: number;
  paused?: boolean;
}

declare const LagoonArt: ComponentType<LagoonArtProps>;
export default LagoonArt;

/** Paints a recipe onto a canvas once (export/preview helper). */
export declare function paintRecipe(
  canvas: HTMLCanvasElement,
  recipe: unknown,
  startT?: number,
): void;
