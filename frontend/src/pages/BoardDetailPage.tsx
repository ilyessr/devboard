import { Icon } from "@/components/Icon";
import { useBoard } from "@/features/boards/hooks";
import { useColumns } from "@/features/columns/hooks";
import { ColumnPanel } from "@/features/columns/ColumnPanel";
import { CreateColumnForm } from "@/features/columns/CreateColumnForm";
import type { Column } from "@/features/columns/types";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const DND_COLUMN_MIME = "application/x-devboard-column";

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
  const [orderedColumnIds, setOrderedColumnIds] = useState<number[]>([]);
  const [draggedColumnId, setDraggedColumnId] = useState<number | null>(null);

  useEffect(() => {
    setOrderedColumnIds((prev) => {
      const next = (columns ?? []).map((column) => column.id);
      if (prev.length === 0) return next;

      const persisted = prev.filter((id) => next.includes(id));
      const appended = next.filter((id) => !persisted.includes(id));
      return [...persisted, ...appended];
    });
  }, [columns]);

  const columnById = useMemo(() => {
    const map = new Map<number, Column>();
    (columns ?? []).forEach((column) => map.set(column.id, column));
    return map;
  }, [columns]);

  const orderedColumns = useMemo(
    () =>
      orderedColumnIds
        .map((id) => columnById.get(id))
        .filter((column): column is NonNullable<typeof column> => Boolean(column)),
    [orderedColumnIds, columnById],
  );

  const moveColumn = (dragId: number, targetId: number) => {
    if (dragId === targetId) return;
    setOrderedColumnIds((prev) => {
      const next = [...prev];
      const from = next.indexOf(dragId);
      const to = next.indexOf(targetId);
      if (from < 0 || to < 0) return prev;
      next.splice(from, 1);
      next.splice(to, 0, dragId);
      return next;
    });
  };

  if (!boardId || Number.isNaN(boardId)) {
    return <p className="status status--error">ID de board invalide.</p>;
  }

  if (boardLoading) {
    return <p className="status">Chargement du board...</p>;
  }

  if (boardError || !board) {
    return <p className="status status--error">Board introuvable.</p>;
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <Link to="/boards" className="nav-link">
            <Icon name="boards" className="icon" />
            <span>Tous les boards</span>
          </Link>
          <h1>{board.name}</h1>
          <p className="text-muted">Board #{board.id} · Glissez-déposez les colonnes pour réorganiser</p>
        </div>
        <CreateColumnForm boardId={boardId} />
      </div>

      {columnsLoading && <p className="status">Chargement des colonnes...</p>}
      {columnsError && <p className="status status--error">Impossible de charger les colonnes.</p>}

      <div className="columns">
        {orderedColumns.map((column) => (
          <div
            key={column.id}
            className={`column-wrap${draggedColumnId === column.id ? " column-wrap--dragging" : ""}`}
            draggable
            onDragStart={(event) => {
              setDraggedColumnId(column.id);
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData(DND_COLUMN_MIME, String(column.id));
            }}
            onDragOver={(event) => {
              if (!event.dataTransfer.types.includes(DND_COLUMN_MIME)) return;
              event.preventDefault();
              if (draggedColumnId !== null) {
                moveColumn(draggedColumnId, column.id);
              }
            }}
            onDrop={(event) => {
              if (!event.dataTransfer.types.includes(DND_COLUMN_MIME)) return;
              event.preventDefault();
              if (draggedColumnId !== null) {
                moveColumn(draggedColumnId, column.id);
              }
              setDraggedColumnId(null);
            }}
            onDragEnd={() => setDraggedColumnId(null)}
          >
            <ColumnPanel column={column} boardId={boardId} />
          </div>
        ))}
      </div>
    </div>
  );
}
