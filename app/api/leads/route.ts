import { groq } from "@/lib/groq";

export async function POST(req: Request) {
  const { query } = await req.json();

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `
Generate 5 B2B companies related to: ${query}.

Return results in JSON format with:
company
website
industry
`
      }
    ],
  });

  return Response.json({
    leads: completion.choices[0].message.content
  });
}