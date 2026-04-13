import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useLogin } from "./hooks";

const loginSchema = z.object({
  email: z.email("Veuillez saisir un email valide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
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
      email: "demo@example.com",
      password: "demo1234",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await login.mutateAsync(data);
    navigate("/boards");
  };

  return (
    <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
      <label className="field">
        <span>Email</span>
        <input type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
        {errors.email && <p className="field-error">{errors.email.message}</p>}
      </label>

      <label className="field">
        <span>Mot de passe</span>
        <input
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && <p className="field-error">{errors.password.message}</p>}
      </label>

      <button type="submit" className="btn btn-primary" disabled={login.isPending}>
        {login.isPending ? "Connexion..." : "Se connecter"}
      </button>

      <p className="hint">Demo: demo@example.com / demo1234</p>

      {login.isError && (
        <p className="field-error">Identifiants invalides ou erreur serveur.</p>
      )}
    </form>
  );
}
