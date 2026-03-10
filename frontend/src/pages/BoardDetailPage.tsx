import { useParams } from "react-router-dom";
import { useBoard } from "@/features/boards/hooks";
import { useColumns } from "@/features/columns/hooks";
import { CreateColumnForm } from "@/features/columns/CreateColumnForm";
import { ColumnPanel } from "@/features/columns/ColumnPanel";

export default function BoardDetailPage() {
  const params = useParams();
  const boardId = Number(params.boardId);

  const {
    data: board,
    isLoading: boardLoading,
    isError: boardError,
  } = useBoard(boardId);
  const {
    data: columns,
    isLoading: columnsLoading,
    isError: columnsError,
  } = useColumns(boardId);

  if (!boardId || Number.isNaN(boardId)) {
    return <p>Invalid board id.</p>;
  }

  if (boardLoading) {
    return <p>Loading board...</p>;
  }

  if (boardError || !board) {
    return <p>Board not found.</p>;
  }

  return (
    <div style={{ maxWidth: 1000 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>{board.name}</h1>

      <p style={{ opacity: 0.7, marginTop: 0 }}>Board ID: {board.id}</p>

      <CreateColumnForm boardId={boardId} />

      {columnsLoading && <p>Loading columns...</p>}
      {columnsError && <p>Failed to load columns.</p>}

      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "flex-start",
          overflowX: "auto",
          paddingTop: 8,
        }}
      >
        {columns?.map((column) => (
          <ColumnPanel key={column.id} column={column} boardId={boardId} />
        ))}
      </div>
    </div>
  );
}
