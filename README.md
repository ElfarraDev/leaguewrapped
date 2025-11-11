<p align="center">
  <img src="/wrapped-web/lolwrappedicon.png" alt="LOL Wrapped Logo" width="220">
</p>

# LOL WRAPPED — AI-Powered League of Legends Year-in-Review  
**Personalized Insights • Playstyle DNA • AI Coaching • Parallel Universes**

> A fully-automated, AI-driven analytics platform built on AWS + Riot Games API  
> Turning your entire 2025 League of Legends season into a cinematic, data-rich recap experience.

## ▶️ How to Use

Use the live endpoint: 👉 https://leaguewrapped.xyz/

For now, only cached summoners will load with entire match history:
- **denathor**
- **mex**
- **Shimmer**
- **Sylvan**
- **cheesedbeluga**
- **arcona**
- **Aontevanger**
- **mannar**

⚠️ Riot API limits prevent real-time loading of additional summoners.  


═══════ ⚔️ RIFT SUMMARY OPENING ⚔️ ═══════

## 🏆 Overview

LOL Wrapped is a League-themed analytics and insight engine that transforms raw Riot match history into a polished, immersive, year-in-review experience.  
Players receive:

- Comprehensive global statistics  
- Personal playstyle fingerprints (“Player DNA”)  
- AI-generated coaching & roast analysis  
- Alternative timelines (“Parallel Universe” mode)  
- Friend comparisons  
- Champion highlights and performance breakdowns  

LOL Wrapped is built for the **AWS AI & League of Legends Hackathon 2025**, leveraging AWS AI services to elevate standard stat tracking into story-driven insights that feel authentic to League players.

┏━━━━━━━━━━━━━━━ ⚙ HEXTECH SYSTEMS ONLINE ⚙ ━━━━━━━━━━━━━━━┓

---

## 🎮 Key Features

### ✅ **LOL Wrapped Dashboard**
A full-season breakdown including:

- **Hours Played** (min / hours / days / seconds)  
- **Total Damage** (absolute + per minute)  
- **Total Gold Earned**  
- **Total Matches** (W/L + win rate)  
- **Pentakills, Quadrakills, Triple/Double kills**  
- **Vision Metrics** (wards placed/killed + vision score)  
- **Combat Metrics** (first bloods, solo kills, killstreaks ended)  
- **Objective Stats** (dragons, barons, heralds, turrets, inhibitors)  
- **Top Champion Highlight** with mastery, WR, K/D, games played  
- **Champion Pool Breakdown**  
- **Performance Profile Overview**  

▂▃▄▅▆▇ █ ☠ POSITIONAL INTEL RECEIVED ☠ █ ▇▆▅▄▃▂

---

### ✅ **Player DNA — Playstyle Fingerprinting**
Machine-derived insights built from 400+ match samples:

- CS@10 benchmarking  
- Roam patterns & roam count  
- River / side lane / jungle death maps  
- Facecheck detection  
- Early-death tagging  
- Recall timing  
- Damage uptime vs alive windows  
- Objective pressure patterns  
- Aggression vs risk-taking profile  

LOL Wrapped converts long-term tendencies into readable “persona profiles.”

═══════════════════════ ⚔️ COACHING PROTOCOL ⚔️ ═══════════════════════

---

### ✅ **AI-Generated Coaching**
Using **Amazon Bedrock**, the system creates:

- Macro-level improvement guidance  
- Micro-mechanical patterns  
- Pathing/positioning insights  
- Temporal trends (early, mid, late game performance)  
- Vision control strategy advice  
- Consistency scoring  
- Role-specific optimization recommendations  

---

### ✅ **AI-Generated Roasts**
A fun, shareable roast system based on deep behavior signals:

- Deaths in river  
- Facecheck deaths  
- Early-game blunders  
- Missed farm windows  
- Multi-kill droughts  
- Misplaced vision  
- Aggressive jungle invades gone wrong  

┏━━━━━━━━━━━━ 📊 FRIEND COMBAT ANALYSIS 📊 ━━━━━━━━━━━━┓

---

### ✅ **Friend Comparison Mode**

Side-by-side stat comparison:

| Category | You | Opponent |
|----------|-----|----------|
| Win Rate | ✅ 47.4% | 47.4% — Draw |
| KDA | ✅ 2.03 | 2.03 — Draw |
| Kill Participation | ✅ 46.9% | 46.9% — Draw |
| Damage Per Minute | ✅ 969 | 969 — Draw |
| CS/Min | ✅ 5.7 | 5.7 — Draw |
| Vision Score | ✅ 17.8 | 17.8 — Draw |
| First Bloods | ✅ 50 | 50 — Draw |
| Pentakills | ✅ 1 | 1 — Draw |

════ 🌀 ALTERNATE TIMELINE SIMULATOR ACTIVATED 🌀 ════

---

### ✅ **Parallel Universe Engine**

Simulated “what-if” alternate timelines powered by AI:

#### **🌀 Without Your Main**
- Win rate drops  
- Games played decreases  
- AI explains reliance  

#### **🌟 Champion Pool Optimization**
- Huge WR increase  
- Smaller champion pool  
- Mastery emphasis  

#### **⏳ Time Investment**
- Hours saved  
- Days regained  
- Games avoided  

#### **🔥 Peak Performance Mode**
- Projected WR boost  
- Rank climb prediction  

#### **🥇 Perfect Season**
- 100% WR  
- Simulated Challenger  
---

# 🧠 Architecture

<p align="center">
  <img src="/wrapped-web/architecture.png" alt="LOL Wrapped Logo" width="1000">
</p>

---

## 🚀 Deployment

- **EC2 instance**  
- **Docker Compose** auto-pull from ECR  
- **FastAPI backend**  
- **Bedrock LLM AI services**  
- **DynamoDB caching**  

---

## 🧩 Tech Stack

- Python / FastAPI  
- Amazon Bedrock  
- AWS EC2 / ECR  
- DynamoDB  
- Riot Games API  

---

┏━━━━━━━━━━━━━━━ ⚙ AI SYSTEM INTELLIGENCE SUMMARY ⚙ ━━━━━━━━━━━━━━━┓

LOL Wrapped uses **Amazon Bedrock** to turn raw Riot match data into playable,
readable, league-flavored narrative insights. Our backend doesn’t simply display
numbers — it **interprets** them, contextualizes them, and converts them into
entertaining & instructive content.

════════════════ ⚔️ AI ANALYTICS ENGINE ⚔️ ════════════════

### ✅ AI-Powered Insight Categories
All AI features run through enriched statistics we compute server-side:

- **Recent Match Aggregation** — CS/min, KP, DPM, KDA, gold, map pressure
- **Behavioral Flags** — early deaths, roaming patterns, facechecks, river deaths
- **Temporal Analysis** — early-game vs mid-game vs late-game performance
- **Champion Consistency** — WR per pick, streak behavior, pool depth
- **Situational Trends** — ahead/behind behavior, tilt indicators, recovery patterns

These metrics are passed to Bedrock in structured format — NOT raw dumps.

---

### ✅ AI-Generated Coaching (via Bedrock)
Claude synthesizes:

- Macro mistakes (lane tempo, positioning tendencies)
- Objective discipline (dragons, herald timing, baron pressure)
- Vision strategy (placement patterns, denial patterns)
- Consistency breakdowns (variance across matches)
- Match phase insight (what changes between wins vs losses)

Output is concise, role-specific, and anchored to real match behavior.

---

### ✅ AI-Generated Roasts
Roasts reference **actual data points**, not generic insults:

- Most frequent death locations  
- Worst champion WR  
- CS drop-off when behind  
- Spikes in deaths during loss streaks  
- Ranked progression tilts  

Tone varies by intensity, but always hooks into real patterns.

---

### ✅ Playstyle DNA (Personality Model)
We convert statistical fingerprints into a “persona profile,” describing:

- **Aggression vs risk-taking**  
- **Farm vs pressure prioritization**  
- **Team reliance vs solo carry instincts**
- **Adaptation during disadvantage**
- **Late-game control vs early dominance**
- **Champion identity & role tendencies**

Outputs remain grounded — no fantasy personality reading.

---

════════════════ ⚔️ ALTERNATE TIMELINE ENGINE ⚔️ ════════════════

### ✅ Parallel Universe Simulation
What-if projections use simple statistical heuristics:

#### 🌀 Without Your Main
- Remove games from your most-played champion
- Recompute WR, KDA, consistency
- Estimate WR shift & rank impact

#### 🌟 Champion Pool Optimization
- Identify champions with strong WR
- Recalculate season if only those champions were played
- Highlight wasted games on low-performing picks

#### ⏳ Time Investment
- Detect win-rate decay across multi-game sessions
- Estimate life-hours recovered vs rank change

#### 🔥 Peak Performance Mode
- Compare peak 10 games vs season average
- Project rank if peak was maintained

All simulations are **mathematically lightweight** — not speculative fantasy.

---

┏━━━━━━━━━━━━━━━ ⚙ MODEL CONFIGURATION ⚙ ━━━━━━━━━━━━━━━┓

### ✅ Bedrock Model Settings
We use **Claude 3.5 Sonnet** with tuned parameters per feature:

| Feature | Temperature | Purpose |
|--------|-------------|---------|
| Roasts | **0.9** | Creative humor, stat-anchored |
| Coaching | **0.7** | Balanced tone, actionable advice |
| DNA Analysis | **0.7** | Pattern synthesis |
| Parallel Universe | **0.6** | Lower creativity, higher consistency |

Each request uses **summarized match data**, not full match dumps (cost-optimized).

---

### ✅ Backend Preprocessing Highlights
Before hitting AI, we compute:

- Aggregated trend lines  
- Champion-specific metrics  
- Role-weighted stats  
- Consistency score (variance vs mean)  
- Temporal splits (0–15, 15–25, 25+)  
- Performance deltas in wins vs losses  
- Engagement flags (roaming, deaths, CS drops, etc.)  

AI receives structured summaries like:



---
┏━━━━━━━━ ⚙ CONTINUOUS DEPLOYMENT PROTOCOL (CI/CD)⚙ ━━━━━━┓

LOL Wrapped uses a fully automated multi-container CI/CD pipeline powered by  
GitHub Actions → AWS ECR → AWS SSM → EC2 Docker Orchestration.

════════════════ ⚔️ EC2 DEPLOYMENT STAGE ⚔️ ════════════════

✅ **EC2 Deployment Script (Server-Side)**  
When GitHub pushes new images and triggers an SSM command, the EC2 host runs:

### 🔧 deploy-lolwrapped.sh — Responsibilities

---

### 1️⃣ Clean & Authenticate
- Runs `docker system prune -f` to purge old images/containers.  
- Authenticates to ECR via: `aws ecr get-login-password | docker login`.

---

### 2️⃣ Securely Fetch Secrets
- Retrieves Riot API key from **AWS SSM Parameter Store**.  
- Loads AWS credentials (for Bedrock) from SSM.  
- Includes DynamoDB table name + region variables.

---

### 3️⃣ Dynamic Compose Generation
- Rewrites `/home/ec2-user/docker-compose.yml` at deployment time.  
- Injects fresh image URIs for:  
  - Frontend  
  - Backend  
  - Bedrock AI service  
  - Nginx proxy  
- Ensures all four services are aligned to the latest build.

---

### 4️⃣ Pull Latest Images
- Pulls each updated image directly from ECR.  
- Guarantees consistent versioning across services.

---

### 5️⃣ Restart Stack Cleanly
- Stops old containers using `docker-compose down`.  
- Starts updated containers via `docker-compose up -d`.  
- Services run with `restart: unless-stopped` ensuring resilience.

---

┏━━━━━━━━━━━━━━━ ⚙ PIPELINE SUMMARY ⚙ ━━━━━━━━━━━━━━━┓

✅ Fully automated end-to-end flow  
✅ Multi-image builds shipped together  
✅ No manual SSH or file editing  
✅ Secure secrets via SSM (no plaintext keys)  
✅ Clean Docker lifecycle + isolated network  
✅ Stable, repeatable deployments every push  


---
## 🔧 Local Development

To run LOL Wrapped locally, you only need **Docker** and a minimal `.env` file.
════════════ ⚔️ LOCAL SUMMONING PROCEDURE ⚔️ ════════════

### ✅ Step 1 — Clone the repository

```bash
git clone https://github.com/yourrepo/lol-wrapped.git
cd lol-wrapped
```

### ✅ Step 2 — Create your .env file

In the project root, create a file named .env with the following content:

```bash
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
DYNAMODB_TABLE=
RIOT_API_KEY=
```
⚠️ Your Riot API key must be a Developer Key or Production Key
⚠️ AWS credentials must have permission for DynamoDB read/write access

### ✅ Step 3 — Start the development container

Use the dedicated local compose file:
```bash
docker-compose -f docker-compose.local.yml up --build
```

Docker will:

- Build the FastAPI service
- Expose your local API
- Connect to the configured DynamoDB Table
- Use Riot API for live data retrieval

### ✅ Step 4 — Visit the local endpoint

Your local service should now be accessible at: http://localhost/


📄 License
Licensed under the MIT License.

-----------

