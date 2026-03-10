import type { Column } from "./types";
import { useDeleteColumn } from "./hooks";
import { ColumnCardList } from "@/features/cards/ColumnCardList";

type Props = {
  column: Column;
  boardId: number;
};

export function ColumnPanel({ column, boardId }: Props) {
  const deleteColumn = useDeleteColumn(boardId);

  return (
    <div
      style={{
        minWidth: 280,
        padding: 16,
        border: "1px solid #ddd",
        borderRadius: 8,
        background: "#fafafa",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          gap: 8,
        }}
      >
        <strong>{column.name}</strong>

        <button onClick={() => deleteColumn.mutate(column.id)}>Delete</button>
      </div>

      <ColumnCardList columnId={column.id} />
    </div>
  );
}
