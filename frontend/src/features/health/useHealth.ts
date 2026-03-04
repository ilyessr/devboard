import { useQuery } from "@tanstack/react-query";
import { getHealth, type Health } from "./health";

export function useHealth() {
  return useQuery<Health>({
    queryKey: ["health"],
    queryFn: getHealth,
  });
}
