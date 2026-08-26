import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MESSAGE_MIN_LENGTH, MESSAGE_MAX_LENGTH } from "@/lib/constants";

const saveContactSubmission = vi.fn();
vi.mock("@/lib/firestore", () => ({
  saveContactSubmission: (...args: unknown[]) => saveContactSubmission(...args),
}));

const { POST, validateContactPayload } = await import("./route");

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
  // Well in the past, so the anti-bot timing check passes.
  renderedAt: String(Date.now() - 10_000),
};

function makeRequest(body: unknown, headers?: Record<string, string>) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });
}

describe("validateContactPayload", () => {
  it("requires a name", () => {
    expect(validateContactPayload({ ...validPayload, name: "  " })).toBe("Name is required.");
  });

  it("requires a phone number", () => {
    expect(validateContactPayload({ ...validPayload, phone: "" })).toBe("Phone is required.");
  });

  it("rejects a phone number containing letters", () => {
    expect(validateContactPayload({ ...validPayload, phone: "83u2084u30u45023u4590328-9" })).toBe(
      "Please enter a valid phone number."
    );
  });

  it("rejects a phone number with too few digits", () => {
    expect(validateContactPayload({ ...validPayload, phone: "12-345" })).toBe(
      "Please enter a valid phone number."
    );
  });

  it("rejects a phone number that's all separators, no real digits", () => {
    expect(validateContactPayload({ ...validPayload, phone: "----------" })).toBe(
      "Please enter a valid phone number."
    );
  });

  it("accepts common real-world phone formats", () => {
    for (const phone of ["7045551234", "(704) 555-1234", "+1 704-555-1234", "704.555.1234"]) {
      expect(validateContactPayload({ ...validPayload, phone })).toBeNull();
    }
  });

  it("requires an email", () => {
    expect(validateContactPayload({ ...validPayload, email: "" })).toBe("Email is required.");
  });

  it("rejects a malformed email", () => {
    expect(validateContactPayload({ ...validPayload, email: "not-an-email" })).toBe(
      "Please enter a valid email address."
    );
  });

  it("truncates rather than rejects a name over the max length", () => {
    expect(validateContactPayload({ ...validPayload, name: "a".repeat(101) })).toBeNull();
  });

  it("rejects a serviceType outside the known list", () => {
    expect(validateContactPayload({ ...validPayload, serviceType: "Free Cleaning Forever" })).toBe(
      "Invalid service type."
    );
  });

  it("rejects a frequency outside the known list", () => {
    expect(validateContactPayload({ ...validPayload, frequency: "Every Hour" })).toBe(
      "Invalid frequency."
    );
  });

  it("accepts an empty serviceType/frequency (dropdown left unselected)", () => {
    expect(validateContactPayload({ ...validPayload, serviceType: "", frequency: "" })).toBeNull();
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
    delete process.env.CONTACT_CC_EMAIL;
    saveContactSubmission.mockClear();
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

  it("silently succeeds without sending mail when submitted too fast", async () => {
    const res = await POST(makeRequest({ ...validPayload, renderedAt: String(Date.now()) }));
    expect(res.status).toBe(200);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("silently succeeds without sending mail when renderedAt is missing", async () => {
    const { name, phone, email, serviceType, frequency, address, message, company } = validPayload;
    const res = await POST(
      makeRequest({ name, phone, email, serviceType, frequency, address, message, company })
    );
    expect(res.status).toBe(200);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("strips control characters and truncates the name before sending", async () => {
    const res = await POST(
      makeRequest({ ...validPayload, name: `Jane\r\nBcc: evil@example.com ${"x".repeat(120)}` })
    );
    expect(res.status).toBe(200);
    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const sentBody = JSON.parse(options.body as string);
    expect(sentBody.subject).not.toMatch(/[\r\n]/);
    expect(sentBody.subject.length).toBeLessThan(140);
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

  it("includes the CF-Connecting-IP header in the email and the saved submission", async () => {
    const res = await POST(
      makeRequest(validPayload, { "cf-connecting-ip": "203.0.113.42" })
    );
    expect(res.status).toBe(200);

    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const sentBody = JSON.parse(options.body as string);
    expect(sentBody.html).toContain("203.0.113.42");

    expect(saveContactSubmission).toHaveBeenCalledWith(
      expect.objectContaining({ ip: "203.0.113.42", name: "Jane Doe" })
    );
  });

  it("falls back to X-Forwarded-For, then \"unknown\", when CF-Connecting-IP is absent", async () => {
    await POST(makeRequest(validPayload, { "x-forwarded-for": "198.51.100.7, 10.0.0.1" }));
    expect(saveContactSubmission).toHaveBeenCalledWith(expect.objectContaining({ ip: "198.51.100.7" }));

    saveContactSubmission.mockClear();
    await POST(makeRequest(validPayload));
    expect(saveContactSubmission).toHaveBeenCalledWith(expect.objectContaining({ ip: "unknown" }));
  });

  it("does not block sending the email when saving to Firestore fails", async () => {
    saveContactSubmission.mockRejectedValueOnce(new Error("firestore is down"));
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("CCs an additional recipient only when CONTACT_CC_EMAIL is set", async () => {
    await POST(makeRequest(validPayload));
    let [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(JSON.parse(options.body as string).cc).toBeUndefined();

    process.env.CONTACT_CC_EMAIL = "ana@sisterscleaningservicenc.com";
    await POST(makeRequest(validPayload));
    [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[1];
    expect(JSON.parse(options.body as string).cc).toBe("ana@sisterscleaningservicenc.com");
  });
});
