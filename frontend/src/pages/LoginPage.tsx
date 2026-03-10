import { LoginForm } from "@/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <div
      style={{
        maxWidth: 400,
        margin: "40px auto",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <h1 style={{ fontSize: 28 }}>Login</h1>

      <LoginForm />
    </div>
  );
}
