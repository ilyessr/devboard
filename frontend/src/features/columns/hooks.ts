import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createColumn, deleteColumn, getColumns, updateColumn } from "./api";

export function useColumns(boardId: number) {
  return useQuery({
    queryKey: ["boards", boardId, "columns"],
    queryFn: () => getColumns(boardId),
    enabled: !!boardId,
  });
}

export function useCreateColumn(boardId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { name: string }) => createColumn(boardId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards", boardId, "columns"],
      });
    },
  });
}

export function useDeleteColumn(boardId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteColumn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards", boardId, "columns"],
      });
    },
  });
}

export function useUpdateColumn(boardId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ columnId, input }: { columnId: number; input: { name: string } }) =>
      updateColumn(columnId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards", boardId, "columns"],
      });
    },
  });
}
