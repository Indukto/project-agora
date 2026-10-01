import { cn } from "@/lib/utils";

/**
 * Feralui-inspired soft mesh gradient: drifting aurora blobs in electric
 * blue / teal / violet over deep slate, finished with film grain.
 */
export function MeshHero({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "mesh-gradient mesh-grain pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {/* Base wash */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,oklch(0.24_0.04_250)_0%,oklch(0.17_0.014_260)_58%,var(--background)_100%)]" />
      {/* Drifting color blobs */}
      <div className="mesh-blob animate-drift-a top-[-30%] left-[-10%] size-[42rem] bg-[oklch(0.55_0.16_225/0.5)]" />
      <div className="mesh-blob animate-drift-b top-[-10%] right-[-15%] size-[38rem] bg-[oklch(0.6_0.15_170/0.4)]" />
      <div className="mesh-blob animate-drift-c bottom-[-45%] left-[20%] size-[46rem] bg-[oklch(0.5_0.18_285/0.42)]" />
      <div className="mesh-blob animate-drift-d top-[10%] left-[45%] size-[26rem] bg-[oklch(0.7_0.14_205/0.35)]" />
      {/* Dotted topography grid */}
      <div className="bg-grid-dots absolute inset-0 opacity-60 [mask-image:radial-gradient(75%_60%_at_50%_35%,black_30%,transparent_100%)]" />
      {/* Fade into page background at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}
