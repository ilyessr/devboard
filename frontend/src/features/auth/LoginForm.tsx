import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLogin } from "./hooks";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const login = useLogin();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <input placeholder="Email" {...register("email")} />
        {errors.email && (
          <p style={{ color: "red", margin: 0 }}>{errors.email.message}</p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && (
          <p style={{ color: "red", margin: 0 }}>{errors.password.message}</p>
        )}
      </div>

      <button type="submit" disabled={login.isPending}>
        {login.isPending ? "Signing in..." : "Login"}
      </button>

      {login.isError && (
        <p style={{ color: "red", margin: 0 }}>
          Invalid credentials or server error.
        </p>
      )}
    </form>
  );
}
