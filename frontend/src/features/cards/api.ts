import { apiClient } from "@/lib/apiClient";
import type { Card } from "./types";

export async function getCards(columnId: number): Promise<Card[]> {
  const res = await apiClient.get(`boards/columns/${columnId}/cards/`);
  return res.data;
}

export async function createCard(
  columnId: number,
  input: { title: string; description?: string },
): Promise<Card> {
  const res = await apiClient.post(`boards/columns/${columnId}/cards/`, input);
  return res.data;
}

export async function deleteCard(cardId: number): Promise<void> {
  await apiClient.delete(`boards/cards/${cardId}/`);
}
