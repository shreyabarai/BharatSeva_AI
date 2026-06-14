export interface Scheme {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  category: string;
  eligibility: {
    maxAge?: number;
    minAge?: number;
    maxIncome?: number;
    gender?: "male" | "female" | "all";
    occupation?: string[];
    states?: string[];
    caste?: string[];
  };
  documents: string[];
  applyUrl: string;
  processSteps: string[];
  deadline?: string;
  ministry?: string;
  website?: string;
  launched?: string;
  helpline?: string;
  objective?: string;
  whoCanApply?: string[];
  whoCannotApply?: string[];
}

export const schemes: Scheme[] = [
  {
    id: "pmay",
    name: "Pradhan Mantri Awas Yojana (PMAY)",
    description: "Housing for All - provides financial assistance for construction or enhancement of houses for the urban and rural poor.",
    benefits: ["Subsidy up to ₹2.67 Lakh on home loan interest"],
    category: "Housing",
    eligibility: { maxIncome: 1800000, gender: "all" },
    documents: ["Aadhaar Card", "Income Certificate", "Property Documents", "Bank Account Details"],
    applyUrl: "https://pmaymis.gov.in/",
    processSteps: [
      "Visit the official PMAY website (pmaymis.gov.in)",
      "Register yourself or login using Aadhaar",
      "Fill the application form with personal and property details",
      "Upload the required documents (Aadhaar, Income Proof, etc.)",
      "Submit the application and note down the assessment ID"
    ],
  },
  {
    id: "pmkisan",
    name: "PM-KISAN Samman Nidhi",
    description: "Direct income support of ₹6,000 per year to farmer families across India.",
    benefits: ["₹6,000/year in 3 instalments of ₹2,000"],
    category: "Agriculture",
    eligibility: { occupation: ["farmer"], gender: "all" },
    documents: ["Aadhaar Card", "Land Records", "Bank Account Details"],
    applyUrl: "https://pmkisan.gov.in/",
    processSteps: [
      "Go to pmkisan.gov.in and click on 'New Farmer Registration'",
      "Enter Aadhaar and select your state",
      "Fill the land holding details and bank information",
      "Upload land records and Aadhaar scan",
      "Submit and wait for e-KYC verification"
    ],
  },
  {
    id: "pmjay",
    name: "Ayushman Bharat (PM-JAY)",
    description: "Health insurance scheme providing coverage of ₹5 Lakh per family per year for secondary and tertiary hospitalisation.",
    benefits: ["₹5 Lakh health coverage per family/year"],
    category: "Health",
    eligibility: { maxIncome: 500000, gender: "all" },
    documents: ["Aadhaar Card", "Ration Card", "Income Certificate"],
    applyUrl: "https://pmjay.gov.in/",
    processSteps: [
      "Check eligibility on mera.pmjay.gov.in or visit a nearby CSC",
      "Carry your Aadhaar Card and Ration Card to the nearest empanelled hospital",
      "Get identified by the 'Ayushman Mitra' at the hospital kiosk",
      "Receive your Golden Card (e-Card) after verification",
      "Present the card at any empanelled hospital for cashless treatment"
    ],
  },
  {
    id: "pmsby",
    name: "Pradhan Mantri Suraksha Bima Yojana",
    description: "Accident insurance scheme with annual premium of ₹20 for accidental death and disability cover.",
    benefits: ["₹2 Lakh accidental death cover at ₹20/year premium"],
    category: "Insurance",
    eligibility: { minAge: 18, maxAge: 70, gender: "all" },
    documents: ["Aadhaar Card", "Bank Account Details"],
    applyUrl: "https://jansuraksha.gov.in/",
    processSteps: [
      "Visit your bank branch where you have a savings account",
      "Fill the PMSBY application form",
      "Provide Aadhaar and enable auto-debit for the annual premium (₹20)",
      "Submit the form and receive the acknowledgement",
      "Ensure sufficient balance in your account every year on May 31st"
    ],
  },
  {
    id: "pmjjby",
    name: "Pradhan Mantri Jeevan Jyoti Bima Yojana",
    description: "Life insurance scheme with ₹330/year premium providing ₹2 Lakh life cover.",
    benefits: ["₹2 Lakh life insurance cover at ₹330/year"],
    category: "Insurance",
    eligibility: { minAge: 18, maxAge: 50, gender: "all" },
    documents: ["Aadhaar Card", "Bank Account Details"],
    applyUrl: "https://jansuraksha.gov.in/",
    processSteps: [
      "Approach your bank or insurance company",
      "Complete the PMJJBY enrollment form",
      "Provide consent for auto-debit of ₹436 annual premium",
      "Submit Aadhaar as KYC document",
      "Policy certificate will be issued via email or post"
    ],
  },
  {
    id: "mudra",
    name: "Pradhan Mantri MUDRA Yojana",
    description: "Provides loans up to ₹10 Lakh to non-corporate, non-farm small/micro enterprises.",
    benefits: ["Loans up to ₹10 Lakh without collateral"],
    category: "Business",
    eligibility: { minAge: 18, occupation: ["self-employed", "business"], gender: "all" },
    documents: ["Aadhaar Card", "PAN Card", "Business Plan", "Address Proof"],
    applyUrl: "https://mudra.org.in/",
    processSteps: [
      "Prepare a detailed business plan for your micro-enterprise",
      "Approach a commercial bank, RRB, or MFI",
      "Fill the MUDRA loan application form (Shishu, Kishore, or Tarun)",
      "Submit identity proof, address proof, and business documents",
      "Wait for bank appraisal and loan sanction"
    ],
  },
  {
    id: "scholarship-sc",
    name: "Post Matric Scholarship for SC Students",
    description: "Financial assistance to SC students studying at post-matriculation level.",
    benefits: ["Full tuition fee + maintenance allowance"],
    category: "Education",
    eligibility: { maxIncome: 250000, caste: ["sc"], occupation: ["student"] },
    documents: ["Aadhaar Card", "Caste Certificate", "Income Certificate", "Marksheet"],
    applyUrl: "https://scholarships.gov.in/",
    processSteps: [
      "Register on the National Scholarship Portal (scholarships.gov.in)",
      "Select the 'Post Matric Scholarship for SC Students' scheme",
      "Fill in academic details and bank information",
      "Upload Caste, Income, and Marksheet documents",
      "Submit and track status on the NSP dashboard"
    ],
  },
  {
    id: "ujjwala",
    name: "Pradhan Mantri Ujjwala Yojana",
    description: "Free LPG connections to women from BPL households.",
    benefits: ["Free LPG connection + first refill"],
    category: "Welfare",
    eligibility: { gender: "female", maxIncome: 200000 },
    documents: ["Aadhaar Card", "BPL Card", "Bank Account Details"],
    applyUrl: "https://pmuy.gov.in/",
    processSteps: [
      "Visit the nearest LPG distributor (Indane, HP, or Bharat)",
      "Submit the Ujjwala application form for women",
      "Provide Aadhaar and BPL card for KYC",
      "Choose between 14.2kg or 5kg cylinder",
      "LPG connection will be installed after document verification"
    ],
  },
  {
    id: "sukanya",
    name: "Sukanya Samriddhi Yojana",
    description: "Savings scheme for girl child with high interest rate and tax benefits.",
    benefits: ["8.2% interest rate + tax-free returns"],
    category: "Savings",
    eligibility: { gender: "female", maxAge: 10 },
    documents: ["Birth Certificate", "Parent's Aadhaar", "Address Proof"],
    applyUrl: "https://www.india.gov.in/sukanya-samriddhi-yojna",
    processSteps: [
      "Visit any Post Office or authorized Commercial Bank",
      "Fill the SSY account opening form",
      "Submit the birth certificate of the girl child",
      "Provide parent/guardian identity and address proof",
      "Make an initial deposit (min ₹250)"
    ],
  },
  {
    id: "pmvvy",
    name: "Pradhan Mantri Vaya Vandana Yojana",
    description: "Pension scheme for senior citizens providing assured returns.",
    benefits: ["Guaranteed 7.4% annual return for 10 years"],
    category: "Pension",
    eligibility: { minAge: 60, gender: "all" },
    documents: ["Aadhaar Card", "Age Proof", "Bank Account Details"],
    applyUrl: "https://licindia.in/",
    processSteps: [
      "Visit the LIC of India website or branch office",
      "Select the PMVVY scheme option",
      "Choose the pension payment frequency (Monthly/Quarterly/Yearly)",
      "Pay the lump sum purchase price amount",
      "Provide bank details for direct pension credit"
    ],
  },
  {
    id: "nrega",
    name: "MGNREGA",
    description: "Guarantees 100 days of wage employment per year to rural households.",
    benefits: ["100 days guaranteed employment per year"],
    category: "Employment",
    eligibility: { minAge: 18, gender: "all" },
    documents: ["Aadhaar Card", "Job Card", "Bank Account Details"],
    applyUrl: "https://nrega.nic.in/",
    processSteps: [
      "Approach the local Gram Panchayat office",
      "Apply for a Job Card using your Aadhaar card",
      "Receive the Job Card with your unique ID",
      "Submit a written application for work (mentioning the dates)",
      "Work will be allotted within 15 days within 5km radius"
    ],
  },
  {
    id: "pmfby",
    name: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance scheme protecting farmers against crop loss due to natural calamities.",
    benefits: ["Insurance cover at 2% premium for Kharif, 1.5% for Rabi"],
    category: "Agriculture",
    eligibility: { occupation: ["farmer"], gender: "all" },
    documents: ["Aadhaar Card", "Land Records", "Sowing Certificate", "Bank Account"],
    applyUrl: "https://pmfby.gov.in/",
    processSteps: [
      "Register on the PMFBY portal or visit your bank/CSC",
      "Select the crop and area for insurance",
      "Pay the subsidized premium amount",
      "Submit land records and sowing certificate",
      "Policy receipt will be issued for future claims"
    ],
  },
  {
    id: "kcc",
    name: "Kisan Credit Card (KCC)",
    description: "Provide timely and adequate credit support to farmers for their agricultural operations.",
    benefits: [
      "Loans up to Rs 3 lakh at only 4% per annum interest (with 3% government subvention)",
      "Above Rs 3 lakh at normal bank rates",
      "Credit limit based on land holding and scale of finance",
      "Covers seeds, fertilizers, pesticides, post-harvest, equipment maintenance",
      "Also covers allied activities: dairy, fisheries, poultry",
      "Card valid for 5 years with annual renewal",
      "Accident insurance coverage of Rs 50,000"
    ],
    category: "Agriculture",
    eligibility: { occupation: ["farmer"], gender: "all" },
    documents: ["Aadhaar Card", "PAN Card", "Land records / Patta / Khasra", "Passport size photograph (2 copies)", "Bank account (preferably same bank)"],
    applyUrl: "https://www.nabard.org/content.aspx?id=516",
    processSteps: [
      "Visit any nationalized bank or cooperative bank branch",
      "Ask for KCC application form",
      "Submit land records and Aadhaar",
      "Bank processes within 14 working days",
      "Online via PM-KISAN portal (linked KCC scheme)"
    ],
    ministry: "Ministry of Finance / NABARD",
    website: "nabard.org",
    launched: "1998 (revamp 2004, 2012)",
    helpline: "022-26539895 (NABARD)",
    objective: "Provide timely and adequate credit support to farmers for their agricultural operations and allied activities at subsidized interest rates.",
    whoCanApply: [
      "All farmers — individual, joint borrowers",
      "Tenant farmers, oral lessees, share croppers",
      "SHGs (Self Help Groups) of farmers",
      "Fishermen and fish farmers",
      "Animal husbandry farmers (dairy, poultry)"
    ],
    whoCannotApply: [
      "Farmers with poor credit history / NPA accounts (case by case basis)"
    ],
  },
];

export const categories = [...new Set(schemes.map(s => s.category))];

export const personas = [
  { id: "farmer", label: "Farmer", icon: "🌾", description: "Agriculture & rural schemes" },
  { id: "student", label: "Student", icon: "📚", description: "Education & scholarships" },
  { id: "women", label: "Women", icon: "👩", description: "Women-specific benefits" },
  { id: "senior", label: "Senior Citizen", icon: "🧓", description: "Pension & elderly care" },
  { id: "business", label: "Entrepreneur", icon: "💼", description: "Business & MSME loans" },
  { id: "general", label: "General", icon: "🏠", description: "All available schemes" },
];

export type EligibilityStatus = "eligible" | "possibly_eligible" | "not_eligible";

export interface SchemeMatch {
  scheme: Scheme;
  status: EligibilityStatus;
  confidence: number;
  reason: string;
}

export interface UserProfile {
  age: number;
  gender: string;
  income: number;
  state: string;
  occupation: string;
  caste: string;
  persona: string;
}

export function matchSchemes(profile: UserProfile): SchemeMatch[] {
  return schemes.map((scheme) => {
    let score = 0;
    let maxScore = 0;
    let reasons: string[] = [];

    const e = scheme.eligibility;

    if (e.minAge !== undefined) {
      maxScore++;
      if (profile.age >= e.minAge) score++;
      else reasons.push(`Minimum age is ${e.minAge}`);
    }
    if (e.maxAge !== undefined) {
      maxScore++;
      if (profile.age <= e.maxAge) score++;
      else reasons.push(`Maximum age is ${e.maxAge}`);
    }
    if (e.maxIncome !== undefined) {
      maxScore++;
      if (profile.income <= e.maxIncome) score++;
      else reasons.push(`Income must be below ₹${(e.maxIncome / 100000).toFixed(1)}L`);
    }
    if (e.gender && e.gender !== "all") {
      maxScore++;
      if (profile.gender === e.gender) score++;
      else reasons.push(`Only for ${e.gender} applicants`);
    }
    if (e.occupation && e.occupation.length > 0) {
      maxScore++;
      if (e.occupation.includes(profile.occupation)) score++;
      else reasons.push(`For ${e.occupation.join("/")} only`);
    }
    if (e.caste && e.caste.length > 0) {
      maxScore++;
      if (e.caste.includes(profile.caste.toLowerCase())) score++;
      else reasons.push(`For ${e.caste.join("/")} category`);
    }

    const confidence = maxScore === 0 ? 80 : Math.round((score / maxScore) * 100);
    let status: EligibilityStatus;
    if (confidence >= 80) status = "eligible";
    else if (confidence >= 50) status = "possibly_eligible";
    else status = "not_eligible";

    return {
      scheme,
      status,
      confidence,
      reason: reasons.length > 0 ? reasons.join(". ") : "You meet all eligibility criteria",
    };
  }).sort((a, b) => b.confidence - a.confidence);
}

export const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry",
];
