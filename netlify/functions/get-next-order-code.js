exports.handler = async () => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    const projectId = process.env.SANITY_PROJECT_ID;
    const dataset = process.env.SANITY_DATASET;

    if (!projectId || !dataset) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Missing Sanity environment variables",
        }),
      };
    }

    // 查詢現有訂單數量
    const countQuery = encodeURIComponent(`count(*[_type == "order"])`);
    const countUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${countQuery}`;

    const countRes = await fetch(countUrl);
    const countData = await countRes.json();

    if (!countRes.ok) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Failed to fetch order count",
          details: countData,
        }),
      };
    }

    const orderCount = countData.result || 0;
    const nextOrderCode = String(orderCount + 1).padStart(3, "0");

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        nextOrderCode,
        currentCount: orderCount,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to generate order code",
        details: error.message,
      }),
    };
  }
};
