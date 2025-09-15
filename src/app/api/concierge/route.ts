import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { problem, url } = await req.json();
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const system = `You are Xintari's website concierge. Your job: 1) Restate the user's problem crisply, 2) Propose an AI agent solution Xintari can deliver (high-level architecture + key integrations), 3) Quantify ROI in bullets, 4) End with a CTA for a free scoping call. Keep ~150–180 words. Output valid HTML with <strong> section headers</strong> and short bullet lists.`;

    const user = `Visitor problem: ${problem}\nPage: ${url}\nReturn a single <div>…</div> block.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
      temperature: 0.4
    });

    const message = completion.choices?.[0]?.message?.content || "<div>Sorry—no response.</div>";
    return Response.json({ message });
  } catch {
    return Response.json({ message: "<div>Sorry—something went wrong.</div>" }, { status: 500 });
  }
}
