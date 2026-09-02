import { useCallback, useRef } from "react";

/**
 * Gesto „späť" potiahnutím od ľavého okraja doprava (ako natívne apky).
 * – začína len pri dotyku v ľavej zóne (~28 px)
 * – spustí onBack až po prekonaní prahu (dx > 70 px a horizontálna dominancia)
 * Použi spread-vracaných handlerov na root element vrstvy stránky.
 */
export function useEdgeSwipeBack(enabled: boolean, onBack: () => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const fired = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (!enabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    if (localX >= 0 && localX <= 28) {
      start.current = { x: e.clientX, y: e.clientY };
      fired.current = false;
    }
  }, [enabled]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (!enabled || !start.current || fired.current) return;
    const dx = e.clientX - start.current.x;
    const dy = Math.abs(e.clientY - start.current.y);
    if (dx > 70 && dx > dy * 1.3) {
      fired.current = true;
      start.current = null;
      onBack();
    }
  }, [enabled, onBack]);

  const onPointerUp = useCallback(() => { start.current = null; }, []);
  const onPointerCancel = useCallback(() => { start.current = null; }, []);

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel };
}
