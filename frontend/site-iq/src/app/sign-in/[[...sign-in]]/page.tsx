'use client';

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/';

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn 
        redirectUrl={redirectUrl}
        appearance={{
          elements: {
            formButtonPrimary: 
              "bg-slate-500 hover:bg-slate-400 text-sm normal-case",
            card: "bg-white shadow-xl",
          },
        }}
      />
    </div>
  );
} 