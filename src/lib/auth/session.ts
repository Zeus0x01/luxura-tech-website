import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "./index";
import { prisma } from "@/lib/db/prisma";

export type AdminUser = { id: string; email: string; name: string; role: "ADMIN" };

/**
 * Authoritative server-side admin check. Call it at the top of every admin
 * layout/page AND every admin Server Action: middleware alone is not enough,
 * and a Server Action can be invoked directly.
 *
 * It re-reads the user from the database so a deactivated or deleted account
 * loses access immediately, not when its JWT expires.
 */
export const requireAdmin = cache(async (): Promise<AdminUser> => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) redirect("/admin/login");

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true, isActive: true },
  });
  if (!user || !user.isActive || user.role !== "ADMIN") redirect("/admin/login");

  return { id: user.id, email: user.email, name: user.name, role: "ADMIN" };
});
