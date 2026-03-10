import { CreateCardForm } from "./CreatedCardForm";
import { useCards, useDeleteCard } from "./hooks";

type Props = {
  columnId: number;
};

export function ColumnCardList({ columnId }: Props) {
  const { data: cards, isLoading, isError } = useCards(columnId);
  const deleteCard = useDeleteCard(columnId);

  return (
    <div>
      <CreateCardForm columnId={columnId} />

      {isLoading && <p>Loading cards...</p>}
      {isError && <p>Failed to load cards.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {cards?.map((card) => (
          <div
            key={card.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
              background: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <strong>{card.title}</strong>
              <button onClick={() => deleteCard.mutate(card.id)}>Delete</button>
            </div>

            {card.description && (
              <p style={{ margin: 0, opacity: 0.8 }}>{card.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
