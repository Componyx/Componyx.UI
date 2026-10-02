# Contributing to Componyx.UI and Bindary

Thanks for your interest in contributing. Componyx.UI and Bindary are maintained by a
single developer, so contributions of any kind, code or otherwise, genuinely help these
projects grow beyond what one person can do alone.

You don't need to write code to contribute. Reporting bugs, testing releases, improving
documentation, or helping other developers in Discussions is just as valuable as a pull
request.

## Ways to contribute

### Reporting bugs

Open an [Issue](https://github.com/Componyx/Componyx.UI/issues) and include:

- What you expected to happen, and what happened instead
- Steps to reproduce (a minimal repro, JSFiddle/CodePen/StackBlitz link, or small
  attached example is ideal)
- Browser and version, and whether you're using Componyx.UI, Bindary, or both
- Any relevant console errors

### Suggesting features or improvements

Open an Issue or start a [Discussion](https://github.com/Componyx/Componyx.UI/discussions) if it's more of an open-ended
idea than a concrete proposal. Explain the problem you're trying to solve, not just the
solution you have in mind, it helps to evaluate feature requests against the project's
goals (no build step, no dependency sprawl, standards-based).

### Improving documentation

Typos, unclear explanations, missing examples, all welcome as PRs directly against the
docs, or flagged as an Issue if you'd rather not write the fix yourself.

### Contributing code

**Before writing any non-trivial code, open an Issue describing what you'd like to do
and wait for a response before starting.** This avoids wasted effort on both sides,
a change that doesn't fit the project's direction (no build step, no dependency
sprawl, standards-based) is far cheaper to redirect before it's written than after.
Pull requests submitted without this prior discussion may be closed without review,
regardless of code quality.

Small, obvious fixes, a typo, a clearly correct one-line bug fix, don't need this, just
open the PR directly.

1. Fork the repository and create a branch for your change.
2. Keep pull requests focused: one fix or feature per PR is much easier to review than a
   bundle of unrelated changes.
3. Follow the existing code style (see below).
4. Open a pull request against `main`, describing what changed and why, and linking the
   Issue it was discussed in.

**All code contributions require signing the Contributor License Agreement (CLA)**
before a pull request can be merged. See [CLA.md](CLA.md) for details. A bot will
prompt you to sign on your first pull request, it takes under a minute.

## Code style

- No external runtime dependencies. Componyx.UI and Bindary work directly with the DOM
  and native JavaScript, contributions should keep that principle intact.
- Match the existing formatting and naming conventions in the file you're editing rather
  than introducing a new style.
- JSDoc comments on public methods and properties, following the conventions already
  used throughout the codebase.
- Keep changes minimal and targeted. Avoid unrelated refactors in the same PR as a bug
  fix or feature.

## What happens after you open a PR

- The CLA bot checks whether you've signed. If not, it'll comment with a link.
- The maintainer will review your PR, response times may vary depending on
  availability.
- You may be asked to make changes before merge. This is normal and not a reflection on
  the quality of the contribution, it's just part of keeping the codebase consistent.
- Once merged, you'll be credited in the release notes.

## Code of conduct

Be respectful and constructive. Disagreements about technical approach are fine and
expected, personal attacks, harassment, or bad-faith engagement are not, and may result
in the Issue, PR, or Discussion being closed and further contributions declined.

## Questions

If anything here is unclear, open a Discussion, that's exactly what it's for.