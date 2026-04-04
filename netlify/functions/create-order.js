const { createClient } = require("@sanity/client");

// Initialize Sanity client with write token
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false, // Must be false when using token
});

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Parse the request body
    const { customer, order } = JSON.parse(event.body);

    // Validate required fields
    if (
      !customer?.name ||
      !customer?.email ||
      !order?.chefId ||
      !order?.chefTitle ||
      !order?.answers
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // Create the order document
    const orderDocument = {
      _type: "order",
      customer: {
        name: customer.name,
        email: customer.email,
      },
      order: {
        chefId: order.chefId,
        chefTitle: order.chefTitle,
        answers: {
          question1: order.answers.question1,
          question2: order.answers.question2,
          question3: order.answers.question3,
        },
      },
    };

    // Save to Sanity
    const result = await client.create(orderDocument);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({
        success: true,
        orderId: result._id,
        message: "Order created successfully",
      }),
    };
  } catch (error) {
    console.error("Error creating order:", error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({
        error: "Failed to create order",
        details: error.message,
      }),
    };
  }
};
