import { useEffect, useState } from "react";

type Health = { status: string };

export default function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHealth({ status: "frontend ok" });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>DevBoard</h1>
      <section style={{ marginTop: 16 }}>
        <h2>Health</h2>

        {error ? (
          <p style={{ color: "crimson" }}>{error}</p>
        ) : health ? (
          <p>{JSON.stringify(health, null, 2)}</p>
        ) : (
          <p>Loading...</p>
        )}
      </section>
    </main>
  );
}
