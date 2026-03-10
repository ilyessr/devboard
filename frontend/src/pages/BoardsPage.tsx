import { useBoards, useDeleteBoard } from "@/features/boards/hooks";
import { CreateBoardForm } from "@/features/boards/CreateBoardForm";
import { Link } from "react-router-dom";

export default function BoardsPage() {
  const { data: boards, isLoading, isError } = useBoards();
  const deleteBoard = useDeleteBoard();

  if (isLoading) {
    return <p>Loading boards...</p>;
  }

  if (isError) {
    return <p>Failed to load boards.</p>;
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Your Boards</h1>

      <CreateBoardForm />

      <ul style={{ marginTop: 24 }}>
        {boards?.map((board) => (
          <li
            key={board.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Link to={`/boards/${board.id}`}>{board.name}</Link>

            <button onClick={() => deleteBoard.mutate(board.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
