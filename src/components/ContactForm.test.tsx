import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithLang } from "@/test/renderWithLang";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";
import { MESSAGE_MAX_LENGTH, MESSAGE_MIN_LENGTH } from "@/lib/constants";

const LONG_ENOUGH_MESSAGE = "a".repeat(MESSAGE_MIN_LENGTH);

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>, message = LONG_ENOUGH_MESSAGE) {
  await user.type(screen.getByLabelText("Name"), "Jane Doe");
  await user.type(screen.getByLabelText("Phone"), "7045551234");
  await user.type(screen.getByLabelText("Email"), "jane@example.com");
  if (message) {
    await user.type(screen.getByLabelText("Tell us what you need"), message);
  }
}

describe("ContactForm", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true }),
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("marks email as a required field", () => {
    renderWithLang(<ContactForm />);
    expect(screen.getByLabelText("Email")).toBeRequired();
  });

  it("shows a live character counter for the message field", async () => {
    const user = userEvent.setup();
    renderWithLang(<ContactForm />);

    expect(screen.getByText(`0 / ${MESSAGE_MAX_LENGTH}`)).toBeInTheDocument();

    await user.type(screen.getByLabelText("Tell us what you need"), "hello there");
    expect(screen.getByText(`11 / ${MESSAGE_MAX_LENGTH}`)).toBeInTheDocument();
  });

  it("blocks submission and shows an error when the message is under the minimum length", async () => {
    const user = userEvent.setup();
    renderWithLang(<ContactForm />);

    await fillRequiredFields(user, "too short");
    await user.click(screen.getByRole("button", { name: /send request/i }));

    expect(
      await screen.findByText(`Please tell us a bit more — at least ${MESSAGE_MIN_LENGTH} characters.`)
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("caps the message textarea at the max length so it can never exceed the limit", () => {
    renderWithLang(<ContactForm />);
    expect(screen.getByLabelText("Tell us what you need")).toHaveAttribute(
      "maxlength",
      String(MESSAGE_MAX_LENGTH)
    );
  });

  it("blocks submission and shows an error when email is missing", async () => {
    const user = userEvent.setup();
    renderWithLang(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Jane Doe");
    await user.type(screen.getByLabelText("Phone"), "7045551234");
    await user.type(screen.getByLabelText("Tell us what you need"), LONG_ENOUGH_MESSAGE);
    await user.click(screen.getByRole("button", { name: /send request/i }));

    expect(await screen.findByText("Email is required.")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("submits successfully once all requirements are met", async () => {
    const user = userEvent.setup();
    renderWithLang(<ContactForm />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /send request/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse(options.body as string);
    expect(body).toMatchObject({
      name: "Jane Doe",
      phone: "7045551234",
      email: "jane@example.com",
      message: LONG_ENOUGH_MESSAGE,
    });

    expect(await screen.findByText(/message sent/i)).toBeInTheDocument();
  });
});
