# Avastar UI 3.1 — Design contracts

## Foundations

Consume semantic tokens (`primary`, `foreground`, `input`, status roles), not fixed brand values, inside reusable components. Test both themes. Keep Persian letter spacing at zero, use the provided Peyda weight files, and use CSS logical properties for RTL/LTR. Mirror directional arrows, not logos, numbers or illustrations.

## Component delivery

Each component needs a use case, anatomy, API, live example, applicable interaction states, keyboard behavior and an accessibility note. Define default, hover, focus, pressed, disabled, pending, error and success as appropriate. Use one primary action per group. Buttons perform actions; links navigate.

Forms need persistent labels, input-linked help/errors, preserved values after failure, and focus on the linked error summary or first invalid field after submission. Do not communicate status through color alone. Loading controls prevent duplicate submission and expose `aria-busy`.

Dialogs need an accessible title, initial focus, contained Tab navigation, Escape and focus restoration. Use inline alerts for important persistent failures, and live status messages for brief confirmations. Tables need semantic headers, accessible row action names, and sorting state.

## Product targets

- Normal text contrast: 4.5:1; large text: 3:1.
- Essential control boundaries and focus indicators: 3:1 against adjacent colors.
- Avastar interactive target: 44×44 CSS px. WCAG 2.2 AA defines a 24×24 minimum with exceptions; our internal target is larger.
- Reflow at 320 CSS px, and text resizing at 200%, without lost content. Two-dimensional data tables may scroll within their own container.
- Respect `prefers-reduced-motion`; allow decorative motion to pause.
- Test both locales, both themes, narrow layouts, keyboard navigation and actual content.

`check-design-tokens.mjs` checks the published token pairs and target-size constants. Passing it is not a full WCAG audit. Screen-reader and workflow checks remain a responsibility of each consuming product.

## Content and maintenance

Name the actual action ("Save changes", not "Confirm"). Explain how to fix errors ("Enter a valid email, such as sky@example.com", not "Something went wrong"). Keep terminology consistent across languages.

Breaking API or token removal requires a major version and migration notes. Additive features use a minor version; fixes use a patch version. Update token source and regenerate CSS together. Review the consuming product before adoption.

## References

- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WAI ARIA APG: https://www.w3.org/WAI/ARIA/apg/

## 3.1 layout and state contracts

The documentation and panels use the full available workspace width. Limit paragraph measure with `--layout-reading-width`, not the application shell. Narrow panels retain local horizontal scrolling only for intrinsically two-dimensional content.

Filtering and archiving do not clear a table search. Course completion does not reset progress. If an overlay opener disappears, restore focus to an available peer action or the main landmark. Only an explicitly labelled reset action resets demo state.

Use `UiLocaleProvider` in consuming products so shared dismiss controls and helper labels match the page locale. Date selection currently uses the Gregorian calendar with localized labels and digits.

The source manifest lists 47 implemented components and patterns. Each catalog entry links directly to its reference and live examples; source downloads are generated from those same modules.
