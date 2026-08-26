import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST, validateContactPayload } from "./route";
import { MESSAGE_MIN_LENGTH, MESSAGE_MAX_LENGTH } from "@/lib/constants";

const LONG_ENOUGH_MESSAGE = "a".repeat(MESSAGE_MIN_LENGTH);

const validPayload = {
  name: "Jane Doe",
  phone: "7045551234",
  email: "jane@example.com",
  serviceType: "Residential Cleaning",
  frequency: "Weekly",
  address: "Marshville, NC",
  message: LONG_ENOUGH_MESSAGE,
  company: "",
};

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("validateContactPayload", () => {
  it("requires a name", () => {
    expect(validateContactPayload({ ...validPayload, name: "  " })).toBe("Name is required.");
  });

  it("requires a phone number", () => {
    expect(validateContactPayload({ ...validPayload, phone: "" })).toBe("Phone is required.");
  });

  it("requires an email", () => {
    expect(validateContactPayload({ ...validPayload, email: "" })).toBe("Email is required.");
  });

  it("rejects a message under the minimum length", () => {
    expect(validateContactPayload({ ...validPayload, message: "short" })).toBe(
      `Please tell us a bit more — at least ${MESSAGE_MIN_LENGTH} characters.`
    );
  });

  it("rejects a message over the maximum length", () => {
    expect(
      validateContactPayload({ ...validPayload, message: "a".repeat(MESSAGE_MAX_LENGTH + 1) })
    ).toBe(`Please keep your message under ${MESSAGE_MAX_LENGTH} characters.`);
  });

  it("accepts a fully valid payload", () => {
    expect(validateContactPayload(validPayload)).toBeNull();
  });
});

describe("POST /api/contact", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.RESEND_API_KEY = "test-key";
    process.env.CONTACT_TO_EMAIL = "info@sisterscleaningservicenc.com";
    process.env.CONTACT_FROM_EMAIL = "quotes@sisterscleaningservicenc.com";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, text: async () => "" })
    );
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await POST(makeRequest({ ...validPayload, email: "" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Email is required.");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns 400 when the message is too short", async () => {
    const res = await POST(makeRequest({ ...validPayload, message: "hi" }));
    expect(res.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("silently succeeds without sending mail when the honeypot is filled", async () => {
    const res = await POST(makeRequest({ ...validPayload, company: "I am a bot" }));
    expect(res.status).toBe(200);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns 500 when email delivery isn't configured", async () => {
    delete process.env.RESEND_API_KEY;
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(500);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("sends the email via Resend for a valid payload", async () => {
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(1);

    const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    const sentBody = JSON.parse(options.body as string);
    expect(sentBody.to).toBe("info@sisterscleaningservicenc.com");
    expect(sentBody.reply_to).toBe("jane@example.com");
    expect(sentBody.html).toContain("Jane Doe");
  });

  it("returns 502 when Resend rejects the request", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 422, text: async () => "bad request" })
    );
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(502);
  });
});
