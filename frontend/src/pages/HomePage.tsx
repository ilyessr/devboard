import { HealthPanel } from "@/features/health/HealthPanel";

export default function HomePage() {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>DevBoard</h1>
      <HealthPanel />
    </div>
  );
}
