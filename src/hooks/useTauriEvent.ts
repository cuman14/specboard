import { useEffect, useRef } from "react";
import { isTauri } from "@/lib/tauri-commands";

type EventCallback = (payload: unknown) => void;

export function useTauriEvent(event: string, callback: EventCallback) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!isTauri) return;

    let unlisten: (() => void) | null = null;
    let cancelled = false;

    import("@tauri-apps/api/event").then(({ listen }) => {
      if (cancelled) return;
      listen(event, (e) => callbackRef.current(e.payload)).then((fn) => {
        unlisten = fn;
      });
    });

    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, [event]);
}
