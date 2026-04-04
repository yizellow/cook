exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true }),
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { customer, order } = JSON.parse(event.body || "{}");

    if (
      !customer?.name ||
      !customer?.email ||
      !order?.chefId ||
      !order?.chefTitle ||
      !order?.answers
    ) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const projectId = process.env.SANITY_PROJECT_ID;
    const dataset = process.env.SANITY_DATASET;
    const apiVersion = process.env.SANITY_API_VERSION || "2024-01-01";
    const token = process.env.SANITY_API_TOKEN;

    if (!projectId || !dataset || !token) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Missing Sanity environment variables",
        }),
      };
    }

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
          question1: order.answers.question1 ?? "",
          question2: order.answers.question2 ?? "",
          question3: order.answers.question3 ?? "",
        },
      },
    };

    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;

    const sanityRes = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mutations: [{ create: orderDocument }],
      }),
    });

    const sanityData = await sanityRes.json();

    if (!sanityRes.ok) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Failed to create order in Sanity",
          details: sanityData,
        }),
      };
    }

    const createdId =
      sanityData?.results?.[0]?.id || sanityData?.transactionId || null;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        orderId: createdId,
        message: "Order created successfully",
      }),
    };
  } catch (error) {
    console.error("Error creating order:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to create order",
        details: error.message,
      }),
    };
  }
};
