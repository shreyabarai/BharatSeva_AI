import { Scheme, schemes } from "@/data/schemes";
import { translateScheme } from "./scheme-translations";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  type: "text" | "schemes" | "options";
  intent?: string;
  data?: any;
  formStep?: string;
  formData?: any;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastUpdated: number;
}

const greetings: Record<string, any> = {
  hi: {
    content: "नमस्ते! 🙏 मैं आपका डिजिटल कल्याण सहायक हूं। मैं आपको सही सरकारी योजना खोजने में मदद कर सकता हूं। आप इनमें से कुछ चुन सकते हैं:",
    options: [
      { label: "छात्रों के लिए योजनाएं", query: "schemes for students" },
      { label: "महिलाओं के लिए योजनाएं", query: "schemes for women" },
      { label: "आय के आधार पर खोजें", query: "check eligibility" },
    ]
  },
  mr: {
    content: "नमस्कार! 🙏 मी तुमचा डिजिटल कल्याण सहाय्यक आहे. मी तुम्हाला योग्य सरकारी योजना शोधण्यात मदत करू शकतो. तुम्ही यापैकी काही निवडू शकता:",
    options: [
      { label: "विद्यार्थ्यांसाठी योजना", query: "schemes for students" },
      { label: "महिलांसाठी योजना", query: "schemes for women" },
      { label: "उत्पन्नानुसार शोधा", query: "check eligibility" },
    ]
  },
  pa: {
    content: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! 🙏 ਮੈਂ ਤੁਹਾਡਾ ਡਿਜੀਟਲ ਕਲਿਆਣ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਤੁਹਾਨੂੰ ਸਹੀ ਸਰਕਾਰੀ ਯੋਜਨਾ ਲੱਭਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ਇਹਨਾਂ ਵਿੱਚੋਂ ਕੁਝ ਚੁਣ ਸਕਦੇ ਹੋ:",
    options: [
      { label: "ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਯੋਜਨਾਵਾਂ", query: "schemes for students" },
      { label: "ਔਰਤਾਂ ਲਈ ਯੋਜਨਾਵਾਂ", query: "schemes for women" },
      { label: "ਆਮਦਨ ਅਨੁਸਾਰ ਲੱਭੋ", query: "check eligibility" },
    ]
  },
  ml: {
    content: "ഹലോ! 🙏 ഞാൻ നിങ്ങളുടെ ഡിജിറ്റൽ ക്ഷേമ സഹായിയാണ്. ശരിയായ സർക്കാർ പദ്ധതി കണ്ടെത്താൻ നിങ്ങളെ സഹായിക്കാം. നിങ്ങൾക്ക് ഇവയിൽ ചിലത് തിരഞ്ഞെടുക്കാം:",
    options: [
      { label: "വിദ്യാർത്ഥികൾക്കുള്ള പദ്ധതികൾ", query: "schemes for students" },
      { label: "സ്ത്രീകൾക്കുള്ള പദ്ധതികൾ", query: "schemes for women" },
      { label: "വരുമാനമനുസരിച്ച് കണ്ടെത്തുക", query: "check eligibility" },
    ]
  },
  ur: {
    content: "ہیلو! 🙏 میں آپ کا ڈیجیٹل فلاحی اسسٹنٹ ہوں۔ میں آپ کو صحیح سرکاری اسکیم تلاش کرنے میں مدد کر سکتا ہوں۔ آپ ان میں سے کچھ منتخب کر سکتے ہیں:",
    options: [
      { label: "طلباء کے لیے اسکیمیں", query: "schemes for students" },
      { label: "خواتین کے لیے اسکیمیں", query: "schemes for women" },
      { label: "آمدنی کے مطابق تلاش کریں", query: "check eligibility" },
    ]
  },
  en: {
    content: "Hello! 🙏 I'm your digital welfare assistant. I can help you find the right government schemes. You can try these:",
    options: [
      { label: "Schemes for students", query: "schemes for students" },
      { label: "Schemes for women", query: "schemes for women" },
      { label: "Find by income", query: "check eligibility" },
    ]
  }
};

export const translateMessage = (msg: ChatMessage, lang: string): ChatMessage => {
  if (msg.role === "user") return msg;

  let newContent = msg.content;
  let newData = msg.data;

  switch (msg.intent) {
    case "greeting":
      const g = greetings[lang] || greetings.en;
      newContent = g.content;
      newData = g.options;
      break;
    case "eligibility_prompt":
      if (lang === "hi") newContent = "निश्चित रूप से! आपकी पात्रता जांचने के लिए, कृपया मुझे अपनी आयु और वार्षिक आय बताएं।";
      else if (lang === "mr") newContent = "नक्कीच! तुमची पात्रता तपासण्यासाठी, कृपया मला तुमचे वय आणि वार्षिक उत्पन्न सांगा.";
      else if (lang === "pa") newContent = "ਯਕੀਨੀ ਤੌਰ 'ਤੇ! ਆਪਣੀ ਪਾਤਰਤਾ ਦੀ ਜਾਂਚ ਕਰਨ ਲਈ, ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਆਪਣੀ ਉਮਰ ਅਤੇ ਸਾਲਾਨਾ ਪਰਿਵਾਰਕ ਆਮਦਨ ਦੱਸੋ।";
      else if (lang === "ml") newContent = "തീർച്ചയായും! നിങ്ങളുടെ യോഗ്യത പരിശോധിക്കുന്നതിന്, ദയവായി നിങ്ങളുടെ പ്രായവും വാർഷിക വരുമാനവും എന്നോട് പറയുക.";
      else if (lang === "ur") newContent = "یقیناً! اپنی اہلیت چیک کرنے کے لیے, براہ کرم مجھے اپنی عمر اور سالانہ خاندانی آمدنی بتائیں۔";
      else newContent = "Certainly! To check your eligibility, please tell me your age and annual family income.";
      break;
    case "domain_results":
    case "search_results":
      const resultsCount = Array.isArray(msg.data) ? msg.data.length : 0;
      const matchedSchemesList = Array.isArray(msg.data) ? msg.data.map((s: Scheme) => translateScheme(s, lang)) : [];
      
      if (lang === "hi") newContent = `मुझे आपकी खोज के लिए ${resultsCount} योजनाएं मिली हैं:`;
      else if (lang === "mr") newContent = `मला तुमच्या शोधाशी जुळणाऱ्या ${resultsCount} योजना सापडल्या आहेत:`;
      else if (lang === "pa") newContent = `ਮੈਨੂੰ ਤੁਹਾਡੀ ਖੋਜ ਨਾਲ ਮੇਲ ਖਾਂਦੀਆਂ ${resultsCount} ਯੋਜਨਾਵਾਂ ਮਿਲੀਆਂ ਹਨ:`;
      else if (lang === "ml") newContent = `നിങ്ങളുടെ തിരയലുമായി പൊരുത്തപ്പെടുന്ന ${resultsCount} പദ്ധതികൾ കണ്ടെത്തി:`;
      else if (lang === "ur") newContent = `مجھے آپ کی تلاش سے ملتی جلتی ${resultsCount} اسکیمیں ملی ہیں:`;
      else newContent = `I found ${resultsCount} schemes matching your query:`;
      
      newData = matchedSchemesList;
      break;
    case "apply_prompt":
      if (lang === "hi") newContent = "क्या आप इनमें से किसी योजना के लिए आवेदन पत्र भरना चाहेंगे? (हाँ/नहीं)";
      else if (lang === "mr") newContent = "तुम्ही यापैकी कोणत्याही योजनेसाठी अर्ज भरू इच्छिता? (हो/नाही)";
      else if (lang === "pa") newContent = "ਕੀ ਤੁਸੀਂ ਇਹਨਾਂ ਵਿੱਚੋਂ ਕਿਸੇ ਵੀ ਯੋਜਨਾ ਲਈ ਅਰਜ਼ੀ ਫਾਰਮ ਭਰਨਾ ਚਾਹੋਗੇ? (ਹਾਂ/ਨਹੀਂ)";
      else if (lang === "ml") newContent = "ഇവയിൽ ഏതെങ്കിലും പദ്ധതിക്കായി അപേക്ഷാ ഫോം പൂരിപ്പിക്കാൻ നിങ്ങൾ ആഗ്രഹിക്കുന്നുണ്ടോ? (അതെ/ഇല്ല)";
      else if (lang === "ur") newContent = "کیا آپ ان میں سے کسی بھی اسکیم کے لیے درخواست فارم بھرنا چاہیں گے؟ (ہاں/نہیں)";
      else newContent = "Would you like to fill out an application form for any of these schemes? (Yes/No)";
      break;
    case "form_ask_name":
      if (lang === "hi") newContent = "बहुत अच्छा! चलिए शुरू करते हैं। आपका पूरा नाम क्या है?";
      else if (lang === "mr") newContent = "खूप छान! चला सुरू करूया. तुमचे पूर्ण नाव काय आहे?";
      else if (lang === "pa") newContent = "ਬਹੁਤ ਵਧੀਆ! ਆਓ ਸ਼ੁਰੂ ਕਰੀਏ। ਤੁਹਾਡਾ ਪੂਰਾ ਨਾਮ ਕੀ ਹੈ?";
      else if (lang === "ml") newContent = "വളരെ നല്ലത്! നമുക്ക് തുടങ്ങാം. നിങ്ങളുടെ പൂർണ്ണനാമം എന്താണ്?";
      else if (lang === "ur") newContent = "بہت اچھا! چلو شروع کرتے ہیں۔ آپ کا پورا نام کیا ہے؟";
      else newContent = "Great! Let's get started. What is your full name?";
      break;
    case "form_ask_age":
      if (lang === "hi") newContent = "आपकी आयु कितनी है?";
      else if (lang === "mr") newContent = "तुमचे वय किती आहे?";
      else if (lang === "pa") newContent = "ਤੁਹਾਡੀ ਉਮਰ ਕਿੰਨੀ ਹੈ?";
      else if (lang === "ml") newContent = "നിങ്ങളുടെ പ്രായം എത്രയാണ്?";
      else if (lang === "ur") newContent = "آپ کی عمر کتنی ہے؟";
      else newContent = "What is your age?";
      break;
    case "form_ask_phone":
      if (lang === "hi") newContent = "आपका संपर्क नंबर क्या है?";
      else if (lang === "mr") newContent = "तुमचा संपर्क क्रमांक काय आहे?";
      else if (lang === "pa") newContent = "ਤੁਹਾਡਾ ਸੰਪਰਕ ਨੰਬਰ ਕੀ ਹੈ?";
      else if (lang === "ml") newContent = "നിങ്ങളുടെ ബന്ധപ്പെടാനുള്ള നമ്പർ എന്താണ്?";
      else if (lang === "ur") newContent = "آپ کا رابطہ نمبر کیا ہے؟";
      else newContent = "What is your contact number?";
      break;
    case "form_ask_state":
      if (lang === "hi") newContent = "आप किस राज्य से हैं?";
      else if (lang === "mr") newContent = "तुम्ही कोणत्या राज्याचे आहात?";
      else if (lang === "pa") newContent = "ਤੁਸੀਂ ਕਿਸ ਰਾਜ ਤੋਂ ਹੋ?";
      else if (lang === "ml") newContent = "നിങ്ങൾ ഏത് സംസ്ഥാനത്തു നിന്നാണ്?";
      else if (lang === "ur") newContent = "آپ کس ریاست سے ہیں؟";
      else newContent = "Which state are you from?";
      break;
    case "form_ask_gender":
      if (lang === "hi") newContent = "आपका लिंग क्या है? (पुरुष/महिला/अन्य)";
      else if (lang === "mr") newContent = "तुमचे लिंग काय आहे? (पुरुष/स्त्री/इतर)";
      else if (lang === "pa") newContent = "ਤੁਹਾਡਾ ਲਿੰਗ ਕੀ ਹੈ? (ਪੁਰਸ਼/ਔਰਤ/ਹੋਰ)";
      else if (lang === "ml") newContent = "നിങ്ങളുടെ ലിംഗഭേദം എന്താണ്? (പുരുഷൻ/സ്ത്രീ/മറ്റുള്ളവ)";
      else if (lang === "ur") newContent = "آپ کی صنف کیا ہے؟ (مرد/عورت/دیگر)";
      else newContent = "What is your gender? (Male/Female/Other)";
      break;
    case "form_ask_income":
      if (lang === "hi") newContent = "आपकी वार्षिक पारिवारिक आय कितनी है? (₹ में)";
      else if (lang === "mr") newContent = "तुमचे वार्षिक कौटुंबिक उत्पन्न किती आहे? (₹ मध्ये)";
      else if (lang === "pa") newContent = "ਤੁਹਾਡੀ ਸਾਲਾਨਾ ਪਰਿਵਾਰਕ ਆਮਦਨ ਕਿੰਨੀ ਹੈ? (₹ ਵਿੱਚ)";
      else if (lang === "ml") newContent = "നിങ്ങളുടെ വാർഷിക കുടുംബ വരുമാനം എത്രയാണ്? (₹ ൽ)";
      else if (lang === "ur") newContent = "آپ کی سالانہ خاندانی آمدنی کتنی ہے؟ (₹ میں)";
      else newContent = "What is your annual family income? (in ₹)";
      break;
    case "form_ask_occupation":
      if (lang === "hi") newContent = "आपका वर्तमान व्यवसाय क्या है? (जैसे: छात्र, किसान, नौकरी, आदि)";
      else if (lang === "mr") newContent = "तुमचा सध्याचा व्यवसाय काय आहे? (उदा: विद्यार्थी, शेतकरी, नोकरी, इ.)";
      else if (lang === "pa") newContent = "ਤੁਹਾਡਾ ਮੌਜੂਦਾ ਕਿੱਤਾ ਕੀ ਹੈ? (ਜਿਵੇਂ: ਵਿਦਿਆਰਥੀ, ਕਿਸਾਨ, ਨੌਕਰੀ, ਆਦਿ)";
      else if (lang === "ml") newContent = "നിങ്ങളുടെ നിലവിലെ തൊഴിൽ എന്താണ്? (ഉദാ: വിദ്യാർത്ഥി, കർഷകൻ, ജോലി മുതലായവ)";
      else if (lang === "ur") newContent = "آپ کا موجودہ پیشہ کیا ہے؟ (جیسے: طالب علم، کسان، نوکری، وغیرہ)";
      else newContent = "What is your current occupation? (e.g., Student, Farmer, Job, etc.)";
      break;
    case "error_invalid_name":
      if (lang === "hi") newContent = "कृपया एक वैध नाम दर्ज करें (कम से कम 3 अक्षर और कोई अंक नहीं)।\n\nआपका पूरा नाम क्या है?";
      else if (lang === "mr") newContent = "कृपया वैध नाव प्रविष्ट करा (किमान 3 अक्षरे आणि कोणतेही अंक नाहीत).\n\nतुमचे पूर्ण नाव काय आहे?";
      else if (lang === "pa") newContent = "ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ ਨਾਮ ਦਰਜ ਕਰੋ (ਘੱਟੋ-ਘੱਟ 3 ਅੱਖਰ ਅਤੇ ਕੋਈ ਅੰਕ ਨਹੀਂ)।\n\nਤੁਹਾਡਾ ਪੂਰਾ ਨਾਮ ਕੀ ਹੈ?";
      else if (lang === "ml") newContent = "ദയവായി സാധുവായ ഒരു പേര് നൽകുക (കുറഞ്ഞത് 3 അക്ഷരങ്ങൾ, അക്കങ്ങൾ പാടില്ല).\n\nനിങ്ങളുടെ പൂർണ്ണനാമം എന്താണ്?";
      else if (lang === "ur") newContent = "براہ کرم ایک درست نام درج کریں (کم از کم 3 حروف اور کوئی ہندسہ نہیں)۔\n\nآپ کا پورا نام کیا ہے؟";
      else newContent = "Please enter a valid name (at least 3 characters and no numbers).\n\nWhat is your full name?";
      break;
    case "error_invalid_age":
      if (lang === "hi") newContent = "कृपया एक वैध आयु दर्ज करें (1-120 के बीच)।\n\nआपकी आयु कितनी है?";
      else if (lang === "mr") newContent = "कृपया वैध वय प्रविष्ट करा (1-120 दरम्यान).\n\nतुमचे वय किती आहे?";
      else if (lang === "pa") newContent = "ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ ਉਮਰ ਦਰਜ ਕਰੋ (1-120 ਦੇ ਵਿਚਕਾਰ)।\n\nਤੁਹਾਡੀ ਉਮਰ ਕਿੰਨੀ ਹੈ?";
      else if (lang === "ml") newContent = "ദയവായി സാധുവായ ഒരു പ്രായം നൽകുക (1-120 ന് ഇടയിൽ).\n\nനിങ്ങളുടെ പ്രായം എത്രയാണ്?";
      else if (lang === "ur") newContent = "براہ کرم ایک درست عمر درج کریں (1-120 کے درمیان)۔\n\nآپ کی عمر کتنی ہے؟";
      else newContent = "Please enter a valid age (between 1-120).\n\nWhat is your age?";
      break;
    case "error_invalid_phone":
      if (lang === "hi") newContent = "कृपया एक वैध 10-अंकीय संपर्क नंबर दर्ज करें।\n\nआपका संपर्क नंबर क्या है?";
      else if (lang === "mr") newContent = "कृपया वैध 10-अंकी संपर्क क्रमांक प्रविष्ट करा.\n\nतुमचा संपर्क क्रमांक काय आहे?";
      else if (lang === "pa") newContent = "ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ 10-ਅੰਕਾਂ ਵਾਲਾ ਸੰਪਰਕ ਨੰਬਰ ਦਰਜ ਕਰੋ।\n\nਤੁਹਾਡਾ ਸੰਪਰਕ ਨੰਬਰ ਕੀ ਹੈ?";
      else if (lang === "ml") newContent = "ദയവായി സാധുവായ 10 അക്ക കോൺടാക്റ്റ് നമ്പർ നൽകുക.\n\nനിങ്ങളുടെ ബന്ധപ്പെടാനുള്ള നമ്പർ എന്താണ്?";
      else if (lang === "ur") newContent = "براہ کرم ایک درست 10 ہندسوں کا رابطہ نمبر درج کریں۔\n\nآپ کا رابطہ نمبر کیا ہے؟";
      else newContent = "Please enter a valid 10-digit contact number.\n\nWhat is your contact number?";
      break;
    case "error_invalid_gender":
      if (lang === "hi") newContent = "कृपया पुरुष, महिला या अन्य में से चुनें।\n\nआपका लिंग क्या है?";
      else if (lang === "mr") newContent = "कृपया पुरुष, स्त्री किंवा इतर यापैकी निवडा.\n\nतुमचे लिंग काय आहे?";
      else if (lang === "pa") newContent = "ਕਿਰਪਾ ਕਰਕੇ ਪੁਰਸ਼, ਔਰਤ ਜਾਂ ਹੋਰ ਵਿੱਚੋਂ ਚੁਣੋ।\n\nਤੁਹਾਡਾ ਲਿੰਗ ਕੀ ਹੈ?";
      else if (lang === "ml") newContent = "പുരുഷൻ, സ്ത്രീ അല്ലെങ്കിൽ മറ്റുള്ളവ എന്നിവയിൽ നിന്ന് തിരഞ്ഞെടുക്കുക.\n\nനിങ്ങളുടെ ലിംഗഭേദം എന്താണ്?";
      else if (lang === "ur") newContent = "براہ کرم مرد، عورت یا دیگر میں سے انتخاب کریں۔\n\nآپ کی صنف کیا ہے؟";
      else newContent = "Please choose from Male, Female, or Other.\n\nWhat is your gender?";
      break;
    case "error_invalid_income":
      if (lang === "hi") newContent = "कृपया एक वैध राशि दर्ज करें।\n\nआपकी वार्षिक पारिवारिक आय कितनी है?";
      else if (lang === "mr") newContent = "कृपया वैध रक्कम प्रविष्ट करा.\n\nतुमचे वार्षिक कौटुंबिक उत्पन्न किती आहे?";
      else if (lang === "pa") newContent = "ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ ਰਕਮ ਦਰਜ ਕਰੋ।\n\nਤੁਹਾਡੀ ਸਾਲਾਨਾ ਪਰਿਵਾਰਕ ਆਮਦਨ ਕਿੰਨੀ ਹੈ?";
      else if (lang === "ml") newContent = "ദയവായി സാധുവായ ഒരു തുക നൽകുക.\n\nനിങ്ങളുടെ വാർഷിക കുടുംബ വരുമാനം എത്രയാണ്?";
      else if (lang === "ur") newContent = "براہ کرم ایک درست رقم درج کریں۔\n\nآپ کی سالانہ خاندانی آمدنی کتنی ہے؟";
      else newContent = "Please enter a valid amount.\n\nWhat is your annual family income?";
      break;
    case "not_eligible":
      const reason = msg.data?.reason || "";
      if (lang === "hi") newContent = `क्षमा करें, आप इस योजना के लिए पात्र नहीं हैं।\n\nकारण: ${reason}\n\nक्या आप किसी अन्य योजना के बारे में जानना चाहते हैं?`;
      else if (lang === "mr") newContent = `क्षमस्व, तुम्ही या योजनेसाठी पात्र नाही.\n\nकारण: ${reason}\n\nतुम्हाला इतर कोणत्याही योजनेबद्दल जाणून घ्यायचे आहे का?`;
      else if (lang === "pa") newContent = `ਮਾਫ ਕਰਨਾ, ਤੁਸੀਂ ਇਸ ਯੋਜਨਾ ਲਈ ਯੋਗ ਨਹੀਂ ਹੋ।\n\nਕਾਰਨ: ${reason}\n\nਕੀ ਤੁਸੀਂ ਕਿਸੇ ਹੋਰ ਯੋਜਨਾ ਬਾਰੇ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?`;
      else if (lang === "ml") newContent = `ക്ഷമിക്കണം, ഈ പദ്ധതിക്ക് നിങ്ങൾ യോഗ്യനല്ല.\n\nകാരണം: ${reason}\n\nമറ്റേതെങ്കിലും പദ്ധതിയെക്കുറിച്ച് അറിയാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?`;
      else if (lang === "ur") newContent = `معذرت، آپ اس اسکیم کے لیے اہل نہیں ہیں۔\n\nوجہ: ${reason}\n\nکیا آپ کسی دوسری اسکیم کے بارے में جاننا چاہتے ہیں؟`;
      else newContent = `I'm sorry, you are not eligible for this scheme.\n\nReason: ${reason}\n\nWould you like to know about any other schemes?`;
      break;
    case "form_completed":
      const refNum = msg.data?.ref || "REF-" + Math.random().toString(36).substr(2, 9).toUpperCase();
      if (lang === "hi") newContent = `धन्यवाद! आपका आवेदन विवरण सफलतापूर्वक दर्ज कर लिया गया है।\n\n**संदर्भ संख्या: ${refNum}**\n\nअब आप नीचे दिए गए बटन का उपयोग करके आधिकारिक पोर्टल पर आवेदन कर सकते हैं। आपके विवरण स्वचालित रूप से भर दिए जाएंगे।`;
      else if (lang === "mr") newContent = `धन्यवाद! तुमच्या अर्जाचा तपशील यशस्वीरित्या नोंदवला गेला आहे.\n\n**संदर्भ क्रमांक: ${refNum}**\n\nआता तुम्ही खालील बटण वापरून अधिकृत पोर्टलवर अर्ज करू शकता. तुमचे तपशील आपोआप भरले जातील.`;
      else if (lang === "pa") newContent = `ਧੰਨਵਾਦ! ਤੁਹਾਡੀ ਅਰਜ਼ੀ ਦੇ ਵੇਰਵੇ ਸਫਲਤਾਪੂਰਵਕ ਦਰਜ ਕਰ ਲਏ ਗਏ ਹਨ।\n\n**ਹਵਾਲਾ ਨੰਬਰ: ${refNum}**\n\nਹੁਣ ਤੁਸੀਂ ਹੇਠਾਂ ਦਿੱਤੇ ਬਟਨ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਅਧਿਕਾਰਤ ਪੋਰਟਲ 'ਤੇ ਅਪਲਾਈ ਕਰ ਸਕਦੇ ਹੋ। ਤੁਹਾਡੇ ਵੇਰਵੇ ਸਵੈਚਲਿਤ ਤੌਰ 'ਤੇ ਭਰ ਦਿੱਤੇ ਜਾਣਗੇ।`;
      else if (lang === "ml") newContent = `നന്ദി! നിങ്ങളുടെ അപേക്ഷാ വിശദാംശങ്ങൾ വിജയകരമായി രേഖപ്പെടുത്തി.\n\n**റഫറൻസ് നമ്പർ: ${refNum}**\n\nഇനി നിങ്ങൾക്ക് താഴെയുള്ള ബട്ടൺ ഉപയോഗിച്ച് ഔദ്യോഗിക പോർട്ടലിൽ അപേക്ഷിക്കാം. നിങ്ങളുടെ വിശദാംശങ്ങൾ സ്വയമേവ പൂരിപ്പിക്കും.`;
      else if (lang === "ur") newContent = `شکریہ! آپ کی درخواست کی تفصیلات کامیابی کے ساتھ درج کر لی گئی ہیں۔\n\n**حوالہ نمبر: ${refNum}**\n\nاب آپ نیچے دیے گئے بٹن کا استعمال کرتے ہوئے آفیشل پورٹل پر اپلائی کر سکتے ہیں۔ آپ کی تفصیلات خود بخود پُر ہو جائیں گی۔`;
      else newContent = `Thank you! Your application details have been recorded successfully.\n\n**Reference Number: ${refNum}**\n\nYou can now apply on the official portal using the button below. Your details will be pre-filled automatically.`;
      break;
    case "fallback":
      if (lang === "hi") newContent = "क्षमा करें, मुझे इसके बारे में जानकारी नहीं मिली। क्या आप किसी विशिष्ट श्रेणी जैसे 'शिक्षा' या 'कृषि' के बारे में पूछ सकते हैं?";
      else if (lang === "mr") newContent = "क्षमस्व, मला त्याबद्दल माहिती मिळाली नाही. तुम्ही 'शिक्षण' किंवा 'शेती' सारख्या विशिष्ट श्रेणीबद्दल विचारू शकता का?";
      else if (lang === "pa") newContent = "ਮਾਫ ਕਰਨਾ, ਮੈਨੂੰ ਇਸ ਬਾਰੇ ਜਾਣਕਾਰੀ ਨਹੀਂ ਮਿਲੀ। ਕੀ ਤੁਸੀਂ 'ਸਿੱਖਿਆ' ਜਾਂ 'ਖੇਤੀਬਾੜੀ' ਵਰਗੀ ਕਿਸੇ ਵਿਸ਼ੇਸ਼ ਸ਼੍ਰੇਣੀ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ?";
      else if (lang === "ml") newContent = "ക്ഷമിക്കണം, എനിക്ക് അതിനെക്കുറിച്ച് വിവരങ്ങൾ കണ്ടെത്താനായില്ല. 'വിദ്യാഭ്യാസം' അല്ലെങ്കിൽ 'കൃഷി' പോലുള്ള ഒരു പ്രത്യേക വിഭാഗത്തെക്കുറിച്ച് ചോദിക്കാമോ?";
      else if (lang === "ur") newContent = "معذرت، مجھے اس کے بارے میں معلومات نہیں مل سکیں۔ کیا آپ کسی مخصوص زمرے جیسے 'تعلیم' یا 'زراعت' کے بارے میں پوچھ سکتے ہیں؟";
      else newContent = "I'm sorry, I couldn't find specific information for that. Could you ask about a specific category like 'Education' or 'Agriculture'?";
      break;
    case "thank_you":
      if (lang === "hi") newContent = "आपका स्वागत है! BHARATAI का उपयोग करने के लिए धन्यवाद। 🙏";
      else if (lang === "mr") newContent = "तुमचे स्वागत आहे! BHARATAI वापरल्याबद्दल धन्यवाद. 🙏";
      else if (lang === "pa") newContent = "ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ! BHARATAI ਦੀ ਵਰਤੋਂ ਕਰਨ ਲਈ ਧੰਨਵਾਦ। 🙏";
      else if (lang === "ml") newContent = "നിങ്ങൾക്ക് സ്വാഗതം! BHARATAI ഉപയോഗിച്ചതിന് നന്ദി. 🙏";
      else if (lang === "ur") newContent = "آپ کا استقبال ہے! BHARATAI استعمال کرنے کے لیے شکریہ۔ 🙏";
      else newContent = "YOU'RE WELCOME! THANK YOU FOR USING BHARATAI 🙏";
      break;
    case "explain_process":
      const scheme = msg.data as Scheme;
      const steps = scheme.processSteps || [];
      
      let stepsList = "";
      if (lang === "hi") stepsList = steps.map((s, i) => `**चरण ${i + 1}:**\n${s}`).join("\n\n");
      else if (lang === "mr") stepsList = steps.map((s, i) => `**पायरी ${i + 1}:**\n${s}`).join("\n\n");
      else if (lang === "pa") stepsList = steps.map((s, i) => `**ਕਦਮ ${i + 1}:**\n${s}`).join("\n\n");
      else if (lang === "ml") stepsList = steps.map((s, i) => `**ഘട്ടം ${i + 1}:**\n${s}`).join("\n\n");
      else if (lang === "ur") stepsList = steps.map((s, i) => `**مرحلہ ${i + 1}:**\n${s}`).join("\n\n");
      else stepsList = steps.map((s, i) => `**Step ${i + 1}:**\n${s}`).join("\n\n");
      
      if (lang === "hi") newContent = `निश्चित रूप से! **${scheme.name}** के लिए आवेदन करने की प्रक्रिया यहाँ दी गई है:\n\n${stepsList}\n\nक्या आप इसके लिए आवेदन पत्र भरना शुरू करना चाहेंगे?`;
      else if (lang === "mr") newContent = `नक्कीच! **${scheme.name}** साठी अर्ज करण्याची प्रक्रिया येथे आहे:\n\n${stepsList}\n\nतुम्ही यासाठी अर्ज भरायला सुरुवात करू इच्छिता का?`;
      else if (lang === "pa") newContent = `ਯਕੀਨੀ ਤੌਰ 'ਤੇ! **${scheme.name}** ਲਈ ਅਪਲਾਈ ਕਰਨ ਦੀ ਪ੍ਰਕਿਰਿਆ ਇੱਥੇ ਹੈ:\n\n${stepsList}\n\nਕੀ ਤੁਸੀਂ ਇਸ ਲਈ ਅਰਜ਼ੀ ਫਾਰਮ ਭਰਨਾ ਸ਼ੁਰੂ ਕਰਨਾ ਚਾਹੋਗੇ?`;
      else if (lang === "ml") newContent = `തീർച്ചയായും! **${scheme.name}**-ന് അപേക്ഷിക്കാനുള്ള നടപടിക്രമങ്ങൾ താഴെ പറയുന്നവയാണ്:\n\n${stepsList}\n\nനിങ്ങൾക്ക് ഇതിനായി അപേക്ഷാ ഫോം പൂരിപ്പിക്കാൻ തുടങ്ങണോ?`;
      else if (lang === "ur") newContent = `یقیناً! **${scheme.name}** کے لیے اپلائی کرنے کا طریقہ کار یہ ہے:\n\n${stepsList}\n\nکیا آپ اس کے لیے درخواست فارم بھرنا شروع کرنا چاہیں گے؟`;
      else newContent = `Certainly! Here is the step-by-step application process for **${scheme.name}**:\n\n${stepsList}\n\nWould you like to start filling out the application form for this?`;
      break;
  }

  return { ...msg, content: newContent, data: newData };
};

export const processUserQuery = (
  query: string,
  lang: string,
  history: ChatMessage[]
): { content: string; type: "text" | "schemes" | "options"; intent: string; data?: any; formStep?: string; formData?: any } => {
  const lowerQuery = query.toLowerCase();
  const lastAssistantMsg = [...history].reverse().find(m => m.role === "assistant");

  // 0. Handle Form Filling Flow
  if (lastAssistantMsg?.formStep && lastAssistantMsg.formStep !== "completed") {
    const currentStep = lastAssistantMsg.formStep;
    const currentData = lastAssistantMsg.formData || {};
    const targetScheme = schemes.find(s => s.id === currentData.schemeId);

    // 0a. Check for Intent Shift (Stop form if user asks something else)
    const stopWords = ["stop", "cancel", "no", "exit", "don't", "नहीं", "बंद करें", "रद्द करें", "नको", "बंद करा", "रद्द करा", "ਰੋਕੋ", "ਨਹੀਂ", "നിർത്തുക", "വേണ്ട", "روکیں", "نہیں"];
    const isStop = stopWords.some(w => lowerQuery === w);
    
    // Check if query looks like a search query instead of a form answer
    const searchKeywords = ["scheme", "loan", "farmer", "student", "help", "योजना", "मदद", "सहायता", "योजना", "मदत", "ਸਹਾਇਤਾ", "പദ്ധതി", "സഹായം", "اسکیم", "مدد"];
    const isSearchQuery = searchKeywords.some(w => lowerQuery.includes(w)) && query.split(" ").length > 1;

    if (isStop || isSearchQuery) {
      // Clear form state and continue to normal processing if it's a search, 
      // or stop if it's a stop word.
      if (isStop) {
        return {
          content: lang === "hi" ? "ठीक है, मैंने फॉर्म भरना रोक दिया है। मैं आपकी और क्या मदद कर सकता हूँ?" : "Okay, I've stopped the form filling. How else can I help you?",
          type: "text",
          intent: "greeting"
        };
      }
      // If it's a search query, we'll let the rest of the function handle it by not returning here.
    } else {
      if (currentStep === "ask_to_apply") {
        const yesWords = [
          "yes", "yeah", "yup", "ok", "sure", "yep", 
          "हाँ", "जी हाँ", "ठीक है", 
          "हो", "नक्की", "होय",
          "ਹਾਂ", "ਠੀਕ ਹੈ",
          "അതെ", "ശരി",
          "ہاں", "جی ہاں", "ٹھیک ہے"
        ];
        const isYes = yesWords.some(y => lowerQuery.includes(y.toLowerCase()));
        if (isYes) {
          // Find the scheme we were talking about
          const previousAssistantMsg = [...history].reverse().find(m => m.role === "assistant" && m.type === "schemes");
          const targetSchemeId = previousAssistantMsg?.data?.[0]?.id;

          const botRes = translateMessage({
            id: "temp",
            role: "assistant",
            content: "",
            timestamp: Date.now(),
            type: "text",
            intent: "form_ask_name"
          }, lang);
          return { ...botRes, formStep: "filling_name", formData: { schemeId: targetSchemeId } };
        }
      } else if (currentStep === "filling_name") {
        // Validation: Min 3 chars, no numbers
        const isValid = query.length >= 2 && !/\d/.test(query);
        if (!isValid) {
          const botRes = translateMessage({
            id: "temp",
            role: "assistant",
            content: "",
            timestamp: Date.now(),
            type: "text",
            intent: "error_invalid_name"
          }, lang);
          return { ...botRes, formStep: "filling_name", formData: currentData };
        }

        const botRes = translateMessage({
          id: "temp",
          role: "assistant",
          content: "",
          timestamp: Date.now(),
          type: "text",
          intent: "form_ask_age"
        }, lang);
        return { ...botRes, formStep: "filling_age", formData: { ...currentData, name: query } };
      } else if (currentStep === "filling_age") {
        // Validation: Number 1-120
        const ageNum = parseInt(query);
        const isValid = !isNaN(ageNum) && ageNum > 0 && ageNum < 120;
        if (!isValid) {
          const botRes = translateMessage({
            id: "temp",
            role: "assistant",
            content: "",
            timestamp: Date.now(),
            type: "text",
            intent: "error_invalid_age"
          }, lang);
          return { ...botRes, formStep: "filling_age", formData: currentData };
        }

        // Eligibility check for Age
        if (targetScheme) {
          const e = targetScheme.eligibility;
          if (e.minAge !== undefined && ageNum < e.minAge) {
            return {
              ...translateMessage({
                id: "temp", role: "assistant", content: "", timestamp: Date.now(), type: "text",
                intent: "not_eligible", data: { reason: `Minimum age required is ${e.minAge} years.` }
              }, lang),
              formStep: undefined
            };
          }
          if (e.maxAge !== undefined && ageNum > e.maxAge) {
            return {
              ...translateMessage({
                id: "temp", role: "assistant", content: "", timestamp: Date.now(), type: "text",
                intent: "not_eligible", data: { reason: `Maximum age allowed is ${e.maxAge} years.` }
              }, lang),
              formStep: undefined
            };
          }
        }

        const botRes = translateMessage({
          id: "temp",
          role: "assistant",
          content: "",
          timestamp: Date.now(),
          type: "text",
          intent: "form_ask_phone"
        }, lang);
        return { ...botRes, formStep: "filling_phone", formData: { ...currentData, age: query } };
      } else if (currentStep === "filling_phone") {
        // Validation: 10 digits
        const cleanPhone = query.replace(/[^\d]/g, "");
        const isValid = cleanPhone.length === 10;
        if (!isValid) {
          const botRes = translateMessage({
            id: "temp",
            role: "assistant",
            content: "",
            timestamp: Date.now(),
            type: "text",
            intent: "error_invalid_phone"
          }, lang);
          return { ...botRes, formStep: "filling_phone", formData: currentData };
        }

        const botRes = translateMessage({
          id: "temp",
          role: "assistant",
          content: "",
          timestamp: Date.now(),
          type: "text",
          intent: "form_ask_state"
        }, lang);
        return { ...botRes, formStep: "filling_state", formData: { ...currentData, phone: cleanPhone } };
      } else if (currentStep === "filling_state") {
        // Validation: Min 3 chars
        if (query.length < 2) {
          const botRes = translateMessage({
            id: "temp",
            role: "assistant",
            content: "",
            timestamp: Date.now(),
            type: "text",
            intent: "form_ask_state" // Re-ask
          }, lang);
          return { ...botRes, formStep: "filling_state", formData: currentData };
        }

        const botRes = translateMessage({
          id: "temp",
          role: "assistant",
          content: "",
          timestamp: Date.now(),
          type: "text",
          intent: "form_ask_gender"
        }, lang);
        return { ...botRes, formStep: "filling_gender", formData: { ...currentData, state: query } };
      } else if (currentStep === "filling_gender") {
        // Validation: Check for Male/Female/Other keywords
        const maleWords = ["male", "man", "boy", "पुरुष", "मुलगा", "ਮਰਦ", "പുരുഷൻ", "مرد"];
        const femaleWords = ["female", "woman", "girl", "महिला", "स्त्री", "मुलगी", "ਔਰਤ", "സ്ത്രീ", "عورت"];
        const otherWords = ["other", "trans", "अन्य", "इतर", "ਹੋਰ", "മറ്റുള്ളവ", "دیگر"];
        
        let detectedGender = "";
        if (maleWords.some(w => lowerQuery.includes(w))) detectedGender = "male";
        else if (femaleWords.some(w => lowerQuery.includes(w))) detectedGender = "female";
        else if (otherWords.some(w => lowerQuery.includes(w))) detectedGender = "other";

        if (!detectedGender) {
          const botRes = translateMessage({
            id: "temp",
            role: "assistant",
            content: "",
            timestamp: Date.now(),
            type: "text",
            intent: "error_invalid_gender"
          }, lang);
          return { ...botRes, formStep: "filling_gender", formData: currentData };
        }

        // Eligibility check for Gender
        if (targetScheme && targetScheme.eligibility.gender && targetScheme.eligibility.gender !== "all") {
          if (detectedGender !== targetScheme.eligibility.gender) {
            return {
              ...translateMessage({
                id: "temp", role: "assistant", content: "", timestamp: Date.now(), type: "text",
                intent: "not_eligible", data: { reason: `This scheme is only for ${targetScheme.eligibility.gender} applicants.` }
              }, lang),
              formStep: undefined
            };
          }
        }

        const botRes = translateMessage({
          id: "temp",
          role: "assistant",
          content: "",
          timestamp: Date.now(),
          type: "text",
          intent: "form_ask_income"
        }, lang);
        return { ...botRes, formStep: "filling_income", formData: { ...currentData, gender: detectedGender } };
      } else if (currentStep === "filling_income") {
        // Validation: Positive number
        const incomeNum = parseInt(query.replace(/[^\d]/g, ""));
        if (isNaN(incomeNum) || incomeNum < 0) {
          const botRes = translateMessage({
            id: "temp",
            role: "assistant",
            content: "",
            timestamp: Date.now(),
            type: "text",
            intent: "error_invalid_income"
          }, lang);
          return { ...botRes, formStep: "filling_income", formData: currentData };
        }

        // Eligibility check for Income
        if (targetScheme && targetScheme.eligibility.maxIncome !== undefined) {
          if (incomeNum > targetScheme.eligibility.maxIncome) {
            return {
              ...translateMessage({
                id: "temp", role: "assistant", content: "", timestamp: Date.now(), type: "text",
                intent: "not_eligible", data: { reason: `Annual income must be below ₹${targetScheme.eligibility.maxIncome}.` }
              }, lang),
              formStep: undefined
            };
          }
        }

        const botRes = translateMessage({
          id: "temp",
          role: "assistant",
          content: "",
          timestamp: Date.now(),
          type: "text",
          intent: "form_ask_occupation"
        }, lang);
        return { ...botRes, formStep: "filling_occupation", formData: { ...currentData, income: incomeNum } };
      } else if (currentStep === "filling_occupation") {
        if (query.length < 3) {
          const botRes = translateMessage({
            id: "temp",
            role: "assistant",
            content: "",
            timestamp: Date.now(),
            type: "text",
            intent: "form_ask_occupation" // Re-ask
          }, lang);
          return { ...botRes, formStep: "filling_occupation", formData: currentData };
        }

        // Eligibility check for Occupation
        if (targetScheme && targetScheme.eligibility.occupation && targetScheme.eligibility.occupation.length > 0) {
          const isOccupationValid = targetScheme.eligibility.occupation.some(o => lowerQuery.includes(o.toLowerCase()));
          if (!isOccupationValid) {
            return {
              ...translateMessage({
                id: "temp", role: "assistant", content: "", timestamp: Date.now(), type: "text",
                intent: "not_eligible", data: { reason: `This scheme is for ${targetScheme.eligibility.occupation.join(", ")} only.` }
              }, lang),
              formStep: undefined
            };
          }
        }

        const refNumber = "REF-" + Math.random().toString(36).substr(2, 9).toUpperCase();
        const finalData = { ...currentData, occupation: query, ref: refNumber, date: new Date().toLocaleDateString() };
        
        const botRes = translateMessage({
          id: "temp",
          role: "assistant",
          content: "",
          timestamp: Date.now(),
          type: "text",
          intent: "form_completed",
          data: finalData
        }, lang);
        return { ...botRes, formStep: "completed", formData: finalData };
      }
    }
  }

  // 1. Domain Detection
  const domains = [
    { key: "student", words: ["student", "education", "scholarship", "college", "school", "छात्र", "पढ़ाई", "शिक्षा", "स्कॉलरशिप", "विद्यार्थी", "शिक्षण", "ਵਿਦਿਆਰਥੀ", "വിദ്യാർത്ഥി", "طالب علم"] },
    { key: "women", words: ["women", "girl", "mother", "female", "महिला", "लड़की", "बेटी", "स्त्री", "स्त्रिया", "मुलगी", "ਔਰਤ", "സ്ത്രീ", "عورت"] },
    { key: "farmer", words: ["farmer", "agriculture", "kisan", "crop", "land", "किसान", "खेती", "कृषि", "फसल", "शेतकरी", "शेती", "ਕਿਸਾਨ", "ਕਮਾਈ", "کسਾਨ"] },
    { key: "health", words: ["health", "medical", "hospital", "doctor", "medicine", "स्वास्थ्य", "अस्पताल", "दवा", "इलाज", "आरोग्य", "दवाखाना", "ਸਿਹਤ", "ആരോഗ്യം", "صحت"] },
    { key: "business", words: ["business", "startup", "loan", "entrepreneur", "व्यापार", "बिजनेस", "ऋण", "लोन", "व्यवसाय", "ਵਪਾਰ", "ബിസിനസ്സ്", "کاروبار"] },
    { key: "housing", words: ["housing", "home", "house", "construction", "आवास", "घर", "मकान", "घरकुल", "ਹਾਊਸਿੰਗ", "ഭവനം", "ہاؤسنگ"] },
  ];

  const detectedDomain = domains.find(d => d.words.some(word => lowerQuery.includes(word)));

  // 2. Handle Specific Intent (Even if Greeting is present)
  if (detectedDomain) {
    const matchedSchemes = schemes.filter(s => {
      const keywords = [s.name, s.category, s.description, ...s.documents].join(" ").toLowerCase();
      return detectedDomain.words.some(word => word.length > 3 && keywords.includes(word)) || 
             s.category.toLowerCase().includes(detectedDomain.key);
    });

    if (matchedSchemes.length > 0) {
      const botRes = translateMessage({
        id: "temp",
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        type: "schemes",
        intent: "domain_results",
        data: matchedSchemes.slice(0, 5)
      }, lang);

      const greetingPrefix = ["hi", "hello", "hey", "नमस्ते", "नमस्कार", "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", "ഹലോ", "ہیلو"].some(g => lowerQuery.includes(g))
        ? (lang === "hi" ? "नमस्ते! " : lang === "mr" ? "नमस्कार! " : "Hello! ")
        : "";

      const applyPrompt = translateMessage({
        id: "temp",
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        type: "text",
        intent: "apply_prompt"
      }, lang);

      return {
        content: (greetingPrefix + botRes.content + "\n\n" + applyPrompt.content).trim(),
        type: "schemes",
        intent: "domain_results",
        data: botRes.data,
        formStep: "ask_to_apply"
      };
    }
  }

  // 3. Handle Greetings (Fallback)
  if (["hi", "hello", "hey", "नमस्ते", "नमस्कार", "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", "ഹലോ", "ہیلو"].some(g => lowerQuery.includes(g))) {
    const g = greetings[lang] || greetings.en;
    return {
      content: g.content,
      type: "options",
      intent: "greeting",
      data: g.options
    };
  }

  // 3b. Handle Thank You
  const thankYouWords = ["thank", "thanks", "धन्यवाद", "शुक्रिया", "आभारी", "ਧੰਨਵਾਦ", "നന്ദി", "شکریہ"];
  if (thankYouWords.some(w => lowerQuery.includes(w))) {
    const botRes = translateMessage({
      id: "temp",
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      type: "text",
      intent: "thank_you"
    }, lang);
    return {
      content: botRes.content,
      type: "text",
      intent: "thank_you"
    };
  }

  // 3c. Handle "Explain Process"
  const processKeywords = ["explain", "process", "steps", "how to apply", "procedure", "तरीका", "प्रक्रिया", "कसे अर्ज करायचे", "ਕਿਵੇਂ ਅਪਲਾਈ ਕਰਨਾ ਹੈ", "അപേക്ഷിക്കുന്നത് എങ്ങനെ", "درخواست کیسے دیں"];
  if (processKeywords.some(w => lowerQuery.includes(w))) {
    // Find the last shown scheme
    const lastSchemesMsg = [...history].reverse().find(m => m.type === "schemes" && m.data && m.data.length > 0);
    const targetScheme = lastSchemesMsg?.data?.[0]; // Assume the first scheme if multiple were shown

    if (targetScheme) {
      const botRes = translateMessage({
        id: "temp",
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        type: "text",
        intent: "explain_process",
        data: targetScheme
      }, lang);

      return {
        content: botRes.content,
        type: "text",
        intent: "explain_process",
        data: targetScheme,
        formStep: "ask_to_apply" // Allow user to start form filling after explanation
      };
    }
  }

  // 4. Handle "Check Eligibility" or "Find by income"
  if (lowerQuery.includes("eligibility") || lowerQuery.includes("income") || lowerQuery.includes("पात्रता") || lowerQuery.includes("ਪਾਤਰਤਾ") || lowerQuery.includes("യോഗ്യത") || lowerQuery.includes("اہلیت")) {
    const botRes = translateMessage({
      id: "temp",
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      type: "text",
      intent: "eligibility_prompt"
    }, lang);
    
    return {
      content: botRes.content,
      type: "text",
      intent: "eligibility_prompt"
    };
  }

  // 5. Simple Keyword Search for Schemes
  const matchedSchemes = schemes.filter(s => {
    const keywords = [s.name, s.category, s.description, ...s.documents].join(" ").toLowerCase();
    return lowerQuery.split(" ").some(word => word.length > 3 && keywords.includes(word));
  });

  if (matchedSchemes.length > 0) {
    const botRes = translateMessage({
      id: "temp",
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      type: "schemes",
      intent: "search_results",
      data: matchedSchemes.slice(0, 5)
    }, lang);

    const applyPrompt = translateMessage({
      id: "temp",
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      type: "text",
      intent: "apply_prompt"
    }, lang);

    return {
      content: (botRes.content + "\n\n" + applyPrompt.content).trim(),
      type: "schemes",
      intent: "search_results",
      data: botRes.data,
      formStep: "ask_to_apply"
    };
  }

  // 6. Default Fallback
  const botRes = translateMessage({
    id: "temp",
    role: "assistant",
    content: "",
    timestamp: Date.now(),
    type: "text",
    intent: "fallback"
  }, lang);

  return {
    content: botRes.content,
    type: "text",
    intent: "fallback"
  };
};

export const speakText = (text: string, lang: string) => {
  if (!window.speechSynthesis) return;
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Map our app lang codes to browser lang codes
  const langMap: Record<string, string> = {
    en: "en-IN",
    hi: "hi-IN",
    pa: "pa-IN",
    ml: "ml-IN",
    ur: "ur-IN",
    mr: "mr-IN"
  };
  
  utterance.lang = langMap[lang] || "en-IN";
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  
  window.speechSynthesis.speak(utterance);
};
