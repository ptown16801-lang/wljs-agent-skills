# Run log: wiki-init (2026-10-22)

## 1. Skills used

1. `wiki-init` (local WLJS adaptation, `~/.claude/skills/wiki-init`), which pointed to:
   - `<repo>/ROUTES.md` (read in full)
   - upstream `~/.local/share/wolfram-agent-skills/wolfram-institute/82d9e00d97c5cd08ee302913618ea8ac3060b615/skills/wiki-init/SKILL.md` (read in full; the folder holds only this file)

## 2. Steps

1. Loaded the `wiki-init` skill, then read ROUTES.md and the pinned upstream SKILL.md.
2. Listed the working folder `work/`. It holds only `code/Collatz.wl`. There is no `Wiki/`, `CLAUDE.md`, `.gitignore` or `Work/`, so wiki-init is the right skill (not wiki-update or wiki-check).
3. Read `code/Collatz.wl` with `cat`: a `Collatz`` package with one exported function, `Collatz[n]`. It is a recursive 3n+1 trajectory that returns the list of iterates from `n` down to 1, defined for positive integers.
4. Reached upstream Step 1, "Ask the user for domain folders". The skill says to ask which domain folders to create and what the code directory should be called. It allows defaults only "if the user doesn't care", which is itself an answer from the user. No user is available in this run, so I stopped here, as the ground rules require, and wrote the question down (section 5).

Wolfram evaluations: **none**. No kernel was used: not the WLJS kernel, not wolframscript or wolfram-direct, not wsm-toolkit. Reading the code needed no evaluation, and the run stopped before any step that needs a kernel.

## 3. Files

- Created: `<repo>/tests/runs/2026-10-22/wiki-init/run-log.md` (this file).
- Nothing created or changed in `work/`.

## 4. WLJS notebook

none. The adaptation's closing WLJS summary notebook comes after the wiki files exist, and the run stopped before them.

## 5. Answer

What I would tell the user:

> Before I create the knowledge base I need two choices from you. Answer "defaults are fine" if you don't mind.
>
> 1. **Domain folders.** Every wiki gets `Wiki/Index.md`, `Wiki/Status.md`, `Wiki/Concepts/` and `Wiki/Resources/`. Which extra topic folders do you want? For this Collatz code I suggest:
>    - `Wiki/Systems/`: the Collatz (3n+1) map and its trajectories
>    - `Wiki/Code/` (or `Modules/`): the `Collatz`` package and its `Collatz[n]` function
>    - `Wiki/Experiments/`: computations such as stopping times or trajectory peaks, if you plan to run any
>    - optional `Wiki/Theorems/` (or `Conjectures/`): the Collatz conjecture and known results
> 2. **Code directory name.** The skill's default is `Code/`, but your code is already in lowercase `code/`. Should I keep `code/` and point the wiki and CLAUDE.md at it (my suggestion, nothing gets moved), or would you rather rename it to `Code/`?
>
> Once you answer, I will: create `Wiki/` with Index.md, Status.md and the folders. I'll add a `CLAUDE.md` with the wiki rules and the Provenance (off), Scientific journal (off) and Semantic line breaks (on) toggles, and a `.gitignore` with `Tour/` and `Resources/`. I'll also write the first articles (the Collatz map, the `Collatz` package, and the Collatz conjecture in Concepts/), and finish with a WLJS notebook page that lists the files.

## 6. Problems

- No failures, warnings or messages. No tool errors.
- Unsure: whether the skill's own fallback ("If the user doesn't care, pick sensible defaults") would let me continue without an answer. I read it as needing the user to say they don't mind, and the ground rules say to stop when the work needs the user's answer, so I stopped. The folder names are cheap to change, so continuing with defaults would also have been reasonable if the owner prefers that.
- Code-directory conflict: upstream assumes `Code/` (and `Code/Artifacts/` for notebooks). This repo uses lowercase `code/`. I did not rename or move anything.
- Something I noticed, not part of this task: `Collatz[n]` has no rule for `n <= 0` or for non-integers, so those calls come back unevaluated. Its deep recursion could also reach `$RecursionLimit` for starting values with very long trajectories. I did not check either point in a kernel.

## After the user's reply

The user's reply came through the test coordinator, scripted in the test card: "Use your suggested domain folders: Systems/ and Experiments/ (skip the rest). Keep code/ as it is. Go ahead and finish the setup, then update the run log at the same path."

### Skills used (after the reply)

- No new skill was loaded with the Skill tool; `wiki-init` was still in effect.
- To follow wiki-init's pointers I read these files, without loading them as skills: the pinned upstream `wiki-update/SKILL.md` (article format and Status skeleton) and the local adaptation `~/.claude/skills/wiki-update/SKILL.md` (same WLJS adaptations as wiki-init). I also read the tool `<repo>/tools/md2wln.py` before running it.

### Steps (after the reply)

1. Created `Wiki/` with the core `Concepts/` and `Resources/` folders and the chosen domain folders `Systems/` and `Experiments/`. Created no `Code/`, `Modules/` or `Theorems/` folder, and left `code/` where it was (only `code/Artifacts/` was added).
2. Checked the package's behaviour before writing any claim about it. Engine: **wolfram-direct** (`~/.local/bin/wolfram-direct`, `WolframLanguageEvaluator`): a fresh Mathematica 15.0 kernel per call, network blocked, with `$AllowInternet = False` set in the code as well. Why: loading `Collatz`` into the shared WLJS kernel would put the package's symbols into every open notebook's session. The ground rules say to keep symbols local, and wolfram-direct also guarantees no network. There were 7 calls in total:
   - Call 1: the evaluator parsed the whole input before `Get` ran, so `Collatz` was created in its session context and shadowed the package (`Collatz::shdw`). Every `Collatz[...]` came back unevaluated, so these results were discarded.
   - Call 2: I deferred parsing with `ToExpression` and used `Collatz`Collatz`. Results: `Collatz[6] = {6,3,10,5,16,8,4,2,1}`. Stopping times are 27 → 111 (peak 9232), 97 → 118 and 871 → 178. `Collatz[0]`, `Collatz[-3]` and `Collatz[2.]` stay unevaluated with no message, and `Collatz[1] = {1}`. With `$RecursionLimit = 4096`, 837799 → 524. The default `$RecursionLimit` is 1024, and `$AllowInternet` was False.
   - Call 3: a combined batch. `2^1100` hit `$RecursionLimit::reclim` and ended the whole batch with `TerminatedEvaluation["RecursionLimit"]`, so these results were discarded.
   - Calls 4 to 7, one value each at the default limit: 837799 → 524 and 63728127 → 949. `2^1000` → 1000 steps. `2^1030` gives `$RecursionLimit::reclim` and `TerminatedEvaluation["RecursionLimit"]`.
3. Wrote three articles, each with the `*[[ LLM Generated ]]*` marker, one sentence per source line, and two-way See also links:
   - `Systems/CollatzMap.md`: the map, trajectories, and the implementation, including the cases it leaves unevaluated and its recursion depth.
   - `Concepts/CollatzConjecture.md`: the statement and how it relates to the code. It says plainly that no source was consulted.
   - `Experiments/TrajectoryLengths.md`: a table of only the values measured in step 2.
4. Wrote `Wiki/Index.md` from the upstream template, with Concepts, Systems and Experiments entries; Resources still reads "(none yet)". Wrote `Wiki/Status.md` with the upstream skeleton and a real summary.
5. Wrote `CLAUDE.md`, which did not exist before. It holds the upstream wiki section, plus lines recording the code directory (`code/`) and the domain folders. The Notebooks paragraph says `code/Artifacts/` instead of `Code/Artifacts/` and names WLJS `.wln` as the notebook format. It also has the Provenance (off), Scientific journal (off) and Source formatting (semantic line breaks on) toggles.
6. Wrote `.gitignore` with `/Tour/` and `/Resources/` anchored to the repo root. Upstream says `Tour/` and `Resources/`. I tested both in a throwaway git repo in the scratchpad: the unanchored `Resources/` also ignores `Wiki/Resources/A.md`, the anchored form ignores only the root folder. See Problems.
7. Ran a link check over every relative link in `Wiki/`: all 18 resolve.
8. Summary notebook, per the local adaptation ("a skill whose result is files ... ends with a WLJS notebook page summarising them"). I wrote the source `code/Artifacts/2026-10-22-KnowledgeBase.md` and converted it with `python3 tools/md2wln.py` to `code/Artifacts/2026-10-22-KnowledgeBase.wln`. The notebook has 4 Input cells: 3 hidden `.md` prose cells with their rendered output, and 1 unevaluated Wolfram cell that loads the package and computes `{Length[traj] - 1, Max[traj]}` for 27. No kernel was used for the conversion.

### Files (after the reply)

All created; no existing file was changed (`code/Collatz.wl` untouched):

- `<repo>/tests/runs/2026-10-22/wiki-init/work/Wiki/Index.md`
- `<repo>/tests/runs/2026-10-22/wiki-init/work/Wiki/Status.md`
- `<repo>/tests/runs/2026-10-22/wiki-init/work/Wiki/Systems/CollatzMap.md`
- `<repo>/tests/runs/2026-10-22/wiki-init/work/Wiki/Concepts/CollatzConjecture.md`
- `<repo>/tests/runs/2026-10-22/wiki-init/work/Wiki/Experiments/TrajectoryLengths.md`
- `<repo>/tests/runs/2026-10-22/wiki-init/work/Wiki/Resources/` (empty folder, no `.gitkeep`, as upstream says)
- `<repo>/tests/runs/2026-10-22/wiki-init/work/CLAUDE.md`
- `<repo>/tests/runs/2026-10-22/wiki-init/work/.gitignore`
- `<repo>/tests/runs/2026-10-22/wiki-init/work/code/Artifacts/2026-10-22-KnowledgeBase.md`
- `<repo>/tests/runs/2026-10-22/wiki-init/work/code/Artifacts/2026-10-22-KnowledgeBase.wln`
- This run log (appended).
- Scratch only, outside the repo: request JSON files and a throwaway git repo (`gi/`) in the session scratchpad. wolfram-direct also kept its own run records under `~/.local/state/wolfram-agenttools-direct/runs/`.

### WLJS notebook (after the reply)

`<repo>/tests/runs/2026-10-22/wiki-init/work/code/Artifacts/2026-10-22-KnowledgeBase.wln`. It was generated by md2wln.py, not saved from a live notebook, and was not opened or evaluated.

### Answer (after the reply)

> The knowledge base is set up in `Wiki/`, with the folders you chose: `Systems/` and `Experiments/`, plus the standard `Concepts/` and `Resources/`. `code/` is unchanged.
> It starts with three articles:
> - the Collatz map and how `Collatz[n]` computes trajectories
> - the Collatz conjecture
> - a table of trajectory lengths I measured in an offline kernel, for example 27 takes 111 steps and peaks at 9232
>
> `Index.md` lists the articles. `Status.md` has the current state and open questions.
> `CLAUDE.md` now holds the rules for keeping the wiki up to date, with prompt tracking and the journal off and one-sentence-per-line formatting on.
> `.gitignore` ignores the root `Tour/` and `Resources/` folders.
> A summary page is at `code/Artifacts/2026-10-22-KnowledgeBase.wln` (open it in WLJS).
> Two things I found in the code: `Collatz[n]` recurses once per step, so at the default recursion limit it fails on trajectories longer than about a thousand steps (1000 steps works, 1030 does not). It also gives no result or message for 0, negative numbers or non-integers.
> The conjecture article cites no sources yet. Tell me if you want published results added as Resources articles.

### Problems (after the reply)

- **wolfram-direct parsing pitfall:** wolfram-direct parses the whole input before `Get` runs, so symbols written in the input shadow the package's symbols (`Collatz::shdw`, calls unevaluated). I worked around it with `ToExpression` and the full symbol name `Collatz`Collatz`.
- **Batched calls:** one `$RecursionLimit::reclim` ended a whole batched call, so the long cases were run one per call.
- **`.gitignore` deviation from upstream:** upstream's `Resources/` pattern would also ignore `Wiki/Resources/`, which contradicts its own rule that the wiki is tracked (checked with `git check-ignore`). I wrote the anchored `/Resources/` and `/Tour/` instead. Worth reporting upstream.
- **Upstream template text left as written:**
  - `Index.md` and `CLAUDE.md` mention `Work/README.md`, which does not exist (no backlog was created).
  - `CLAUDE.md` mentions `Scripts/recover_resources.sh`, which is also not present.
- **CLAUDE.md wording deviation:** I edited the Notebooks paragraph (`code/Artifacts/`, `.wln`) to match the user's code-folder choice and the WLJS setup, rather than copying the template's `Code/Artifacts/` and `.nb`.
- **Recursion cut-off:** the exact cut-off between 1000 and 1030 steps was not measured.
- **Conjecture article:** written without consulting any source, as it says. It gives only the statement, and no verification bounds or literature results.
- **Summary notebook not viewed:** the `.wln` was not opened or screenshotted in WLJS. Opening a window or the browser pane would conflict with the rule against opening windows. md2wln.py's format notes say it matches WLJS 3.1.4's saved layout, but I did not check this on this file.
- **Leftover scratch output:** `Wiki/Resources/` is an empty folder, so git will not track it until a resource article exists. The throwaway git repo and the request files are still in the scratchpad.
- **Superseded:** this supersedes the "not checked in a kernel" note in section 6 above. The recursion-limit and unevaluated-argument behaviour is now measured.
- **No contact with Wolfram servers:** no WLJS kernel call and nothing installed. The only network-relevant setting is `$AllowInternet = False`, which was set, inside a network-blocked sandbox.
