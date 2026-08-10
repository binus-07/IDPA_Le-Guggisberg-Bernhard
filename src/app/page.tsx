export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-background px-6 py-24 text-foreground">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-lg border border-border bg-card p-8 text-center text-card-foreground shadow-sm">
        <h1 className="font-heading text-4xl uppercase tracking-wide">Hello World</h1>
        <p className="font-sans text-base text-muted-foreground">
          IDPA Marketing-Freelancer-Plattform &ndash; Phase A Fundament. Diese Seite nutzt die
          Design-Tokens: Anton fuer Titel, Inter fuer Fliesstext, 8px Border-Radius.
        </p>
        <button
          type="button"
          className="rounded-lg bg-primary px-5 py-2 font-sans text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          Los geht&apos;s
        </button>
      </div>
    </main>
  );
}
