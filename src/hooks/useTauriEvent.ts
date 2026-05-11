import { useEffect } from "react";
import { isTauri } from "@/lib/tauri-commands";

type EventCallback = (payload: unknown) => void;

export function useTauriEvent(event: string, callback: EventCallback) {
  useEffect(() => {
    if (!isTauri) return;

    let unlisten: (() => void) | null = null;

    import("@tauri-apps/api/event").then(({ listen }) => {
      listen(event, (e) => callback(e.payload)).then((fn) => {
        unlisten = fn;
      });
    });

    return () => {
      unlisten?.();
    };
  }, [event, callback]);
}
