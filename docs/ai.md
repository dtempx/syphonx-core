## Why not just use AI?

AI-based extraction is powerful, but it has real tradeoffs for structured data collection at scale:

- **Cost** — LLM calls are expensive. Running thousands of extractions quickly adds up.
- **Speed** — AI inference is slow compared to a selector-based engine.
- **Reliability** — AI output is probabilistic. You may get slightly different results between runs, which can be a real problem if you need results that are highly deterministic.

SyphonX gives you deterministic, fast, cheap extraction — and you can always layer AI on top for the cases where selectors alone aren't enough.
