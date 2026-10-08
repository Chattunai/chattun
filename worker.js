export default {
  async fetch(request, env) {

    // عرض واجهة Chattun
    if (request.method === "GET") {
      return env.ASSETS.fetch(request);
    }

    // السماح بالاتصال
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    // طلب الذكاء الاصطناعي
    if (request.method === "POST") {
      try {

        const body = await request.json();
        const message = body.message;

        if (!message) {
          return new Response(
            JSON.stringify({
              error: "Message is required"
            }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
              }
            }
          );
        }

        // التحقق من وجود AI
        if (!env.AI) {
          return new Response(
            JSON.stringify({
              error: "Workers AI binding غير موجود"
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
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );

      } catch (error) {

        return new Response(
          JSON.stringify({
            error: "خطأ حقيقي من Chattun: " + error.message
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

    return new Response(
      JSON.stringify({
        error: "Method not allowed"
      }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
};          
