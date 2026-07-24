"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-dvh items-center justify-center bg-[#f6f3ec] p-6 font-sans text-[#1a2628]">
        <div className="max-w-md rounded-2xl border border-[#e5dcc8] bg-white p-6 shadow-sm">
          <h1 className="text-lg font-semibold">Something went wrong</h1>
          <p className="mt-2 text-sm text-[#5a686c]">
            If this is on Vercel, open <strong>/api/health</strong> after login to see if Turso is
            configured. Hard-refresh the page (404 on a .js file often means an old cached build).
          </p>
          {error.digest && (
            <p className="mt-2 font-mono text-xs text-[#5a686c]">Ref: {error.digest}</p>
          )}
          <button
            type="button"
            onClick={() => reset()}
            className="mt-4 w-full rounded-xl bg-[#3d5c54] py-3 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
