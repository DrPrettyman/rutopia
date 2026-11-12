import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-6xl tracking-wide">Kapow! Nothing here.</h1>
      <p className="mt-4 text-muted">That page doesn&apos;t exist (or hasn&apos;t been published yet).</p>
      <Link href="/" className="panel panel-hover mt-8 inline-block bg-yellow-300 px-6 py-3 font-display text-2xl">
        Back home
      </Link>
    </main>
  );
}
