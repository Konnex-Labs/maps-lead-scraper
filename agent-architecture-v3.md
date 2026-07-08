# Konnex Agent Architecture v3.0
## Max x5 Subscription — 5-Agent Team

**Author:** Jack (Head of Engineering)
**Date:** 2026-05-02 (v3.0 baseline) · Updated 2026-06-13
**Status:** APPROVED / ACTIVE — Matt sign-off 2026-06-13 (tmux sig 5cb4869a60520efa)
**Platform:** Claude Code on Max x5 subscription ($170 AUD/mo fixed)
**Default model (ALL agents):** `claude-opus-4-8` — fixed at launch (no hot-switch). Dispatcher reads the Notion **Model** field and launches accordingly (PR #18 / commit 55d8a62b).

---

## Part 1: Agent Ops — Token & Context Optimisation

### 1.1 Subscription Constraints

Max x5 has two rate limit dimensions:
- **5-hour rolling window** — token budget resets on a rolling basis
- **Weekly limit** — hard cap on total tokens per week

All optimisation targets maximising output within these two constraints.

### 1.2 Prompt Caching (Highest Priority)

Prompt caching is the single biggest lever for token efficiency. Cache hits cost 1/10th of full input price.

**Cache hierarchy (order matters — static first, dynamic last):**

| Layer | Scope | Content |
|-------|-------|---------|
| 1. Base system prompt + tools | Globally cached | Claude Code internals (untouchable) |
| 2. CLAUDE.md + Memory files | Cached per project | Agent identity, role, project config |
| 3. Session state (env, MCP) | Cached per session | MCP servers, output settings |
| 4. Messages | Grows each turn | User messages, tool results, task work |

**Cache protection rules:**
- NEVER change MCP server config mid-session (nukes cache)
- NEVER switch models mid-session (nukes cache)
- NEVER put timestamps or dynamic content in CLAUDE.md
- Keep CLAUDE.md stable — changes invalidate project-level cache for ALL sessions
- Tool definitions must be deterministic (same order every time)

### 1.3 Environment Variables (All Agents)

```bash
# Disable 1M context window — 200K is sufficient for any task
export CLAUDE_CODE_DISABLE_1M_CONTEXT=1

# Auto-compact at 80% (default is higher, risks compaction surprises)
export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=80
```

Set these in each agent's shell profile (`~/.bashrc` or `~/.profile`).

### 1.4 ccburn — Token Usage Monitoring

**Install:** `npm install -g ccburn`

**Integration points:**

1. **tmux status bar** — every agent session shows compact burn rate:
   ```bash
   # Add to tmux.conf
   set -g status-right '#(ccburn --compact)'
   ```

2. **Agent Sessions Dashboard** — new tab showing:
   - 5hr rolling window burn-up chart per active agent
   - Weekly limit burn-up chart (team aggregate)
   - Visual indicators: behind pace / on pace / burning hot

3. **JSON output for automation:**
   ```bash
   ccburn --json  # Programmatic access for auto-pause logic
   ```

4. **Agent self-awareness** — agents can check their own burn rate to decide whether to keep working, compact, or save state and exit before hitting the window.

### 1.5 CLAUDE.md Design (Static, Lean, Cache-Friendly)

Each agent gets ONE static CLAUDE.md. Target: **under 50 lines**.

**Structure:**
```
# [Agent Name] — [Role Title]
You are [name], [role] at Konnex Labs. You report to [manager].

## Your Responsibilities
- [3-5 bullet points of core ownership areas]

## Key Rules
- Reply to Matt via Telegram, not terminal
- 70% context exit protocol — save state and exit
- Check REPO-MAP.md for codebase structure before exploring
- Read PROGRESS.md on session start if it exists

## Projects
- [list of owned repos/projects with paths]
```

**What does NOT go in CLAUDE.md:**
- Task details (goes in session messages via dispatcher)
- Dynamic state (goes in PROGRESS.md or memory files)
- Domain knowledge (goes in external memory files, read on-demand)
- Process documentation (agents learn by doing, not by pre-loading docs)

### 1.6 Progressive Context Loading

Agents start lean and pull context only when needed.

**Session start sequence:**
1. Claude Code boots, loads CLAUDE.md (~50 lines, cached)
2. Dispatcher injects task brief as first message (specific files, scope, acceptance criteria)
3. Agent reads PROGRESS.md if it exists (multi-session resume)
4. Agent reads ONLY the files listed in the task brief
5. If agent needs broader context, reads REPO-MAP.md (~50 lines per project)
6. External memory files read on-demand, never at startup

**What we eliminated from startup:**
- ~~Notion queries~~ (zero at startup)
- ~~Daily briefing~~ (not needed per-task)
- ~~Full memory.json~~ (only PROGRESS.md for resume)
- ~~Nucleus index~~ (read on-demand when making factual decisions)

### 1.7 Session Lifecycle

**Start:** Dispatcher launches agent with task brief. Agent boots, reads CLAUDE.md (cached), receives task in first message.

**Work:** Agent executes task. Uses /compact at 50% or after completing a sub-task. Uses /clear between unrelated work items within a session.

**Exit triggers:**
- Task complete → commit, update Notion, notify Matt, /exit
- 70% context → save PROGRESS.md, commit WIP, notify Matt, /exit
- Burning hot on ccburn → finish current step, save state, /exit
- No active task → /exit (don't idle)

**Idle policy:** Agents do NOT run when idle. Shutdown after task completion. Dispatcher restarts when next task is assigned. Target: max 2-3 agents running concurrently.

### 1.8 REPO-MAP.md (Per Project)

Each project gets a static REPO-MAP.md (~50 lines) listing:
- Key directories and what they contain
- Entry points (main server file, CLI commands)
- Database tables and their purpose
- API routes overview
- Config files that matter

Agents read this on-demand when they need broader codebase awareness. It's cached at project level alongside CLAUDE.md.

---

## Part 2: Team Setup — 5 Agents

### 2.1 Agent Roster

| Agent | Role | Default Model | Reviewer | Reports To |
|-------|------|---------------|----------|------------|
| Jack | Head of Engineering | `claude-opus-4-8` | Rajesh | Matt |
| Olivia | Frontend & UX | `claude-opus-4-8` | Rajesh | Jack |
| Carlos | SEO & Data Intelligence | `claude-opus-4-8` | Rajesh | Alex |
| Alex | Strategy & Growth | `claude-opus-4-8` | Matt | Matt |
| Rajesh | QA & Ops | `claude-opus-4-8` | Jack | Jack |

> **v3.0 model standardisation (Matt 2026-06-13):** all 5 agents run `claude-opus-4-8`. The earlier mixed Opus/Sonnet/Haiku routing is retired. Model is fixed at launch via `--model`; to change, the agent exits and the dispatcher relaunches it on the model set in the Notion **Model** field (PR #18 / 55d8a62b). Sub-agent spawning (using lighter models for mechanical work) is governed by a **separate** task and is intentionally NOT specified here.

### 2.2 Role Definitions

**Jack — Head of Engineering**
- All engineering codebases, schema design, infrastructure
- Pipeline ops (absorbs Ada's pipeline execution + monitoring)
- Architecture decisions, sprint contract authorship
- Backend builds, API endpoints, DB migrations
- Manages: Olivia, Rajesh

**Olivia — Frontend & UX**
- Konnex website (konnexlabs.com) — HTML, CSS, design, templates
- Explorer, Connect, API dashboard frontend
- Visual QA with Playwright breakpoint screenshots
- Sprint contract authorship for frontend/UX work

**Alex — Strategy & Growth**
- Forward planning, business review, content strategy
- Sprint contract briefs, copy writing, site content
- Visual review of UAT via Playwright
- Matt dependency management
- Absorbs Sarah's content writing responsibilities
- Hands off execution to Olivia/Carlos

**Carlos — SEO & Data Intelligence**
- SEO page generation system (Node.js generators, 10K-120K+ pages)
- Technical SEO strategy (absorbs Priya's indexation monitoring, GSC analysis, audit ownership)
- Data analysis and statistical modelling (absorbs Maria's data science capabilities)
- Template engineering, JSON-LD, AI discoverability

**Rajesh — QA & Ops**
- Sprint contract QA gate — reviews and approves before build
- Structured QA test reports with pass/fail per criterion
- Sprint board health, ticket routing (absorbs Brian's ops management)
- Code review (merged with QA — single review step)

### 2.3 Retired Agents

| Agent | Absorbed By | Reason |
|-------|-------------|--------|
| Brian | Rajesh | Ops management is lightweight, fits alongside QA |
| Ada | Jack | Pipeline ops is engineering work |
| Sarah | Alex | Content writing is part of growth strategy |
| Maria | Carlos | Data analysis feeds SEO decisions |
| Priya | Carlos | SEO monitoring is core to SEO role |

Home directories for retired agents remain intact. Their memory files and project history are preserved for reference.

---

## Part 3: 7-Stage End-to-End Process

### Stage 1: Ideation

Matt chats with Jack, Alex, or Carlos via Telegram. Brainstorm, explore, strategise. This is where deep reasoning earns its keep — ambiguous problems, tradeoff analysis, creative solutions.

**Output:** Clear idea with rough scope.

### Stage 2: Brief & Ticket

Planning agent writes a structured brief and creates a Notion ticket.

**Brief contains:**
- What we're building and why
- Scope boundaries (what's in, what's out)
- Key files/systems affected
- Acceptance criteria
- Estimated sessions (1 / 2-3 / 4+)
- Suggested model routing

**Tiering (determines process weight):**
- **Tier 1** (bug fix, config change, <2hr): Skip to Stage 4. No sprint contract needed. Agent just does it.
- **Tier 2** (feature, multi-file change): Brief + one reviewer sign-off, then build.
- **Tier 3** (new integration, architectural change, cost implications): Full sprint contract + approval chain.

### Stage 3: Sprint Contract (Tier 2-3 only)

Assigned agent writes sprint contract on the Notion ticket.

**Approval chain (Tier 3):**
1. Rajesh QA review — testability, acceptance criteria clarity
2. Alex business review — value alignment, cost impact
3. Matt product sign-off — go/no-go

**Approval chain (Tier 2):**
1. One reviewer (Rajesh or Alex depending on task type)
2. Matt informed, can veto

### Stage 4: Build

Two execution patterns:

**a) Single agent:**
The owning agent builds directly. Mechanical delegation to sub-agents is allowed but governed by a separate spec (see §2.1 note), not prescribed here. Best for: backend builds, page generation, pipeline work.

**b) Cross-agent handoff:**
Planning agent creates a detailed task brief on the Notion ticket, assigns to an execution agent. Best for: Alex plans → Olivia builds frontend; Carlos plans SEO → bulk generation.

**Build rules:**
- Agent reads only files listed in task brief (progressive loading)
- Commits after each logical step (not at the end)
- Updates PROGRESS.md after each step (multi-session safety)
- Uses /compact at 50% context

### Stage 5: QA (Rajesh)

Rajesh reviews against sprint contract criteria (Tier 2-3) or acceptance criteria (Tier 1).

**QA includes:**
- Code review (merged into QA step, not separate)
- Functional testing against acceptance criteria
- Visual QA via Playwright breakpoints (if UI changes)
- Pass → Stage 6. Fail → specific feedback, back to Stage 4.

### Stage 6: Final Review & Sign-off

- **Tier 1:** Jack or Alex approves. Ship it.
- **Tier 2:** Matt informed, Jack/Alex approves.
- **Tier 3:** Matt explicitly approves.

### Stage 7: Deploy

Agent owner deploys via deploy.sh (current method).

**Post-deploy:**
- Smoke test in production
- Update Notion ticket to Done
- Notify Matt via Telegram
- Agent shuts down (/exit)

**CI/CD pipeline:** Deferred to post-relaunch. Will be built as one of the first tasks through this new process.

---

## Part 4: Implementation Checklist

### Phase 1: Agent Ops Config (do first)
- [ ] Install ccburn globally: `npm install -g ccburn`
- [ ] Set environment variables on all 5 agent profiles
- [ ] Add ccburn --compact to tmux status bar config
- [ ] Add ccburn dashboard tab to Agent Sessions page
- [ ] Verify MCP Tool Search / deferred loading is active
- [ ] Write REPO-MAP.md for each active project

### Phase 2: Team Setup
- [ ] Write new CLAUDE.md for each of 5 agents (under 50 lines each)
- [ ] Archive retired agent configs (Brian, Ada, Sarah, Maria, Priya)
- [ ] Update Notion board assignee options
- [ ] Update dispatcher to recognise 5 agents only
- [ ] Reassign active tickets from retired agents to new owners

### Phase 3: Process
- [ ] Document 7-stage flow in Notion Docs Library
- [ ] Update sprint contract templates with tiering
- [ ] Test end-to-end: Matt → Jack ideation → ticket → build → QA → deploy
- [ ] Iterate based on first 3 tasks through the pipeline

---

## Appendix: Key Config Locations

| What | Where |
|------|-------|
| Agent CLAUDE.md | /home/[agent]/CLAUDE.md |
| Project CLAUDE.md | /home/[agent]/projects/[repo]/CLAUDE.md |
| REPO-MAP.md | /home/[agent]/projects/[repo]/REPO-MAP.md |
| PROGRESS.md | /home/[agent]/projects/[repo]/PROGRESS.md |
| Memory files | /home/[agent]/.claude/projects/[project]/memory/ |
| ccburn | npx ccburn / npm global |
| Env vars | ~/.bashrc per agent |
| Dispatcher | /home/shared/bin/task-dispatcher |
| Telegram bridge | /home/shared/bin/team-chat-send |
| tmux messaging | /home/shared/bin/tmux-message |
