import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const YOUR_DOMAIN = process.env.FRONTEND_URL || 'http://localhost:5000';

/**
 * Controller for creating a Stripe Checkout session.
 * Handles creating a checkout session for a subscription or product purchase.
 */
export const createCheckoutSession = async (req, res) => {
  try {
    // Get the product/price details using the provided lookup_key in the request body
    const prices = await stripe.prices.list({
      lookup_keys: [req.body.lookup_key],  // Lookup key for price (e.g., product's price ID)
      expand: ['data.product'],  // Expanding the product details as well
    });

    // If no prices are found, return a bad request error
    if (!prices.data.length) {
      return res.status(400).json({ error: 'No price found for the provided lookup key' });
    }

    // Create a Checkout session with the necessary details
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',  // Subscription mode (can also be 'payment' for one-time payments)
      line_items: [{
        quantity: 1,  // Quantity of the item (in this case 1)
        price: prices.data[0].id,  // The price ID retrieved from Stripe
      }],
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,  // URL to redirect after success
      cancel_url: `${YOUR_DOMAIN}/cancel`,  // URL to redirect if the user cancels the payment
    });

    // Respond with the session URL to redirect the user to Stripe's hosted checkout page
    res.json({ url: session.url });

  } catch (error) {
    console.error('Error during Stripe session creation:', error);
    // Return error response if something goes wrong
    res.status(500).json({ error: error.message });
  }
};

/**
 * Webhook handler to receive and process events sent by Stripe.
 * Webhooks are essential for handling events like payment success, subscription updates, etc.
 */
// Controller for handling Stripe Webhooks
export const handleWebhook = (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
    let event;
  
    try {
      // Verify the webhook signature to ensure it's from Stripe
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook Error:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    // Handle different Stripe events
    switch (event.type) {
      case 'payment_intent.created':
        const paymentIntentCreated = event.data.object;
        // Action: Log or initiate actions like email notifications, etc.
        console.log(`Payment Intent Created: ID = ${paymentIntentCreated.id}, Amount = ${paymentIntentCreated.amount}`);
        // You might want to save it in the database to track pending payments.
        break;
  
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;
        // Action: Confirm the payment, send a confirmation email to the user, update order status.
        console.log(`Payment Intent Succeeded: ID = ${paymentIntentSucceeded.id}, Amount = ${paymentIntentSucceeded.amount_received}`);
        // Update database and send a thank you message to the user
        break;
  
      case 'payment_intent.payment_failed':
        const paymentIntentFailed = event.data.object;
        // Action: Notify the customer that payment failed, try again or update the order status.
        console.log(`Payment Intent Failed: ID = ${paymentIntentFailed.id}, Status = ${paymentIntentFailed.status}`);
        // You can update your records and retry payment logic here.
        break;
  
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;
        // Action: Mark the order as complete in your system, send a receipt or confirmation.
        console.log(`Checkout Session Completed: ID = ${checkoutSessionCompleted.id}`);
        // Mark user subscription as active, and start the service.
        break;
  
      case 'customer.created':
        const customerCreated = event.data.object;
        // Action: Add customer data to your database if necessary, send welcome email.
        console.log(`Customer Created: ID = ${customerCreated.id}`);
        // You can store the customer ID in your user records for further processing.
        break;
  
      case 'customer.subscription.created':
        const subscriptionCreated = event.data.object;
        // Action: Activate the subscription in your system, grant access to the service.
        console.log(`Subscription Created: ID = ${subscriptionCreated.id}`);
        // Add user to subscription list and track the plan.
        break;
  
      case 'customer.subscription.updated':
        const subscriptionUpdated = event.data.object;
        // Action: Update subscription details, plan changes, and billing cycle.
        console.log(`Subscription Updated: ID = ${subscriptionUpdated.id}`);
        // You may want to update subscription data in your database based on the update.
        break;
  
      case 'customer.subscription.deleted':
        const subscriptionDeleted = event.data.object;
        // Action: Handle cancellation, update user access, or prevent further billing.
        console.log(`Subscription Canceled: ID = ${subscriptionDeleted.id}`);
        // Remove access to services, update database, and stop recurring payments.
        break;
  
      case 'invoice.created':
        const invoiceCreated = event.data.object;
        // Action: Generate invoice, notify user of upcoming payment.
        console.log(`Invoice Created: ID = ${invoiceCreated.id}`);
        // You can trigger notifications for customers to inform them about their invoices.
        break;
  
      case 'invoice.payment_succeeded':
        const invoicePaymentSucceeded = event.data.object;
        // Action: Mark the invoice as paid, notify the customer, update billing records.
        console.log(`Invoice Payment Succeeded: ID = ${invoicePaymentSucceeded.id}, Amount = ${invoicePaymentSucceeded.amount_paid}`);
        // Update your system to mark the invoice as paid and process further.
        break;
  
      case 'invoice.payment_failed':
        const invoicePaymentFailed = event.data.object;
        // Action: Notify the customer of failed payment, retry logic, or update order status.
        console.log(`Invoice Payment Failed: ID = ${invoicePaymentFailed.id}, Status = ${invoicePaymentFailed.status}`);
        // Send an email to the user or retry the payment process.
        break;
  
      case 'payment_method.attached':
        const paymentMethodAttached = event.data.object;
        // Action: Save the payment method for the user, or trigger payment verification.
        console.log(`Payment Method Attached: ID = ${paymentMethodAttached.id}, Customer ID = ${paymentMethodAttached.customer}`);
        // You may want to associate the payment method with the user in your database.
        break;
  
      case 'payment_method.detached':
        const paymentMethodDetached = event.data.object;
        // Action: Handle removal of payment method, notify customer if needed.
        console.log(`Payment Method Detached: ID = ${paymentMethodDetached.id}`);
        // You may want to clean up the payment method in your database or notify the customer.
        break;
  
      case 'checkout.session.expired':
        const checkoutSessionExpired = event.data.object;
        // Action: Inform the user that the checkout session expired and ask them to try again.
        console.log(`Checkout Session Expired: ID = ${checkoutSessionExpired.id}`);
        // Handle session expiration, notify users, and guide them to restart the checkout process.
        break;
  
      case 'payment_intent.canceled':
        const paymentIntentCanceled = event.data.object;
        // Action: Handle cancellation of a payment intent, notify customer.
        console.log(`Payment Intent Canceled: ID = ${paymentIntentCanceled.id}`);
        // Inform the customer that their payment was canceled.
        break;
  
      // Handle unknown events (if any)
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  
    // Respond that the webhook was received successfully
    res.json({ received: true });
  };
  