# Agentic CSS Tutor for Pi

This is an experimental [Pi](https://pi.dev) teaching-mode extension for an **Agentic Introduction to Computational Social Science with Python**.

Run it directly from GitHub with:

```bash
pi -e https://github.com/arnim/agentic-css-tutor
```

It follows the technical pattern of `earendil-works/pi-tutorial`:

- a kickoff prompt starts a guided tutoring session,
- a hidden LLM-callable tool records learning milestones,
- progress is reconstructed from the Pi session history,
- the footer shows progress,
- slash commands expose course-map and focus controls,
- curriculum data is separated from extension/runtime code.

The curriculum map is adapted from the public GESIS course repository:

<https://github.com/gesiscss/css_methods_python>

Keep attribution to the original GESIS/Social ComQuant authors when redistributing derived material.

## Screenshot

<img src="./screenshot.png" alt="Agentic CSS Tutor" width="900" />

## Run

Install/run [Pi](https://pi.dev), then launch the tutor directly from GitHub:

```bash
pi -e https://github.com/arnim/agentic-css-tutor
```

For local development, from this directory:

```bash
pi -e ./src/index.ts
```

or:

```bash
./css-tutor
```

As a Pi package, this directory can also be loaded with `pi -e /path/to/agentic-css-tutor`.

## Files

```text
src/index.ts                         # Pi extension runtime: tools, UI, events, commands
src/curricula/types.ts               # curriculum data interfaces
src/curricula/css-methods-python.ts  # course map, sessions, milestones
src/prompts/css-tutor.ts             # prompt builders and formatting helpers
```

## Slash commands

- `/css-progress` — show completed and remaining tutor milestones.
- `/css-syllabus` — show the full adapted `css_methods_python` course map.
- `/css-syllabus A2` — show details for one source session.
- `/css-focus C3` — steer the tutor toward one source session.
- `/css-focus topic modeling` — steer the tutor toward a free-form topic.
- `/css-source` — show upstream course attribution/source.

## Teaching design

The extension uses eleven milestones:

1. orient to CSS teaching mode,
2. choose a learning goal or mini-project,
3. formulate a research question,
4. inspect or set up the Python/Jupyter workflow,
5. represent social data using Pandas/relational thinking,
6. explore data computationally and visually,
7. evaluate or collect digital/social data responsibly,
8. preprocess traces into network/text/feature representations,
9. apply and interpret a CSS analysis method,
10. interpret claims, validity, limitations, and ethics,
11. produce or improve a reproducible CSS artifact.

The tutor is intentionally project-based. It should guide the learner toward a small reproducible artifact rather than simply lecture through the syllabus.

## Content backbone

The adapted source sessions are:

- A1 Computing infrastructure
- A2 Data management and relational databases
- A3 Scientific computing and data visualization
- B1 API harvesting
- B2 Data parsing and static web scraping
- B3 Dynamic web scraping
- C1 Network construction and visualization
- C2 Multilayer and multimodal network construction
- C3 Natural Language Processing
- D1 Micro-level network analysis and community detection
- D2 Macro-level network analysis and network modeling
- D3 Unsupervised machine learning
- D4 Topic modeling
- D5 Supervised machine learning

## Notes

Pi extensions run with your local permissions. This tutor reminds the model to be careful before destructive operations, web scraping, external data collection, or anything that could affect privacy, platform terms, or local files.
