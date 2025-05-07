import mongoose from "mongoose";

const PhraseResultSchema = new mongoose.Schema({
  phrase: { type: String, required: true },
  jid: { type: String, required: true },
  rawResponse: { type: Object },

  // Scoring
  scores: {
    rankingPosition: { type: Number, default: 0 },
    keywordRelevance: { type: Number, default: 0 },
    richSnippets: { type: Number, default: 0 },
    urlStructure: { type: Number, default: 0 },
    visibility: { type: Number, default: 0 },
    competitorAnalysis: { type: Number, default: 0 },
    paginationStrength: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  } 
});


const SeoSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true },
    domain: { type: String, required: true },
    scanDate: { type: Date, default: Date.now },
    phraseResults: [PhraseResultSchema], // <- Nested array of results per phrase
  },
  { timestamps: true }
);
const SeoReport = mongoose.model("SeoReport", SeoSchema);


export default SeoReport;