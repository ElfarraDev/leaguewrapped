<p align="center">
  <img src="/wrapped-web/lolwrappedicon.png" alt="LOL Wrapped Logo" width="220">
</p>

# LOL WRAPPED — AI-Powered League of Legends Year-in-Review  
**Personalized Insights • Playstyle DNA • AI Coaching • Parallel Universes**

> A fully-automated, AI-driven analytics platform built on AWS + Riot Games API  
> Transforming your entire 2025 League of Legends season into a cinematic, data-rich recap experience.

---

## ▶️ How to Use

Live endpoint: https://leaguewrapped.xyz/

For now, only cached summoners load with full match history:

- **denathor**
- **mex**
- **Shimmer**
- **Sylvan**
- **cheesedbeluga**
- **arcona**
- **Aontevanger**
- **mannar**

⚠️ Riot API limits prevent real-time loading of uncached summoners.  

---

## 🏆 Overview

LOL Wrapped is an analytics and storytelling engine that transforms raw match history into a fully produced season recap. Players receive:

- Comprehensive seasonal statistics  
- Personalized playstyle fingerprints (“Player DNA”)  
- AI-generated coaching analysis  
- Alternative timeline simulations  
- Friend comparisons  
- Champion performance breakdowns  

Built for the **AWS AI & League of Legends Hackathon 2025**, LOL Wrapped leverages Amazon Bedrock for advanced AI evaluation and narrative generation.

---

## 🎮 Key Features

### ✅ Full-Season Dashboard

- Total hours played  
- Total damage dealt + per-minute analytics  
- Gold earned  
- Match count + win rate  
- Multi-kill achievements  
- Vision and objective metrics  
- Champion pool distribution  
- Top champion highlight card  
- Performance profiling  

---

### ✅ Player “DNA” — Playstyle Fingerprinting

Insights learned from large samples of your gameplay:

- CS@10 + laning benchmark  
- Roaming patterns  
- Heatmaps for deaths / danger zones  
- Facecheck frequency  
- Early deaths + recall habits  
- Damage uptime  
- Objective pressure performance  
- Aggression vs risk profile  

---

### ✅ AI Coaching

AI-driven guidance using Amazon Bedrock:

- Macro-level improvement suggestions  
- Lane tempo, map pressure, and positioning critique  
- Micro-pattern detection  
- Role-specific recommendations  
- Early vs mid vs late game consistency insights  
- Vision control strategy  

---

### ✅ AI Roasts

Fun, stat-driven roast content based on actual behavior patterns:

- River deaths  
- Facechecks  
- Blunder detection  
- Resource mismanagement  
- Champion misuse  
- Tilt patterns  

---

### ✅ Friend Comparison Mode

Head-to-head comparison across:

- Win rate  
- KDA  
- Kill participation  
- Damage per minute  
- CS/min  
- Vision score  
- First bloods  
- Multi-kill achievements  

---

### ✅ Parallel Universe Engine

Simulated “what-if” alternate outcomes:

- **Without your main** — adjusted WR, KDA, and consistency  
- **Champion pool optimization** — filtered by high-performance picks  
- **Time investment analysis** — hours saved vs rank impact  
- **Peak performance mode** — projected WR if peak form was maintained  

---

## ✅ NEW FEATURE — AI Coach Chatbot

The latest addition to LOL Wrapped brings interactive, stat-aware coaching directly into the website.

### 🧠 What It Does

Open the AI Coach Chatbot at any time during your Wrapped session to:

- Discuss your stats with a coach-like AI that knows your match history  
- Ask about macro/micro strategies  
- Diagnose weaknesses and trends  
- Explore champion-specific advice  
- Learn role-optimized strategies  
- Get tailored improvement suggestions  

### 💬 What You Can Ask

- “Why do I consistently lose early game as jungle?”  
- “What’s my biggest macro flaw?”  
- “Which champions best fit my stats?”  
- “Why is my CS@10 dropping when behind?”  
- “How do I improve teamfight impact?”  

Fully integrated, personalized, and grounded in your actual gameplay data.

---

# 🧠 Architecture Overview

<p align="center">
  <img src="/wrapped-web/architecture.png" alt="LOL Wrapped Architecture" width="1000">
</p>

---

## 🚀 Deployment

- EC2 instance  
- Docker Compose orchestration  
- FastAPI backend  
- Bedrock AI service layer  
- DynamoDB caching  

---

## 🧩 Tech Stack

- Python / FastAPI  
- Amazon Bedrock  
- AWS EC2 / ECR  
- DynamoDB  
- Riot Games API  

---

# AI Systems Overview

LOL Wrapped uses Amazon Bedrock to transform data into narrative insights and coaching feedback.

### AI Insight Categories

- Recent match aggregation  
- Behavioral pattern extraction  
- Temporal performance analysis  
- Champion consistency metrics  
- Situational trend analysis  

### Coaching

- Macro and micro-level assessments  
- Objective discipline  
- Vision analysis  
- Role-specific feedback  

### Roasts

- Data-driven humor built on real stats  
- No generic text — always grounded in your season metrics  

### Playstyle DNA

- Aggression vs risk  
- Farm vs pressure  
- Carry reliance  
- Early vs late orientation  
- Champion identity  

---

# Parallel Universe Engine

Simulated what-if scenarios using statistical heuristics:

- Remove main champion data  
- Optimize champion pool  
- Time and fatigue modeling  
- Peak performance extrapolation  

---

# Bedrock Model Configuration

| Feature | Temperature | Purpose |
|--------|-------------|---------|
| Roasts | 0.9 | Creative humor |
| Coaching | 0.7 | Actionable guidance |
| DNA | 0.7 | Pattern synthesis |
| Parallel Universe | 0.6 | Stability over creativity |

---

# Backend Preprocessing

Before hitting AI models, LOL Wrapped computes:

- Trend lines  
- Champion metrics  
- Temporal splits  
- Consistency scores  
- Role weighting  
- Behavioral flags  

---

# CI/CD Pipeline

- GitHub Actions → AWS ECR → AWS SSM → EC2 deployment  
- Automated image pulling + container restart  
- Secrets stored in SSM  

---

# 🔧 Local Development

Clone and configure your environment:

```bash
git clone https://github.com/yourrepo/lol-wrapped.git
cd lol-wrapped
```
Create .env:

```bash
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
DYNAMODB_TABLE=
RIOT_API_KEY=
```

⚠️ Your Riot API key must be a Developer or Production Key  
⚠️ AWS credentials must allow DynamoDB read/write

---

Start local development:

docker-compose -f docker-compose.local.yml up --build

This will:

- Build and start the FastAPI service  
- Connect to DynamoDB  
- Use Riot API for live data retrieval  
- Serve the backend locally  

---

Visit your local endpoint:

http://localhost/

Your Wrapped backend should now be accessible locally for development and testing.

---

📄 License: MIT
