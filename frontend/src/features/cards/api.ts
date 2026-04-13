import { apiClient } from "@/lib/apiClient";
import type { Card } from "./types";

export async function getCards(columnId: number): Promise<Card[]> {
  const res = await apiClient.get(`boards/columns/${columnId}/cards/`);
  return res.data;
}

export async function createCard(
  columnId: number,
  input: { title: string; description?: string; due_date?: string | null },
): Promise<Card> {
  const res = await apiClient.post(`boards/columns/${columnId}/cards/`, input);
  return res.data;
}

export async function deleteCard(cardId: number): Promise<void> {
  await apiClient.delete(`boards/cards/${cardId}/`);
}

export async function updateCard(
  cardId: number,
  input: {
    title?: string;
    description?: string;
    due_date?: string | null;
    column?: number;
    position?: number;
  },
): Promise<Card> {
  const res = await apiClient.patch(`boards/cards/${cardId}/`, input);
  return res.data;
}
