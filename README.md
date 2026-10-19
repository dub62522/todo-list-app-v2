# Todo Performance Demo

This project is a lightweight todo app designed to showcase practical frontend performance improvements.

## Why this matters

A todo list feels simple, but it can get slow quickly when large lists are re-rendered on every interaction. This app intentionally keeps the structure small while demonstrating patterns that scale better in real products.

## Highest-impact, lowest-effort improvement

The implemented improvement is batching DOM writes through a single `DocumentFragment` render pass instead of repeatedly mutating the live list. It reduces layout thrashing and keeps updates predictable under heavier task volumes.

## Ten performance improvements to consider

1. Batch DOM writes with `DocumentFragment` to avoid repeated reflow during list updates.
2. Debounce persistence to `localStorage` so bursts of edits do not trigger unnecessary writes.
3. Re-render from a filtered snapshot rather than recomputing all DOM nodes for every state change.
4. Use event delegation for list actions instead of attaching listeners to each item individually.
5. Keep tasks in a normalized state and update only the changed record rather than rebuilding unrelated entries.
6. Prefer CSS classes for state changes instead of expensive inline style churn.
7. Use `requestAnimationFrame` when multiple UI updates happen in the same tick.
8. Avoid repeated `querySelectorAll` calls in hot paths; cache the elements you use frequently.
9. Add virtualization or pagination for very large lists to limit rendered nodes.
10. Cache expensive derived values such as filtered counts and completed totals.

## Run locally

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in a browser.
