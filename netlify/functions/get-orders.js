exports.handler = async () => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    const projectId = process.env.SANITY_PROJECT_ID;
    const dataset = process.env.SANITY_DATASET;

    const query = encodeURIComponent(
      `*[_type == "order"] | order(createdAt desc)`,
    );

    const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`;

    const res = await fetch(url);
    const data = await res.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        orders: data.result,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to fetch orders",
        details: error.message,
      }),
    };
  }
};
