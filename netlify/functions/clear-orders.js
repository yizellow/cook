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
    const projectId = process.env.SANITY_PROJECT_ID;
    const dataset = process.env.SANITY_DATASET;
    const apiVersion = process.env.SANITY_API_VERSION || "2024-01-01";
    const token = process.env.SANITY_API_TOKEN;

    if (!projectId || !dataset || !token) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Missing Sanity environment variables" }),
      };
    }

    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;

    const sanityRes = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mutations: [
          {
            delete: {
              query: `*[_type == "order"]`,
            },
          },
        ],
      }),
    });

    const sanityData = await sanityRes.json();

    if (!sanityRes.ok) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Failed to clear orders in Sanity",
          details: sanityData,
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "All orders have been cleared.",
        result: sanityData,
      }),
    };
  } catch (error) {
    console.error("Error clearing orders:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to clear orders",
        details: error.message,
      }),
    };
  }
};
