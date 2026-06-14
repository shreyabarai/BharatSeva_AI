import { UserProfile } from "@/contexts/ProfileContext";
import { Scheme } from "@/data/schemes";

export interface FormField {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "date" | "checkbox";
  required: boolean;
  options?: string[];
  placeholder?: string;
  value?: string | number | boolean;
}

export interface AutofillResult {
  value: string | number | boolean;
  confidence: number;
  sourceField: string;
}

// Semantic Mapping Rules
const SEMANTIC_MAPPINGS: Record<string, string[]> = {
  fullName: ["applicant name", "full name", "name", "beneficiary name", "user name", "naam", "नाम"],
  age: ["age", "applicant age", "current age", "umr", "आयु"],
  dob: ["date of birth", "dob", "birth date", "janm tithi", "जन्म तिथि"],
  gender: ["gender", "sex", "ling", "लिंग"],
  mobile: ["mobile number", "phone", "contact number", "mobile", "फोन नंबर"],
  email: ["email", "email address", "id", "ईमेल"],
  state: ["state", "residence state", "domicile state", "rajya", "राज्य"],
  district: ["district", "zila", "district name", "जिला"],
  pin: ["pincode", "pin", "postal code", "pin code", "पिन कोड"],
  aadhaar: ["aadhaar", "aadhar", "aadhaar number", "unique id", "आधार"],
  incomeRange: ["annual income", "family income", "household income", "income", "आय"],
  casteCategory: ["category", "caste", "social category", "varg", "वर्ग"],
  occupation: ["occupation", "profession", "work", "vyavasay", "व्यवसाय"],
  disabilityStatus: ["disability", "physically challenged", "divyang", "विकलांग"],
};

export const getSmartAutofill = (fieldLabel: string, profile: UserProfile | null): AutofillResult | null => {
  if (!profile) return null;

  const normalizedLabel = fieldLabel.toLowerCase().trim();

  // Find the matching profile field based on semantic mappings
  for (const [profileField, variations] of Object.entries(SEMANTIC_MAPPINGS)) {
    if (variations.some(v => normalizedLabel.includes(v) || v.includes(normalizedLabel))) {
      let value: string | number | boolean | undefined;

      // Extract value from profile (handling nested address)
      if (profileField === "state") value = profile.address.state;
      else if (profileField === "district") value = profile.address.district;
      else if (profileField === "pin") value = profile.address.pin;
      else value = (profile as any)[profileField];

      if (value !== undefined && value !== "") {
        return {
          value,
          confidence: 0.95,
          sourceField: profileField
        };
      }
    }
  }

  return null;
};

export const checkEligibility = (scheme: Scheme, profile: UserProfile | null): { 
  isEligible: boolean; 
  reasons: string[]; 
  missingFields: string[] 
} => {
  const reasons: string[] = [];
  const missingFields: string[] = [];
  if (!profile) return { isEligible: false, reasons: ["No profile found"], missingFields: [] };

  const e = scheme.eligibility;

  if (e.minAge && profile.age < e.minAge) reasons.push(`Minimum age: ${e.minAge}`);
  if (e.maxAge && profile.age > e.maxAge) reasons.push(`Maximum age: ${e.maxAge}`);
  if (e.maxIncome && profile.incomeRange > e.maxIncome) reasons.push(`Income must be below ₹${e.maxIncome}`);
  if (e.gender && e.gender !== "all" && profile.gender.toLowerCase() !== e.gender.toLowerCase()) {
    reasons.push(`Only for ${e.gender} applicants`);
  }
  
  // Check for required fields that are empty in profile
  if (!profile.fullName) missingFields.push("Full Name");
  if (!profile.mobile) missingFields.push("Mobile Number");
  if (!profile.aadhaar && scheme.documents.includes("Aadhaar Card")) missingFields.push("Aadhaar Number");

  return {
    isEligible: reasons.length === 0,
    reasons,
    missingFields
  };
};
