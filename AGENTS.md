# Agent Notes

## Tooling

- Prefer `pnpm` for JavaScript and TypeScript dependencies and scripts.
- In TypeScript, prefer inferred return types. Add explicit return types only when they clarify a public contract.

## Product Direction

- Auto DM is a mobile-first companion for a physical, dice-based dungeon adventure. It is not a video game.
- The core audience includes children and adults who may not know Dungeons & Dragons. Favor plain language, low arithmetic, and card-sized instructions.
- The physical-table experience is the product: the app creates and shares heroes, dungeons, encounters, and combat state.
- Do not add features or rules outside the approved plan without first updating `PLAN.md` and getting user approval.

## Delivery Workflow

- Never commit, push, or deploy directly from `main`.
- Every change starts from a branch named `agent/<short-description>`.
- Each completed numbered milestone in `PLAN.md` requires at least one focused commit. More commits are fine when they create useful review checkpoints.
- Push the branch and open a draft pull request targeting `main` when a milestone or agreed review batch is complete.
- The user reviews and merges pull requests. Do not merge a pull request unless explicitly asked.
- Before opening a pull request, run the relevant validation commands and record the result in the PR description.
- Preserve unrelated changes in a dirty worktree; stage only files that belong to the current milestone.

## Deployment Rules

- Never deploy or push production code directly from unreviewed local changes.
- Never let production get ahead of `main`.
- `prod` must be equal to or behind `main`; `main` may be ahead of `prod`.
- All changes to `main` must go through a GitHub pull request so the user can review before merge.
- Required flow: branch -> PR to `main` -> merge to `main` -> deploy/promote `main` to production.
- For production backend deploys, including Convex deploy commands, confirm the code is already merged to `main` before deploying. If it is not merged, stop and ask for explicit emergency authorization.
