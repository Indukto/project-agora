import { NotFoundBlueScreen } from "@/components/site/NotFoundBlueScreen";
import { NotFoundLagoon } from "@/components/site/NotFoundLagoon";
import { useCoarsePointer } from "@/hooks/use-coarse-pointer";

import { useLocation } from "react-router";

/**
 * 404 — two designs, one switch.
 *
 * A desktop visitor gets a blue screen and can leave it with the keyboard,
 * because they have one. A touch visitor gets the lagoon artwork and two links,
 * because a keypress is not an input they can produce — the blue screen would
 * have been a trap with no exit.
 *
 * The branch below is the only place in the codebase that decides this.
 */

export default function NotFound() {
  const coarsePointer = useCoarsePointer();
  const location = useLocation();

  return coarsePointer ? (
    <NotFoundLagoon />
  ) : (
    <NotFoundBlueScreen attemptedPath={location.pathname} />
  );
}
