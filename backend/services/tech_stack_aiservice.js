import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const OR_API_KEY = process.env.OPENROUTER_API_KEY?.trim();
const OR_MODEL_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function analyzeWebsite(metaTags, scripts, useCase, seoFocused, performanceFocused) {
    try {
        console.log("🚀 Starting website analysis...");
        console.log("Received Website Meta Tags:", metaTags);
        console.log("Received Scripts:", scripts);
        console.log("User Preferences - Use Case:", useCase);
        console.log("User Preferences - SEO Focused:", seoFocused);
        console.log("User Preferences - Performance Focused:", performanceFocused);

        if (!OR_API_KEY) throw new Error("❌ Missing OpenRouter API Key");

        const prompt = `
# System Role
You are an expert web solutions architect and AI assistant specializing in modern frontend/backend frameworks, SEO best practices, performance optimization, and infrastructure strategy. Your task is to provide a **tailored technology stack recommendation** for a website based on its metadata, existing frontend technologies, and the user’s stated priorities.

# Task
You will be given:
- Website meta tags (title + description)
- Detected frontend scripts (JS libraries/frameworks)
- Intended use case (e.g., Portfolio, Blog, E-commerce, SaaS)
- Whether SEO is a key focus
- Whether performance is a key focus

You must analyze the above and produce **a valid JSON object** that includes:
1. Recommended **frontend** technologies (frameworks, languages, rendering strategies)
2. Recommended **backend** stack (languages, frameworks, runtime only — no database tech)
3. Appropriate **database** technology — include it ONLY in the "database" section, NOT in the "backend". Choose **either SQL or NoSQL**, not both, unless the use case absolutely demands a hybrid solution.
4. Suggested **hosting** platforms (based on scaling, SSR, CDN, edge needs)
5. Any other relevant **dev tools or practices** (CI/CD, VCS, monitoring, etc.)
6. A **reason** for each choice, explaining how it aligns with the user’s goals and input data

# Requirements
- Match technologies to user preferences (SEO/performance)
- If scripts already include a library, suggest compatible frameworks
- Avoid complex stacks for simple projects
- Prefer scalable/cloud-native options for SaaS or E-commerce
- For SEO-focused sites, recommend SSR or hybrid frameworks
- For performance-focused sites, recommend static site generation, edge functions, and CDN-backed hosting
- For database, choose either SQL or NoSQL based on the use case and avoid redundancy in the backend section
- Ensure the JSON is valid and well-structured
- Only include the most relevant technologies and practices for the project
- Only provide multiple options if they are equally valid and relevant to the use case
- Avoid vague or generic recommendations; be specific about the technologies and practices you suggest

# Output Format
Return **only valid JSON** in this structure:

{
  "frontend": {
    "stack": ["technology1", "technology2", ...],
    "reason": "Explain why these technologies are suitable for the project."
  },
  "backend": {
   "stack": ["technology1", "technology2", ...],
    "reason": "Explain why these technologies are suitable for the project."
  },
  "database": {
    "stack": ["technology1", "technology2", ...],
    "reason": "Explain why these technologies are suitable for the project."
  },
  "hosting": {
   "stack": ["technology1", "technology2", ...],
   "reason": "Explain why these technologies are suitable for the project."
  },
  "other": {
  "stack": ["technology1", "technology2", ...],
  "reason": "Explain why these technologies are suitable for the project."
  }
}

# Input for Analysis

Website Meta Title: ${metaTags.title || "Unknown"}
Website Meta Description: ${metaTags.description || "Unknown"}
Detected Frontend Scripts: ${scripts.length > 0 ? scripts.join(", ") : "None"}

User Preferences:
- Intended Use Case: ${useCase}
- SEO Focused: ${seoFocused ? "Yes" : "No"}
- Performance Focused: ${performanceFocused ? "Yes" : "No"}
`;

        const response = await axios.post(
            OR_MODEL_URL,
            {
                model: "mistralai/mistral-7b-instruct",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 1000
            },
            {
                headers: {
                    Authorization: `Bearer ${OR_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const rawText = response.data.choices[0].message.content;
        console.log("✅ Raw AI Response:", rawText);

        const jsonMatch = rawText.match(/{[\s\S]*}/);
        if (!jsonMatch) throw new Error("❌ No valid JSON block found in AI response.");

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(jsonMatch[0]);
            detectRedundantDatabases(parsedResponse); // ✅ Check for overlap
          //   console.log("✅ Parsed AI Response:", parsedResponse);
            return parsedResponse;
        } catch (error) {
            console.error("❌ Failed to parse JSON. Raw extracted block:\n", jsonMatch[0]);
            throw new Error("❌ Invalid JSON format in AI response. Possible trailing commas or explanation text mixed in.");
        }

    } catch (error) {
        console.error("❌ OpenRouter API Error:", error?.response?.data || error.message);
        return { error: "Failed to analyze website using OpenRouter" };
    }
}

// ✅ Helper: Check for DB tech appearing in both backend and database sections
function detectRedundantDatabases(parsedResponse) {
    const dbNames = parsedResponse.database?.stack?.map(db => db.toLowerCase()) || [];
    const backendNames = parsedResponse.backend?.stack?.map(item => item.toLowerCase()) || [];

    const knownDBs = ['mysql', 'postgresql', 'mongodb', 'dynamodb', 'sqlite', 'redis'];
    const overlap = backendNames.filter(name =>
        dbNames.includes(name) || knownDBs.some(db => name.includes(db))
    );

    if (overlap.length) {
        console.warn("⚠️ Detected redundant DBs in both backend and database sections:", overlap);
    }
}

export default { analyzeWebsite };
