import { LoginForm } from "@/features/auth/LoginForm";
import { tokenStore } from "@/features/auth/tokenStore";
import { useSyncExternalStore } from "react";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const token = useSyncExternalStore(tokenStore.subscribe, tokenStore.get, tokenStore.get);

  if (token) {
    return <Navigate to="/boards" replace />;
  }

  return (
    <div className="login-page">
      <section className="login-card">
        <p className="eyebrow">Connexion</p>
        <h1>Accéder à votre espace</h1>
        <p className="text-muted">Entrez vos identifiants pour continuer.</p>
        <LoginForm />
      </section>
    </div>
  );
}
