import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Guides = lazy(() => import("./pages/Guides.tsx"));
const Range = lazy(() => import("./pages/Range.tsx"));
// AGORA — the school project's own pages. The English guides and range pages
// above stay as the technical documentation they were written to be.
const Live = lazy(() => import("./pages/Live.tsx"));
const Statistics = lazy(() => import("./pages/Statistics.tsx"));
const MapPage = lazy(() => import("./pages/Map.tsx"));
const Station = lazy(() => import("./pages/Station.tsx"));
const LoRaWan = lazy(() => import("./pages/LoRaWan.tsx"));
const Radio = lazy(() => import("./pages/Radio.tsx"));
const Glossary = lazy(() => import("./pages/Glossary.tsx"));
const Project = lazy(() => import("./pages/Project.tsx"));
const ExportPage = lazy(() => import("./pages/Export.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

/** Silent error boundary — if VlyToolbar crashes it renders nothing instead of
 *  crashing the whole app (e.g. hook errors in the browser runtime). */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[Preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold">Preview runtime error</p>
            <p className="mt-2 text-xs text-muted-foreground break-words">
              {this.state.message}
            </p>
            {this.state.stack && (
              <pre className="mt-3 text-left text-[10px] leading-4 text-muted-foreground/80 max-h-40 overflow-auto rounded border border-border/60 p-2">
                {this.state.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);



function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}


// GitHub Pages serves public/404.html for client-side routes, which parks the
// requested path here and redirects to "/". Restore it before the router reads
// the URL, so a hard load of /guides or the auth /callback lands on the right
// route instead of the landing page. Runs before createRoot on purpose — the
// replaceState has to be visible to the first render.
const parkedPath = sessionStorage.getItem("pages-spa-path");
if (parkedPath) {
  sessionStorage.removeItem("pages-spa-path");
  window.history.replaceState(null, "", parkedPath);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <RouteSyncer />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/live" element={<Live />} />
              <Route path="/statistiken" element={<Statistics />} />
              <Route path="/karte" element={<MapPage />} />
              <Route path="/station" element={<Station />} />
              <Route path="/lorawan" element={<LoRaWan />} />
              <Route path="/funktechnik" element={<Radio />} />
              <Route path="/glossar" element={<Glossary />} />
              <Route path="/projekt" element={<Project />} />
              <Route path="/export" element={<ExportPage />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/range" element={<Range />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
