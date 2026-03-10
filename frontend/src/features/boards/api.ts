import { apiClient } from "@/lib/apiClient";
import type { Board } from "./types";

export async function getBoards(): Promise<Board[]> {
  const res = await apiClient.get("boards/");
  return res.data;
}

export async function getBoard(boardId: number): Promise<Board> {
  const res = await apiClient.get(`boards/${boardId}/`);
  return res.data;
}

export async function createBoard(input: { name: string }): Promise<Board> {
  const res = await apiClient.post("boards/", input);
  return res.data;
}

export async function deleteBoard(id: number): Promise<void> {
  await apiClient.delete(`boards/${id}/`);
}
