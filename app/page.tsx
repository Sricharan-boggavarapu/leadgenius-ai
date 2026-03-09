"use client";

import { useState } from "react";

export default function Home() {

  const [query, setQuery] = useState("");
  const [company, setCompany] = useState("");
  const [leads, setLeads] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const generateLeads = async () => {
    setLoading(true);

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    setLeads(data.leads);

    setLoading(false);
  };

  const generateEmail = async () => {

    const res = await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company: company,
        industry: "Technology"
      }),
    });

    const data = await res.json();
    setEmail(data.email);
  };

  return (
    <main className="min-h-screen flex flex-col justify-between p-10 bg-gray-50">

      <div>

        <h1 className="text-4xl font-bold mb-3 text-black">
          LeadGenius AI
        </h1>

        <p className="mb-8 text-gray-600">
          AI-powered B2B lead discovery platform
        </p>


        {/* Lead Search */}

        <div className="flex gap-4 mb-6">

          <input
            className="border p-3 w-full rounded text-black"
            placeholder="Find AI startups in India..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button
            onClick={generateLeads}
            className="bg-black text-white px-6 rounded hover:bg-gray-800"
          >
            {loading ? "Generating..." : "Generate Leads"}
          </button>

        </div>


        {/* Leads Output */}

        <div className="mt-6 bg-white text-black p-6 rounded shadow">

          <h2 className="text-xl font-semibold mb-4">
            Generated Leads
          </h2>

          <pre className="whitespace-pre-wrap">
            {leads}
          </pre>

        </div>


        {/* Company Input */}

        <div className="mt-8">

          <input
            className="border p-3 w-full rounded text-black mb-4"
            placeholder="Enter company name for sales email..."
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          <button
            onClick={generateEmail}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Generate Sales Email
          </button>

        </div>


        {/* Email Output */}

        <div className="mt-6 bg-white text-black p-6 rounded shadow">

          <h2 className="text-xl font-semibold mb-4">
            AI Generated Sales Email
          </h2>

          <pre className="whitespace-pre-wrap">
            {email}
          </pre>

        </div>

      </div>


      {/* Footer */}

      <footer className="mt-12 text-center text-gray-500 text-sm">

        Built by <span className="font-semibold">Sricharan</span> • Powered by Groq AI

      </footer>

    </main>
  );
}