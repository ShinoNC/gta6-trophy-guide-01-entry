# Vice Platinum — GTA VI Trophy Guide & Tracker

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/ShinoNC/gta6-trophy-guide-01-entry/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/ShinoNC/gta6-trophy-guide-01-entry/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies of Grand Theft Auto VI**, built for the [gta6-trophy-guide-01 bounty on make.fun](https://make.fun/bounty/gta6-trophy-guide-01).

## What it is

- **Tracker**: checklist of all 55 trophies with official names, descriptions and grades, saved in localStorage, with export to file and import back.
- **Cited guides**: every guide step carries a numbered source — [1] Exophase, [2] PSNProfiles, [3] KeenGamer, [4] OutputLag. The cover shows a live audit strip computed from the data: claims cited, trophies backed by 2+ sources, sources, disputes shown.
- **Roadmap to the platinum**: 3 stages (~200 hours, difficulty 4/10, 1 playthrough, 0 online trophies), save strategy, and the full 100% checklist for A Long Road.
- **Missables**: the one possibly-missable trophy (Positive Mental Attitude) is hedged as POSSIBLY MISSABLE, with KeenGamer and OutputLag agreeing the Chapter 1 balcony meditation disappears after Chapter 1.
- **Honest gaps**: 4 trophies (Bad Luck, I Guess; The Truth Is Out There; In The Beginning…; Capital Offense) have no confirmed method as of 19/11/2026 — the guide says so plainly instead of inventing steps.
- **Filters**: search, kind and grade filters with counts, hide-earned toggle, spoiler-safe mode (story names hidden as ??? until earned), per-trophy count steppers, notes, Next-up planner, keyboard shortcuts.

## Run it

Serve `app/` with any static server and open `app/index.html` — it works with the network off. No build step, no dependencies.

```sh
python3 -m http.server 8080 --directory app
```

## Hand it in

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```
