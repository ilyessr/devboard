import { useState } from "react";
import { useBoards, useCreateBoard } from "./hooks";

export function BoardsList() {
  const { data, isLoading, isError, error } = useBoards();
  const create = useCreateBoard();
  const [name, setName] = useState("");

  return (
    <div style={{ maxWidth: 520 }}>
      <h2 style={{ marginBottom: 12 }}>Your boards</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          create.mutate({ name: name.trim() });
          setName("");
        }}
        style={{ display: "flex", gap: 8, marginBottom: 16 }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New board name"
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" disabled={create.isPending}>
          {create.isPending ? "Creating…" : "Create"}
        </button>
      </form>

      {isLoading && <p>Loading…</p>}
      {isError && (
        <p style={{ color: "crimson" }}>
          {(error as Error)?.message ?? "Failed to load"}
        </p>
      )}

      {data && data.length === 0 && <p>No boards yet.</p>}

      {data && data.length > 0 && (
        <ul style={{ paddingLeft: 16 }}>
          {data.map((b) => (
            <li key={b.id}>{b.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
