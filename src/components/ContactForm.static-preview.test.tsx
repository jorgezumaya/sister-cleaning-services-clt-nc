import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MESSAGE_MIN_LENGTH } from "@/lib/constants";

const LONG_ENOUGH_MESSAGE = "a".repeat(MESSAGE_MIN_LENGTH);

describe("ContactForm in static-export preview mode", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_STATIC_EXPORT", "true");
    vi.stubGlobal("fetch", vi.fn());
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("shows a call-to-call message instead of submitting, since /api/contact doesn't exist on the static export", async () => {
    const { default: ContactForm } = await import("./ContactForm");
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Jane Doe");
    await user.type(screen.getByLabelText("Phone"), "7045551234");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Tell us what you need"), LONG_ENOUGH_MESSAGE);
    await user.click(screen.getByRole("button", { name: /send request/i }));

    expect(await screen.findByText("This is a preview site")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
});
