import { groq } from "@/lib/groq";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ leads });
  } catch (error) {
    console.error("Failed to fetch leads:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `
Generate 5 B2B companies related to: ${query}.

Return ONLY a valid JSON object in this exact format, with no markdown formatting, no preamble, just raw JSON:
{
  "leads": [
    {
      "company": "Company Name",
      "website": "https://company.com",
      "industry": "Industry classification",
      "score": 85
    }
  ]
}
`
        }
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content generated");

    const parsed = JSON.parse(content);
    
    // Save to Prisma
    const createdLeads = [];
    if (parsed.leads && Array.isArray(parsed.leads)) {
      for (const lead of parsed.leads) {
        const created = await prisma.lead.create({
          data: {
            company: lead.company,
            website: lead.website,
            industry: lead.industry || query,
            score: typeof lead.score === 'number' ? lead.score : (parseInt(lead.score) || null),
          }
        });
        createdLeads.push(created);
      }
    }

    return NextResponse.json({
      leads: createdLeads.length > 0 ? createdLeads : parsed.leads,
      raw: content,
    });
  } catch (error: any) {
    console.error("Lead generation error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate leads" }, { status: 500 });
  }
}