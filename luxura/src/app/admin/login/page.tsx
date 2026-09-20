import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/public/logo";
import { LoginForm } from "@/components/admin/login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");

  return (
    <main className="on-dark relative grid min-h-screen place-items-center overflow-hidden bg-navy-950 px-5 py-12">
      <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-[560px] w-[560px] opacity-[0.04]">
        <Logo markOnly tone="onDark" className="h-full w-full" />
      </div>
      <div className="relative w-full max-w-md">
        <Logo tone="onDark" className="mx-auto h-11" />
        <div className="mt-10 rounded-2xl bg-white p-7 text-navy-900 shadow-lift sm:p-9">
          <h1 className="font-display text-2xl font-semibold text-navy-950">Admin sign in</h1>
          <p className="mt-1.5 text-sm text-muted">Authorized staff only.</p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
