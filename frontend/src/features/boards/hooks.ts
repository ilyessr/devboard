import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBoard, listBoards } from "./api";

export function useBoards() {
  return useQuery({
    queryKey: ["boards"],
    queryFn: listBoards,
  });
}

export function useCreateBoard() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}
