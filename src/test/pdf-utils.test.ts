import { describe, it, expect, vi } from "vitest";
import { generateSchemePDF, shareOnWhatsApp } from "../lib/pdf-utils";
import { schemes } from "../data/schemes";

// Mocking URL.createObjectURL since it's a browser API
if (typeof window !== "undefined") {
  window.URL.createObjectURL = vi.fn();
}

describe("pdf-utils", () => {
  it("should generate a PDF blob for a scheme", () => {
    const scheme = schemes[0];
    const blob = generateSchemePDF(scheme);
    
    expect(blob).toBeDefined();
    expect(blob instanceof Blob).toBe(true);
    // PDF magic number is %PDF
    expect(blob.type).toBe("application/pdf");
  });

  it("should open WhatsApp with scheme information", () => {
    const scheme = schemes[0];
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    
    shareOnWhatsApp(scheme);
    
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining("wa.me/?text="),
      "_blank"
    );
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent(scheme.name)),
      "_blank"
    );
  });
});
