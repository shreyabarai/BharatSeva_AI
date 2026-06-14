import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useSpeechToText } from "../hooks/use-speech-to-text";

describe("useSpeechToText", () => {
  it("should initialize with isListening false", () => {
    const onResult = vi.fn();
    const { result } = renderHook(() => useSpeechToText(onResult));
    
    expect(result.current.isListening).toBe(false);
  });

  it("should handle speech recognition lifecycle", () => {
    const onResult = vi.fn();
    
    // Mock SpeechRecognition
    const MockRecognition = vi.fn().mockImplementation(() => ({
      start: vi.fn(),
      stop: vi.fn(),
      onresult: null,
      onerror: null,
      onend: null,
    }));

    (window as any).webkitSpeechRecognition = MockRecognition;

    const { result } = renderHook(() => useSpeechToText(onResult));
    
    act(() => {
      result.current.startListening();
    });

    expect(result.current.isListening).toBe(true);
    
    // Simulate speech result
    const recognitionInstance = MockRecognition.mock.results[0].value;
    act(() => {
      recognitionInstance.onresult({
        results: [[{ transcript: "25" }]]
      });
    });

    expect(onResult).toHaveBeenCalledWith("25");
    expect(result.current.isListening).toBe(false);
  });
});
