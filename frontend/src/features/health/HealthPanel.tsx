import { useHealth } from "./useHealth";

export function HealthPanel() {
  const { data, isLoading, isError, error } = useHealth();

  return (
    <section style={{ marginTop: 16 }}>
      <h2 style={{ fontSize: 18 }}>Health</h2>
      {isLoading && <p>Loading…</p>}
      {isError && (
        <p style={{ color: "crimson" }}>
          {(error as Error)?.message ?? "Erreur"}
        </p>
      )}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </section>
  );
}
