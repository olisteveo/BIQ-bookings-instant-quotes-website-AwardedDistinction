const stripe = stripe("stripe-public-key");

const elements = stripe.elements();
const cardElement = elements.create("card");
cardElement.mount("#card-element");

const form = document.getElementById("payment-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Confirm the payment with Stripe using the client secret
    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: cardElement,
        },
    });

    if (error) {
        // Display an error message
        const errorElement = document.getElementById("card-errors");
        errorElement.textContent = error.message;
    } else {
        // Payment succeeded
        console.log("Payment succeeded:", paymentIntent);

        // Send the payment intent ID to server
        const paymentIntentId = paymentIntent.id;
    }
});
