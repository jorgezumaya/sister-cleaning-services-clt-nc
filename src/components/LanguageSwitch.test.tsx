import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithLang } from "@/test/renderWithLang";
import LanguageSwitch from "./LanguageSwitch";
import ContactForm from "./ContactForm";

describe("LanguageSwitch", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("defaults to English", () => {
    renderWithLang(<LanguageSwitch />);
    expect(screen.getByRole("button", { name: /switch to english/i })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("switches visible UI text to Spanish and persists the choice to localStorage", async () => {
    const user = userEvent.setup();
    renderWithLang(
      <>
        <LanguageSwitch />
        <ContactForm />
      </>
    );

    expect(screen.getByLabelText("Name")).toBeInTheDocument();

    const spanishButton = screen.getByRole("button", { name: /switch to spanish/i });
    await user.click(spanishButton);

    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    // The button's own aria-label is translated too once active, so re-check
    // pressed state on the same element reference rather than re-querying by name.
    expect(spanishButton).toHaveAttribute("aria-pressed", "true");
    expect(window.localStorage.getItem("sisters-cleaning-lang")).toBe("es");
  });
});
