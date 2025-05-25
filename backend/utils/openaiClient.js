import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const callOpenAI = async (messages) => {
    const res = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
    });

    return res.choices?.[0]?.message?.content || "Sorry, I didn't get that.";
};
