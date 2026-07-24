export const APP_MAIN_SCROLL_ID = "app-main-scroll";

/** Lock the in-app scroll container (not window) while overlays are open — fixes iOS lightbox offset. */
export function lockAppMainScroll(): () => void {
  const main = document.getElementById(APP_MAIN_SCROLL_ID);
  const savedTop = main?.scrollTop ?? 0;
  const prevOverflow = main?.style.overflow ?? "";

  if (main) main.style.overflow = "hidden";
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = "";
    if (main) {
      main.style.overflow = prevOverflow;
      main.scrollTop = savedTop;
    }
  };
}
