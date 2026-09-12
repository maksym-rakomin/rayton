# Rayton V2 executor prompt

## Part A — standing preamble

You are the fresh executor for epic `RAYTON-V2`. Read `docs/RAYTON_V2_CHARTER.md` in full at the start of every session. Treat its locked decisions and repository guardrails as hard requirements.

Do exactly one gate and then STOP. Never upload, activate, or change production WordPress. Never submit a public form. Preserve pre-existing user changes and never `git push`. Do not commit until the supervising planner reports user approval; any approved commit must start with `RAYTON-V2:` because no Jira key was provided.

If reality conflicts with a locked decision, STOP and ask before implementing. Do not implement a deviation and disclose it afterward. There is no external tracker; identify the active gate in your report instead of claiming an unavailable ticket.

Use TDD for implementation gates: add or identify a failing check first, make the smallest coherent implementation, then run the relevant full regression set. Do not narrow requirements silently.

At the end of every gate provide this six-part Stage Report:

1. Schema/interface diff; for Gate 0, list the spec and plan documents produced and the proposed gate breakdown.
2. Acceptance mapping: every charter AC mapped to the planned/implemented gate and concrete `file:symbol` anchors.
3. Test result: exact command and pass/fail counts; for Gate 0 state `n/a`.
4. Explicit not-done/simplified/open list.
5. Manual verification mini-report: exact action and expected observable result for every AC covered by the gate; for Gate 0 explain how to sanity-read the spec/plan against all ACs.
6. Next-gate mini-brief in 3-5 lines so another executor can resume cold.

## Part B0 — Design Gate (Gate 0)

Perform a design-only pass. Do not write production code.

1. Inspect the full repository surface relevant to the theme, not only the README: all top-level HTML pages, the `articles/` pattern, shared header, CSS load order, scripts, tests, and build tools.
2. Quantify repeated markup and identify a safe mechanical conversion strategy that preserves the existing dirty files.
3. Design a standalone classic WordPress theme architecture named `rayton-v2` with explicit templates, template parts, helpers, enqueue rules, asset URL conversion, internal-link conversion, WordPress/Polylang/Yoast compatibility, and locale fallback behavior.
4. Design dynamic blog and project behavior. Do not accept a hardcoded `article.html` or query-string `project.html?id=...` as the final WordPress solution.
5. Design the Caldera integration for UK/EN/RU using the observed IDs, including plugin-missing fallback, server-confirmed success/error behavior, Turnstile compatibility, and CSS ownership. Do not submit a form.
6. Decide how WordPress comments are handled or explicitly omitted, with rationale.
7. Design a reproducible ZIP build containing one top-level `rayton-v2/` directory and excluding `.fig`, `_design`, repository metadata, tests, and editor files. Build an evidence-based reachable-asset manifest from final templates, CSS, and JavaScript; do not copy the full legacy `assets/` tree or delete legacy assets from the source repository.
8. Design automated validation for every acceptance criterion, including detection of `.html` production links, relative asset URLs in PHP templates, missing referenced assets, and unused packaged SVG/image files.
9. Call out any page/content mismatch that cannot be solved without production exports or a user decision. Prefer safe WordPress-content fallback over invented production data.

Write:

- `docs/RAYTON_V2_SPEC.md` — detailed architecture and behavior specification.
- `docs/RAYTON_V2_PLAN.md` — per-gate implementation plan, with files/symbols, failing-test-first sequence, exact test commands, acceptance mapping, and manual checks.

Then STOP and provide the six-part Stage Report. Do not create the theme directory in Gate 0.

## Parts B1-B5 — implementation gate stubs

These blocks will be filled from the approved Gate 0 plan immediately before each gate is dispatched. Do not execute them yet.
