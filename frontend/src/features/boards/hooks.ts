import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBoard, deleteBoard, getBoard, getBoards } from "./api";

export function useBoards() {
  return useQuery({
    queryKey: ["boards"],
    queryFn: getBoards,
  });
}

export function useBoard(boardId: number) {
  return useQuery({
    queryKey: ["boards", boardId],
    queryFn: () => getBoard(boardId),
    enabled: !!boardId,
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}
