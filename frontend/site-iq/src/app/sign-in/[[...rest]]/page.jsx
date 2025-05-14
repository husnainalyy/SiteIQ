// /app/sign-in/[[...rest]]/page.tsx
'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return <SignIn routing="path" />;
}
