export default {
  async fetch(request, env) {

    // عرض واجهة Chattun
    if (request.method === "GET") {
      return env.ASSETS.fetch(request);
    }

    // السماح للواجهة بالاتصال
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    // الذكاء الاصطناعي
    if (request.method === "POST") {
      try {
        const body = await request.json();
        const message = body.message;

        if (!message) {
          return new Response(
            JSON.stringify({ error: "Message is required" }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
              }
            }
          );
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct",
          {
            messages: [
              {
                role: "system",
                content:
                  "أنت Chattun، مساعد ذكاء اصطناعي مفيد وودود. أجب باللغة التي يستعملها المستخدم."
              },
              {
                role: "user",
                content: message
              }
            ]
          }
        );

        return new Response(
          JSON.stringify({
            response: result.response
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );

      } catch (error) {
        return new Response(
          JSON.stringify({
            error: "حدث خطأ في Chattun",error: "حدث خطأ في Chattun: " + error.message,
            details: error.message
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }
    }

    return new Response("Method not allowed", { status: 405 });
  }
}; 
