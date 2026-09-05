import type { Metadata } from "next";
import { Cross } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/app/admin/login/login-form";

export const metadata: Metadata = {
  title: "Admin Login | TGM CMS",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-tgm-blue via-tgm-blue to-tgm-lightgold/40 px-4 py-12">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardContent className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-tgm-gold/10">
              <Cross className="h-8 w-8 text-tgm-gold" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">TGM CMS</h1>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to manage the website
            </p>
          </div>
          <LoginForm />
        </CardContent>
      </Card>
      <p className="mt-6 text-sm text-white/70">
        Authorized church staff only
      </p>
    </div>
  );
}
