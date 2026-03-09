import { groq } from "@/lib/groq";

export async function POST(req: Request) {

  const { company, industry } = await req.json();

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `
Write a personalized cold outreach sales email.

Company name: ${company}
Industry: ${industry}

Rules:
- Do NOT use placeholders like [Recipient Name]
- Address the company directly
- Mention the company name in the email
- Keep it professional and concise
- Include subject line

Return a complete email.
`
      }
    ],
  });

  return Response.json({
    email: completion.choices[0].message.content
  });

}