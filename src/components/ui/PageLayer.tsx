import { useEffect, useRef, useState, type ReactNode } from "react";
import { colors } from "@/theme/tokens";
import { useEdgeSwipeBack } from "@/hooks/useEdgeSwipeBack";

const DURATION = 320;

/**
 * Vrstva podstránky s push animáciou (slide zprava).
 * – `open + pageKey` → vrstva vkĺzne dovnútra; pri zmene pageKey sa animácia zopakuje
 * – keď sa `open` zmení na false, vrstva vykĺzne doprava a až potom sa odmontuje
 * – pod vrstvou ostáva Dashboard (návrat „domov" je viditeľný)
 * – gesto od ľavého okraja zavolá onBack
 */
export default function PageLayer({ open, pageKey, onBack, children }: {
  open: boolean;
  pageKey: string | null;
  onBack: () => void;
  children: ReactNode;
}) {
  const [reduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true
      : false
  );
  const dur = reduced ? 0 : DURATION;

  const [show, setShow] = useState(false);        // vrstva je v DOM
  const [content, setContent] = useState<ReactNode | null>(null); // posledná stránka (aj pri odchode)
  const [slideIn, setSlideIn] = useState(false);  // transform 0 vs translateX(100%)
  const [closing, setClosing] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  // Otvorenie / zmena stránky
  useEffect(() => {
    if (open && pageKey) {
      window.clearTimeout(timer.current);
      setContent(children);
      setShow(true);
      setClosing(false);
      setSlideIn(false);
      timer.current = window.setTimeout(() => setSlideIn(true), 30);
    }
  }, [open, pageKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Zatvorenie (návrat domov / späť)
  useEffect(() => {
    if (!open && show) {
      setSlideIn(false);
      setClosing(true);
      timer.current = window.setTimeout(() => {
        setShow(false);
        setContent(null);
        setClosing(false);
      }, dur + 60);
    }
  }, [open, show]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const swipe = useEdgeSwipeBack(show && !!content && !closing, onBack);

  if (!show || !content) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 25,
        background: colors.white,
        transform: slideIn ? "translateX(0%)" : "translateX(100%)",
        transition: reduced ? "none" : `transform ${DURATION}ms cubic-bezier(0.32, 0.72, 0, 1)`,
        overflow: "hidden",
      }}
      {...swipe}
    >
      <div style={{ position: "absolute", inset: 0, maxWidth: 430, margin: "0 auto", background: colors.white, overflowY: "auto", overflowX: "hidden" }}>
        {content}
      </div>
    </div>
  );
}
