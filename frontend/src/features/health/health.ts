import { apiClient } from "@/lib/apiClient";

export type Health = { status: string };

export async function getHealth(): Promise<Health> {
  const { data } = await apiClient.get<Health>("health/");
  return data;
}
