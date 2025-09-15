export async function POST(req: Request) {
  try {
    const { email, problem, source_url } = await req.json();
    // MVP: just log to console. Replace with Supabase later.
    console.log("Lead:", { email, problem, source_url, at: new Date().toISOString() });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
