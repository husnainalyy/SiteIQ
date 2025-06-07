'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { createCheckoutSession } from "@/lib/api";

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const lookupKey = "pro_monthly"; // your Stripe price lookup key

  async function handleSubscribe() {
    setLoading(true);
    try {
      const data = await createCheckoutSession(lookupKey);
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Subscription error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Subscribe to Premium</CardTitle>
          <CardDescription>
            Unlock exclusive features and premium content with our subscription plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="default"
            className="w-full"
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? "Redirecting..." : "Subscribe Now"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
