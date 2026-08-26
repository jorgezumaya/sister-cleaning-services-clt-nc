import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { LanguageProvider } from "@/lib/i18n";

/** Renders a component wrapped in LanguageProvider, defaulting to English. */
export function renderWithLang(ui: ReactElement, options?: RenderOptions) {
  return render(<LanguageProvider>{ui}</LanguageProvider>, options);
}
