
import { schemes, Scheme } from "@/data/schemes";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const generateBotResponse = (userMsg: string, lang: "en" | "hi", history: Message[] = []): string => {
  const lower = userMsg.toLowerCase();

  // 1. Extract context from history (simulated state)
  const historyText = history.map(m => m.content.toLowerCase()).join(" ");
  const currentAndHistory = lower + " " + historyText;

  const context = {
    age: currentAndHistory.match(/\d+/)?.[0],
    occupation: ["farmer", "student", "business", "women", "entrepreneur", "self-employed"].find(o => currentAndHistory.includes(o)),
    category: ["agriculture", "health", "education", "insurance", "business", "housing", "welfare", "savings", "pension", "employment"].find(c => currentAndHistory.includes(c))
  };

  // Helper: Format single scheme in MANDATORY structured format
  const formatScheme = (s: Scheme, lang: "en" | "hi"): string => {
    const applySteps = lang === "hi" 
      ? ["आधिकारिक वेबसाइट पर जाएं।", "पंजीकरण/लॉगिन करें।", "योजना का चयन करें और विवरण भरें।", "आवश्यक दस्तावेज़ अपलोड करें।", "फॉर्म जमा करें।"]
      : ["Visit the official website.", "Register or Login to your account.", "Select the scheme and fill in the details.", "Upload the required documents.", "Submit the application form."];

    if (lang === "hi") {
      return `📌 **योजना का नाम:** ${s.name}\n\n` +
             `🎯 **उद्देश्य:**\n${s.description}\n\n` +
             `💰 **लाभ:**\n${s.benefits.split(",").map(b => `- ${b.trim()}`).join("\n")}\n\n` +
             `✅ **पात्रता:**\n${formatEligibility(s.eligibility, "hi", "list")}\n\n` +
             `📄 **आवश्यक दस्तावेज़:**\n${s.documents.map(d => `- ${d}`).join("\n")}\n\n` +
             `🪜 **आवेदन कैसे करें:**\n${applySteps.map((step, idx) => `${idx + 1}. ${step}`).join("\n")}\n\n` +
             `🔗 **आवेदन लिंक:**\n[आधिकारिक वेबसाइट](${s.applyUrl})\n\n` +
             `---\n` +
             `💬 **क्या आप इसके लिए आवेदन करने में मदद चाहते हैं?**`;
    }
    return `📌 **Scheme Name:** ${s.name}\n\n` +
           `🎯 **Objective:**\n${s.description}\n\n` +
           `💰 **Benefits:**\n${s.benefits.split(",").map(b => `- ${b.trim()}`).join("\n")}\n\n` +
           `✅ **Eligibility:**\n${formatEligibility(s.eligibility, "en", "list")}\n\n` +
           `📄 **Documents Required:**\n${s.documents.map(d => `- ${d}`).join("\n")}\n\n` +
           `🪜 **How to Apply:**\n${applySteps.map((step, idx) => `${idx + 1}. ${step}`).join("\n")}\n\n` +
           `🔗 **Application Link:**\n[Official Website](${s.applyUrl})\n\n` +
           `---\n` +
           `💬 **Do you want help applying for this?**`;
  };

  // Helper: Format comparison in MANDATORY table format
  const formatComparison = (schemesList: Scheme[], lang: "en" | "hi"): string => {
    const headers = lang === "hi" 
      ? `| योजना (Scheme) | मुख्य लाभ (Key Benefit) | पात्रता (Eligibility) | क्यों चुनें (Why Choose) |\n| :--- | :--- | :--- | :--- |\n`
      : `| Scheme | Key Benefit | Eligibility | Why Choose |\n| :--- | :--- | :--- | :--- |\n`;

    let table = headers;

    schemesList.forEach(s => {
      const name = s.name.split("(")[0].trim();
      const benefits = s.benefits.length > 50 ? s.benefits.substring(0, 47) + "..." : s.benefits;
      const eligibility = formatEligibility(s.eligibility, lang);
      
      // Extract a short 'Why Choose' summary
      let whyChoose = s.description.split(".")[0];
      if (whyChoose.length > 60) whyChoose = whyChoose.substring(0, 57) + "...";
      
      table += `| **${name}** | ${benefits} | ${eligibility} | ${whyChoose} |\n`;
    });

    const recommendation = lang === "hi" 
      ? `\n🧠 **स्मार्ट सुझाव (Smart Recommendation):**\nआपकी प्रोफाइल के आधार पर, **${schemesList[0].name}** सबसे उपयुक्त विकल्प हो सकता है क्योंकि यह आपकी तात्कालिक आवश्यकताओं को पूरा करता है।`
      : `\n🧠 **Smart Recommendation:**\nBased on your profile, **${schemesList[0].name}** seems to be the best fit for you as it addresses your immediate needs.`;

    return table + recommendation + (lang === "hi" ? "\n\nक्या आप इनमें से किसी एक के बारे में अधिक जानना चाहेंगे?" : "\n\nWould you like to know more about any of these?");
  };

  const formatEligibility = (eligibility: any, lang: "en" | "hi", mode: "table" | "list" = "table") => {
    const parts = [];
    if (eligibility.occupation) parts.push(lang === "hi" ? `पेशा: ${eligibility.occupation.join(", ")}` : `Occupation: ${eligibility.occupation.join(", ")}`);
    if (eligibility.maxIncome) parts.push(lang === "hi" ? `आय < ₹${(eligibility.maxIncome / 100000).toFixed(1)}L` : `Income < ₹${(eligibility.maxIncome / 100000).toFixed(1)}L`);
    if (eligibility.minAge) parts.push(lang === "hi" ? `आयु > ${eligibility.minAge}` : `Age > ${eligibility.minAge}`);
    if (eligibility.maxAge) parts.push(lang === "hi" ? `आयु < ${eligibility.maxAge}` : `Age < ${eligibility.maxAge}`);
    
    if (parts.length === 0) return lang === "hi" ? "सभी के लिए" : "Open to all";
    
    return mode === "table" ? parts.join(" | ") : parts.map(p => `- ${p}`).join("\n");
  };

  // 2. Logic Flow
  
  // Greeting/Help
  if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey") || lower.includes("नमस्ते") || lower.includes("how are you")) {
    return lang === "hi"
      ? "नमस्ते! 🙏 मैं आपका कल्याण सहायक हूं। मैं आपको सरकारी योजनाओं को खोजने और समझने में मदद कर सकता हूं। अपनी उम्र, पेशा या किसी विशेष श्रेणी (जैसे कृषि, स्वास्थ्य) के बारे में बताएं।"
      : "Hello! 🙏 I'm your welfare assistant. I can help you find and understand government schemes. Tell me about your age, occupation, or any specific category (like Agriculture, Health).";
  }

  // Handle queries about schemes, agriculture, students, etc.
  const isAskingForSchemes = lower.includes("scheme") || lower.includes("agriculture") || lower.includes("student") || lower.includes("कृषि") || lower.includes("छात्र") || lower.includes("farmer") || lower.includes("किसान") || lower.includes("info") || lower.includes("table") || lower.includes("tabular");

  if (isAskingForSchemes) {
    const matchedCategory = ["agriculture", "health", "education", "insurance", "business", "housing", "welfare"].find(c => lower.includes(c)) || context.category;
    const occupationMatch = ["farmer", "student", "business", "women"].find(o => lower.includes(o)) || context.occupation;

    // Filter schemes based on detection
    let filtered = schemes;
    if (matchedCategory) {
      filtered = filtered.filter(s => s.category.toLowerCase().includes(matchedCategory));
    }
    if (occupationMatch) {
      filtered = filtered.filter(s => s.eligibility.occupation?.some(o => o.includes(occupationMatch)));
    }

    // If we have matches, decide whether to show a list or ask more info
    if (filtered.length > 0) {
      const wantsTable = lower.includes("table") || lower.includes("tabular") || lower.includes("तुलना") || lower.includes("तालिका");

      // If the user hasn't provided details yet, ask follow-up but show some top matches anyway
      if (!context.occupation && !context.age && !lower.includes("farmer") && !lower.includes("student")) {
        const topMatches = filtered.slice(0, 3);
        const prompt = lang === "hi"
          ? `निश्चित रूप से! यहाँ कुछ ${matchedCategory || "प्रमुख"} योजनाएं हैं। बेहतर सुझाव के लिए, क्या आप मुझे अपना पेशा और वार्षिक आय बता सकते हैं?\n\n`
          : `Certainly! Here are some ${matchedCategory || "top"} schemes. For a more personalized recommendation, could you please tell me your occupation and annual income?\n\n`;
        return prompt + formatComparison(topMatches, lang);
      }

      if (filtered.length > 1 || wantsTable) {
        return formatComparison(filtered, lang);
      } else {
        return formatScheme(filtered[0], lang);
      }
    }
  }

  // Specific scheme search (exact names or IDs)
  const specific = schemes.find(s => 
    lower.includes(s.name.toLowerCase().split("(")[0].trim().toLowerCase()) ||
    lower.includes(s.id.toLowerCase())
  );

  if (specific) {
    return formatScheme(specific, lang);
  }

  // Default fallback - ALWAYS ask for details if we don't know what to do
  return lang === "hi"
    ? "मैं आपकी मदद करना चाहता हूं। क्या आप मुझे बता सकते हैं कि आप किस तरह की योजना (जैसे कृषि, छात्रवृत्ति, स्वास्थ्य) खोज रहे हैं, या अपनी उम्र और पेशा बताएं?"
    : "I want to help you find the right scheme. Could you please tell me what kind of help you need (e.g., Agriculture, Scholarships, Health) or share your age and occupation?";
};
