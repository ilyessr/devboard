import { useForm } from "react-hook-form";
import { useLogin } from "./hooks";
import { useNavigate } from "react-router-dom";
import type { LoginFormValues } from "./types";

export function LoginForm() {
  const { register, handleSubmit } = useForm<LoginFormValues>();
  const login = useLogin();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormValues) => {
    await login.mutateAsync(data);
    navigate("/boards");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maxWidth: 400,
      }}
    >
      <input
        placeholder="Email"
        {...register("email", { required: "Email is required" })}
      />

      <input
        type="password"
        placeholder="Password"
        {...register("password", { required: "Password is required" })}
      />

      <button type="submit" disabled={login.isPending}>
        {login.isPending ? "Signing in..." : "Login"}
      </button>

      {login.isError && <p style={{ color: "red" }}>Invalid credentials</p>}
    </form>
  );
}
