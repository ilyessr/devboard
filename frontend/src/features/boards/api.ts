import { apiClient } from "@/lib/apiClient";

export type Board = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export async function listBoards(): Promise<Board[]> {
  const res = await apiClient.get<Board[]>("boards/");
  return res.data;
}

export async function createBoard(input: { name: string }): Promise<Board> {
  const res = await apiClient.post<Board>("boards/", input);
  return res.data;
}
