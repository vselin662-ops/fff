import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiUrl, apiKey, action, ...extraParams } = body;

    if (!apiUrl) {
      return NextResponse.json({ error: "API URL провайдера не указан" }, { status: 400 });
    }
    if (!apiKey) {
      return NextResponse.json({ error: "API Ключ провайдера не указан" }, { status: 400 });
    }
    if (!action) {
      return NextResponse.json({ error: "Параметр action не указан" }, { status: 400 });
    }

    // Prepare body for standard SMM Panel application/x-www-form-urlencoded request
    const formParams = new URLSearchParams();
    formParams.append("key", apiKey);
    formParams.append("action", action);

    // Append any extra SMM API optional parameters
    for (const [key, value] of Object.entries(extraParams)) {
      if (value !== undefined && value !== null) {
        formParams.append(key, String(value));
      }
    }

    // Request SMM Panel server-to-server
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "FreeBoost-SMMPanel-Proxy/1.0",
      },
      body: formParams.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Провайдер ответил статусом ${response.status}: ${errorText || "Неизвестная ошибка"}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (err: any) {
    console.error("SMM Panel Proxy Error:", err);
    return NextResponse.json(
      { error: err.message || "Произошла внутренняя ошибка при выполнении прокси-запроса к SMM" },
      { status: 500 }
    );
  }
}
