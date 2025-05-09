import { SignUp } from '@clerk/nextjs'
import { ClerkProvider } from '@clerk/nextjs'
export default function Page() {
  return <ClerkProvider>
  <SignUp />
  </ClerkProvider>
}