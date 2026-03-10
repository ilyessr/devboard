import { apiClient } from "@/lib/apiClient";
import type { Column } from "./types";

export async function getColumns(boardId: number): Promise<Column[]> {
  const res = await apiClient.get(`boards/${boardId}/columns/`);
  return res.data;
}

export async function createColumn(
  boardId: number,
  input: { name: string },
): Promise<Column> {
  const res = await apiClient.post(`boards/${boardId}/columns/`, input);
  return res.data;
}

export async function deleteColumn(columnId: number): Promise<void> {
  await apiClient.delete(`boards/columns/${columnId}/`);
}
