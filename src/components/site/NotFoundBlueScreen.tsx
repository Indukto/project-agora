import { useEffect } from "react";
import { useNavigate } from "react-router";

/**
 * The desktop 404: a full-screen blue screen, in the manner of the crash dialogs
 * a Windows 3.1 or 95 machine used to show.
 *
 * Nothing here moves and nothing here is a control. The only way out is the
 * keyboard — press any key and you are back at the landing page — which is the
 * whole joke and also the whole behaviour: a key handler is the one input a
 * touch device cannot produce, which is why the blue screen is gated behind
 * `useCoarsePointer` and never rendered on a phone.
 *
 * The keydown handler is bound on `window` and removed on unmount, so it does
 * not survive navigation. It deliberately does not call `preventDefault`: a
 * visitor who hits Ctrl+R to reload should still reload, and coming back to the
 * blue screen is the honest outcome rather than a swallowed keystroke.
 *
 * The role is `alert`, and it was `alertdialog` until this was looked at
 * properly. A dialog role promises three things this page does not do: it
 * traps focus, it is modal, and it manages focus on open. Nothing here is
 * focusable — there is not one link or button — and focus is never moved into
 * it. An `alert` is a live region for an important message, which is exactly
 * what a route change into "that address does not exist" is, and it carries no
 * focus contract to break. `aria-describedby` was dropped at the same time: in
 * a live region the body text is both the content and the description, and
 * pointing at it invites the screen reader to say it twice.
 *
 * System blue is `#0000AA` — the literal background colour of the original
 * dialogs, not a designer's approximation of it. The type is the project's
 * `font-mono` (Roboto Mono), and `font-mono` is re-asserted on the heading
 * because `src/index.css` sets `font-display` on every `h1`–`h4` in the base
 * layer.
 */
export function NotFoundBlueScreen({ attemptedPath }: { attemptedPath: string }) {
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = () => {
      navigate("/");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate]);

  return (
    <div className="flex min-h-[100svh] w-full items-center justify-center bg-[#0000AA] p-4 sm:p-8">
      <div
        role="alert"
        aria-labelledby="bsod-title"
        className="w-full max-w-xl border-2 border-white font-mono text-white"
      >
        <p className="border-b-2 border-white px-4 py-2 text-sm sm:px-6 sm:text-base">
          *&nbsp; STOP: 0x00000404
        </p>

        <div className="space-y-4 px-4 py-5 sm:px-6 sm:py-6">
          <h1
            id="bsod-title"
            className="font-mono text-base font-normal tracking-normal sm:text-lg"
          >
            AGORA_FRAME_NOT_FOUND
          </h1>

          <div className="space-y-4 text-sm sm:text-base">
            <p>
              Diese Adresse hat das Gateway nicht ausgeliefert. Der Frame ist
              angekommen, die Antwort nicht.
            </p>

            <dl className="space-y-1">
              <div className="flex gap-3">
                <dt className="shrink-0 opacity-70">MODUL</dt>
                <dd className="break-all">ROUTER</dd>
              </div>
              <div className="flex gap-3">
                <dt className="shrink-0 opacity-70">PFAD</dt>
                <dd className="break-all">{attemptedPath}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="shrink-0 opacity-70">CODE</dt>
                <dd>0x00000404</dd>
              </div>
            </dl>
          </div>
        </div>

        <p className="bg-white px-4 py-2 text-sm text-[#0000AA] sm:px-6 sm:text-base">
          Beliebige Taste drücken, um zur Startseite zurückzukehren
        </p>
      </div>
    </div>
  );
}
