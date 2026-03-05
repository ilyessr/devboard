import { BoardsList } from "@/features/boards/BoardList";

export default function BoardsPage() {
  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Boards</h1>
      <BoardsList />
    </div>
  );
}
