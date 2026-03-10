import { useParams } from "react-router-dom";
import { useBoard } from "@/features/boards/hooks";

export default function BoardDetailPage() {
  const params = useParams();
  const boardId = Number(params.boardId);

  const { data: board, isLoading, isError } = useBoard(boardId);

  if (!boardId || Number.isNaN(boardId)) {
    return <p>Invalid board id.</p>;
  }

  if (isLoading) {
    return <p>Loading board...</p>;
  }

  if (isError || !board) {
    return <p>Board not found.</p>;
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>{board.name}</h1>

      <p style={{ opacity: 0.7, marginTop: 0 }}>Board ID: {board.id}</p>

      <div style={{ marginTop: 24 }}>
        <p>This is the board detail page.</p>
      </div>
    </div>
  );
}
