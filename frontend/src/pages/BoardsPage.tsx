import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Icon } from "@/components/Icon";
import { CreateBoardForm } from "@/features/boards/CreateBoardForm";
import { useBoards, useDeleteBoard } from "@/features/boards/hooks";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function BoardsPage() {
  const { data: boards, isLoading, isError } = useBoards();
  const deleteBoard = useDeleteBoard();
  const [boardToDelete, setBoardToDelete] = useState<{ id: number; name: string } | null>(null);

  if (isLoading) {
    return <p className="status">Chargement des boards...</p>;
  }

  if (isError) {
    return <p className="status status--error">Impossible de charger les boards.</p>;
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1>Vos boards</h1>
          <p className="text-muted">Créez et gérez vos espaces de travail.</p>
        </div>
        <CreateBoardForm />
      </div>

      <ul className="list">
        {boards?.map((board) => (
          <li key={board.id} className="list-item">
            <Link to={`/boards/${board.id}`} className="list-item__title">
              <Icon name="boards" className="icon" />
              <span>{board.name}</span>
            </Link>
            <button
              type="button"
              className="btn btn-danger btn-icon"
              aria-label={`Supprimer le board ${board.name}`}
              title="Supprimer"
              onClick={() => setBoardToDelete({ id: board.id, name: board.name })}
            >
              <Icon name="trash" className="icon" />
            </button>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        isOpen={Boolean(boardToDelete)}
        title="Supprimer ce board ?"
        description={
          boardToDelete
            ? `Le board "${boardToDelete.name}" sera définitivement supprimé.`
            : ""
        }
        confirmLabel="Supprimer le board"
        isLoading={deleteBoard.isPending}
        onCancel={() => setBoardToDelete(null)}
        onConfirm={async () => {
          if (!boardToDelete) return;
          await deleteBoard.mutateAsync(boardToDelete.id);
          setBoardToDelete(null);
        }}
      />
    </div>
  );
}
