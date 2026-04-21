"use client";

/**
 * WHY: Newsletter form requires client-side interactivity (onSubmit),
 * so it must be a Client Component extracted from the server-rendered Footer.
 */
export const NewsletterForm = () => {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-2"
    >
      <input
        type="email"
        placeholder="you@example.com"
        aria-label="Email address for newsletter"
        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
      />
      <button
        type="submit"
        className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-emerald-600 hover:to-teal-700"
      >
        Subscribe
      </button>
    </form>
  );
};
