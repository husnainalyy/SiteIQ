import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-red-50">
      <Card className="max-w-md w-full border-red-500">
        <CardHeader>
          <CardTitle className="text-red-600">Subscription Cancelled</CardTitle>
          <CardDescription>
            You have cancelled the subscription process. Feel free to try again anytime.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/subscribe" passHref>
            <Button className="w-full" variant="default">
              Try Again
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
