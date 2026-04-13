import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EntityMenu } from "@/components/EntityMenu";
import { Icon } from "@/components/Icon";
import { Modal } from "@/components/Modal";
import type { Card } from "@/features/cards/types";
import type { DragEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreateCardForm } from "./CreatedCardForm";
import { useCards, useDeleteCard, useUpdateCard } from "./hooks";

const DND_CARD_MIME = "application/x-devboard-card";
const DND_CARD_FALLBACK_MIME = "text/plain";
const CARD_DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const updateCardSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Le titre doit contenir au moins 2 caractères")
    .max(100, "Le titre doit contenir au maximum 100 caractères"),
  description: z
    .string()
    .trim()
    .max(500, "La description doit contenir au maximum 500 caractères")
    .optional()
    .or(z.literal("")),
  due_date: z.string().optional().or(z.literal("")),
});

type UpdateCardFormValues = z.infer<typeof updateCardSchema>;

type DragCardPayload = {
  cardId: number;
  fromColumnId: number;
};

type Props = {
  columnId: number;
};

function isDndCard(event: DragEvent): boolean {
  return (
    event.dataTransfer.types.includes(DND_CARD_MIME) ||
    event.dataTransfer.types.includes(DND_CARD_FALLBACK_MIME)
  );
}

function parseDraggedCard(event: DragEvent): DragCardPayload | null {
  const raw =
    event.dataTransfer.getData(DND_CARD_MIME) ||
    event.dataTransfer.getData(DND_CARD_FALLBACK_MIME);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as DragCardPayload;
    if (!parsed.cardId || !parsed.fromColumnId) return null;
    return parsed;
  } catch {
    return null;
  }
}

function formatCardDate(value: string): string {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return CARD_DATE_FORMATTER.format(parsed);
}

export function ColumnCardList({ columnId }: Props) {
  const { data: cards, isLoading, isError } = useCards(columnId);
  const deleteCard = useDeleteCard(columnId);
  const updateCard = useUpdateCard();

  const [cardToDelete, setCardToDelete] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [cardToEdit, setCardToEdit] = useState<Card | null>(null);
  const [orderedCardIds, setOrderedCardIds] = useState<number[]>([]);
  const [draggedCardId, setDraggedCardId] = useState<number | null>(null);
  const [isDropTargetActive, setIsDropTargetActive] = useState(false);
  const [dropIndicator, setDropIndicator] = useState<{
    cardId: number;
    placeAfter: boolean;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateCardFormValues>({
    resolver: zodResolver(updateCardSchema),
    defaultValues: { title: "", description: "", due_date: "" },
  });

  useEffect(() => {
    setOrderedCardIds((prev) => {
      const next = (cards ?? []).map((card) => card.id);
      if (prev.length === 0) return next;
      const persisted = prev.filter((id) => next.includes(id));
      const appended = next.filter((id) => !persisted.includes(id));
      return [...persisted, ...appended];
    });
  }, [cards]);

  useEffect(() => {
    if (!cardToEdit) return;
    reset({
      title: cardToEdit.title,
      description: cardToEdit.description || "",
      due_date: cardToEdit.due_date || "",
    });
  }, [cardToEdit, reset]);

  const cardById = useMemo(() => {
    const map = new Map<number, Card>();
    (cards ?? []).forEach((card) => map.set(card.id, card));
    return map;
  }, [cards]);

  const orderedCards = useMemo(
    () =>
      orderedCardIds
        .map((id) => cardById.get(id))
        .filter((card): card is Card => Boolean(card)),
    [orderedCardIds, cardById],
  );

  const getDropPosition = (
    payload: DragCardPayload,
    targetCardId: number,
    placeAfter: boolean,
  ): number => {
    const targetIndex = orderedCardIds.indexOf(targetCardId);
    if (targetIndex < 0) return orderedCards.length;

    let dropIndex = placeAfter ? targetIndex + 1 : targetIndex;

    if (payload.fromColumnId === columnId) {
      const sourceIndex = orderedCardIds.indexOf(payload.cardId);
      if (sourceIndex < 0) return targetIndex;
      if (sourceIndex < dropIndex) dropIndex -= 1;
      return Math.max(0, Math.min(dropIndex, orderedCards.length - 1));
    }

    return Math.max(0, Math.min(dropIndex, orderedCards.length));
  };

  const persistCardMove = async (
    payload: DragCardPayload,
    targetPosition: number,
  ) => {
    if (payload.fromColumnId === columnId) {
      setOrderedCardIds((prev) => {
        const next = [...prev];
        const fromIdx = next.indexOf(payload.cardId);
        if (fromIdx < 0) return prev;
        next.splice(fromIdx, 1);
        next.splice(targetPosition, 0, payload.cardId);
        return next;
      });
    }

    await updateCard.mutateAsync({
      cardId: payload.cardId,
      input: { column: columnId, position: targetPosition },
    });
  };

  const onCardEditSubmit = async (data: UpdateCardFormValues) => {
    if (!cardToEdit) return;
    await updateCard.mutateAsync({
      cardId: cardToEdit.id,
      input: {
        ...data,
        due_date: data.due_date || null,
      },
    });
    setCardToEdit(null);
  };

  const resetDragState = () => {
    setIsDropTargetActive(false);
    setDropIndicator(null);
  };

  return (
    <div
      className={`cards${isDropTargetActive ? " cards--drop-active" : ""}`}
      onDragOver={(event) => {
        if (!isDndCard(event)) return;
        event.preventDefault();
        // Ne pas stopPropagation ici — laisser les articles recevoir leurs propres événements
        setIsDropTargetActive(true);
      }}
      onDragLeave={(event) => {
        // Seulement reset si on quitte vraiment le conteneur (pas juste une carte enfant)
        const related = event.relatedTarget as HTMLElement | null;
        if (related && event.currentTarget.contains(related)) return;
        resetDragState();
      }}
      onDrop={async (event) => {
        if (!isDndCard(event)) return;
        event.preventDefault();
        event.stopPropagation();

        // Si le drop atterrit sur une carte, elle gère elle-même via son propre onDrop
        const targetArticle = (event.target as HTMLElement).closest("article");
        if (targetArticle) return;

        const payload = parseDraggedCard(event);
        resetDragState();
        if (!payload) return;
        // Drop dans la zone vide en bas de la liste → append
        await persistCardMove(payload, orderedCards.length);
      }}
    >
      <CreateCardForm columnId={columnId} />

      {isLoading && <p className="status">Chargement des cartes...</p>}
      {isError && (
        <p className="status status--error">
          Impossible de charger les cartes.
        </p>
      )}

      <div className="cards__list">
        {orderedCards.map((card) => (
          <article
            key={card.id}
            className={[
              "card-item",
              draggedCardId === card.id ? "card-item--dragging" : "",
              dropIndicator?.cardId === card.id
                ? dropIndicator.placeAfter
                  ? "card-item--drop-after"
                  : "card-item--drop-before"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            draggable
            onDragStart={(event) => {
              event.stopPropagation();
              setDraggedCardId(card.id);
              event.dataTransfer.effectAllowed = "move";
              const payload = JSON.stringify({
                cardId: card.id,
                fromColumnId: columnId,
              });
              event.dataTransfer.setData(DND_CARD_MIME, payload);
              event.dataTransfer.setData(DND_CARD_FALLBACK_MIME, payload);
            }}
            onDragOver={(event) => {
              event.stopPropagation();
              event.preventDefault();
              if (!isDndCard(event)) return;
              // Calcul de la position relative dans la carte
              const rect = event.currentTarget.getBoundingClientRect();
              const placeAfter = event.clientY > rect.top + rect.height / 2;
              // Éviter les re-renders inutiles si rien n'a changé
              setDropIndicator((prev) => {
                if (
                  prev?.cardId === card.id &&
                  prev?.placeAfter === placeAfter
                ) {
                  return prev;
                }
                return { cardId: card.id, placeAfter };
              });
            }}
            onDrop={async (event) => {
              event.preventDefault();
              event.stopPropagation();
              if (!isDndCard(event)) return;
              const payload = parseDraggedCard(event);
              resetDragState();
              if (!payload) return;
              // Ne pas déplacer une carte sur elle-même
              if (payload.cardId === card.id) return;
              const rect = event.currentTarget.getBoundingClientRect();
              const placeAfter = event.clientY > rect.top + rect.height / 2;
              await persistCardMove(
                payload,
                getDropPosition(payload, card.id, placeAfter),
              );
            }}
            onDragEnd={() => {
              setDraggedCardId(null);
              resetDragState();
            }}
          >
            <div className="card-item__header">
              <h3 className="card-item__title">{card.title}</h3>
              <EntityMenu
                label={`carte ${card.title}`}
                onEdit={() => setCardToEdit(card)}
                onDelete={() =>
                  setCardToDelete({ id: card.id, title: card.title })
                }
              />
            </div>
            {card.description && (
              <p className="text-muted card-item__description">{card.description}</p>
            )}
            {card.due_date && (
              <p className="card-item__date" aria-label={`Echeance ${formatCardDate(card.due_date)}`}>
                <Icon name="calendar" className="icon card-item__date-icon" />
                <span>{formatCardDate(card.due_date)}</span>
              </p>
            )}
          </article>
        ))}
      </div>

      <Modal
        isOpen={Boolean(cardToEdit)}
        onClose={() => setCardToEdit(null)}
        title="Modifier la carte"
      >
        <form className="form-stack" onSubmit={handleSubmit(onCardEditSubmit)}>
          <label className="field">
            <span>Titre</span>
            <input placeholder="Titre" {...register("title")} />
            {errors.title && (
              <p className="field-error">{errors.title.message}</p>
            )}
          </label>
          <label className="field">
            <span>Description</span>
            <textarea
              rows={4}
              placeholder="Description"
              {...register("description")}
            />
            {errors.description && (
              <p className="field-error">{errors.description.message}</p>
            )}
          </label>
          <label className="field">
            <span>Date</span>
            <input type="date" {...register("due_date")} />
            {errors.due_date && (
              <p className="field-error">{errors.due_date.message}</p>
            )}
          </label>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={updateCard.isPending}
          >
            {updateCard.isPending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(cardToDelete)}
        title="Supprimer cette carte ?"
        description={
          cardToDelete
            ? `La carte "${cardToDelete.title}" sera définitivement supprimée.`
            : ""
        }
        confirmLabel="Supprimer la carte"
        isLoading={deleteCard.isPending}
        onCancel={() => setCardToDelete(null)}
        onConfirm={async () => {
          if (!cardToDelete) return;
          await deleteCard.mutateAsync(cardToDelete.id);
          setCardToDelete(null);
        }}
      />
    </div>
  );
}
