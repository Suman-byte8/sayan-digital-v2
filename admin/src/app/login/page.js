import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Sign in — Sayan Digital Admin",
};

export default async function LoginPage({ searchParams }) {
  const { next, reason } = await searchParams;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold tracking-tight text-foreground">Sayan Digital</p>
          <p className="text-sm text-muted-foreground">Admin panel</p>
        </div>
        <LoginForm next={typeof next === "string" ? next : ""} sessionEnded={reason === "session"} />
      </div>
    </div>
  );
}
