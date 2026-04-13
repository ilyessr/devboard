import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCard, deleteCard, getCards, updateCard } from "./api";

export function useCards(columnId: number) {
  return useQuery({
    queryKey: ["columns", columnId, "cards"],
    queryFn: () => getCards(columnId),
    enabled: !!columnId,
  });
}

export function useCreateCard(columnId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { title: string; description?: string }) =>
      createCard(columnId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["columns", columnId, "cards"],
      });
    },
  });
}

export function useDeleteCard(columnId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["columns", columnId, "cards"],
      });
    },
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cardId,
      input,
    }: {
      cardId: number;
      input: { title?: string; description?: string; column?: number; position?: number };
    }) => updateCard(cardId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
    },
  });
}
