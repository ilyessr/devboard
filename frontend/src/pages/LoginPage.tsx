import { useState } from "react";
import { useLogin } from "@/features/auth/hooks";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const login = useLogin();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <h1>Login</h1>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={async () => {
          await login.mutateAsync({ email, password });
          navigate("/boards");
        }}
      >
        Login
      </button>
    </div>
  );
}
