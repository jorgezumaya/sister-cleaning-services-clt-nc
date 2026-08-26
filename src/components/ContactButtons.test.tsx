import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithLang } from "@/test/renderWithLang";
import ContactButtons from "./ContactButtons";
import { BUSINESS_PHONE_TEL, BUSINESS_PHONE_SMS, BUSINESS_WHATSAPP } from "@/lib/constants";

describe("ContactButtons", () => {
  it("links each action to the right native protocol so devices resolve the right app", () => {
    renderWithLang(<ContactButtons />);

    expect(screen.getByRole("link", { name: /call/i })).toHaveAttribute("href", BUSINESS_PHONE_TEL);
    expect(screen.getByRole("link", { name: /text/i })).toHaveAttribute("href", BUSINESS_PHONE_SMS);
    expect(screen.getByRole("link", { name: /whatsapp/i })).toHaveAttribute("href", BUSINESS_WHATSAPP);
    expect(screen.queryByRole("link", { name: /email/i })).not.toBeInTheDocument();
  });
});
