import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCard, deleteCard, getCards } from "./api";

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
