import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, req) => {
  console.log("Hello i am trying to execute")
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
  })