<div align="center">
  <img src="https://raw.githubusercontent.com/RALPH22222/csmp-web-admin/main/public/logo.png" width="80" alt="BayanIpon Logo" />
  <h1>BayanIpon</h1>
  <p><strong>A Composable Stellar Micro-Finance Protocol</strong></p>
  <p><em>Digitizing the traditional Filipino "Paluwagan" and unlocking zero-collateral microlending for the unbanked.</em></p>
</div>

---

## 🚀 Elevator Pitch

**BayanIpon** digitizes the traditional Filipino informal group savings system (*Paluwagan*) and replaces predatory "5-6" loans (240% APR) by leveraging Soroban smart contracts. We serve unbanked wet market vendors by acting as a trustless escrow, facilitating zero-fee transactions, and generating on-chain credit scores that unlock fair, decentralized micro-lending.

## ⚠️ The Problem

- **Financial Exclusion:** 76% of adults in the Philippines remain unbanked or underbanked.
- **Predatory Lending:** Vendors rely heavily on "5-6" loans, which charge a predatory 20% monthly interest rate (240% APR) just for daily operational liquidity.
- **Insecure Savings:** The traditional *Paluwagan* relies on manual cash boxes managed by a single individual, leading to human error, theft, and lack of transparency. No formal credit history is generated from these responsible savings habits.

## 💡 The Solution

A mobile-first, decentralized micro-finance platform utilizing **Soroban Smart Contracts**, **SEP-24 Anchors** for local fiat off-ramps (e.g., GCash), and **Fee-Bump Transactions**. BayanIpon provides a completely zero-fee, Web2-like experience for users while generating immutable on-chain credit profiles.

---

## 🏗️ System Architecture

BayanIpon is built with a heavily modular architecture separated across four distinct repositories. Choose a component below to explore its codebase:

<div align="center">

[![Smart Contract](https://img.shields.io/badge/Repo_1-Smart_Contract-ea4b34?style=for-the-badge&logo=rust&logoColor=white)](https://github.com/RALPH22222/contract)
[![Backend API](https://img.shields.io/badge/Repo_2-Backend_API-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://github.com/RALPH22222/csmp-backend)
[![Mobile App](https://img.shields.io/badge/Repo_3-Mobile_App-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://github.com/RALPH22222/csmp-mobile-app)
[![Admin Web Dashboard](https://img.shields.io/badge/Repo_4-Admin_Dashboard-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://github.com/RALPH22222/csmp-web-admin)

</div>

---

### 1. Smart Contract Repo
**Tech Stack:** Stellar Soroban / Rust

The heart of BayanIpon's decentralized trust layer. These Soroban contracts enforce the rules of the *Paluwagan* and handle all value transfers without intermediaries.
- **Trustless Escrow:** Securely locks pooled funds from participants. Payouts are automatically distributed to the scheduled recipient at the end of each cycle without manual intervention.
- **On-Chain Credit Scoring:** Tracks user participation, evaluating on-time contributions versus defaults. Good behavior dynamically upgrades an on-chain soulbound token (SBT) representing the user's creditworthiness.
- **Micro-Lending Protocol:** Users with high on-chain credit scores can borrow from a decentralized liquidity pool at fair, algorithmically defined interest rates, completely bypassing predatory 5-6 lenders.
- **Role-Based Access Control:** Utilizes multi-sig and distinct admin roles to allow community organizers to deploy pools while strictly preventing rug-pulls or unauthorized fund extraction.

### 2. Backend API Repo
**Tech Stack:** Node.js / Express / TypeScript / Supabase PostgreSQL

The bridge between the blockchain and the Web2 experience, designed to abstract away crypto complexities for non-technical users.
- **Fee-Bump Transaction Sponsoring:** Wraps user transactions and pays the Stellar network fees via a sponsor account. Users never have to buy or hold XLM for gas.
- **Off-Chain Indexing & State:** Mirrors blockchain state into Supabase for lightning-fast UI queries (like user profiles, historical transactions, and active pools) without spamming the Stellar RPC.
- **SEP-24 Anchor Orchestration:** Integrates with local Stellar Anchors to enable seamless fiat-to-crypto bridging, allowing vendors to cash-in and cash-out directly via GCash or Maya.
- **Cron Jobs & Notifications:** Manages automated daily tasks, such as evaluating pool cycles, triggering payouts, and sending SMS/Push reminders for daily contributions.

### 3. Mobile App Repo
**Tech Stack:** React Native / Expo

The primary touchpoint for our end-users (market vendors). Designed for low-end smartphones with an emphasis on extreme simplicity.
- **Web2-like UX:** Hides seed phrases and blockchain jargon. Users interact with the app just like a traditional mobile banking or e-wallet application.
- **Non-Custodial Key Management:** Automatically generates and securely stores keypairs locally in the device’s secure enclave, signing transactions transparently in the background.
- **Paluwagan Dashboard:** Provides a clear, visual overview of active saving pools, daily contribution targets, current streaks, and the date of their upcoming payout.
- **1-Click Cash-In/Out:** A deeply integrated gateway that uses the SEP-24 backend services to convert physical cash or e-wallet PHP directly into digital assets locked in Soroban.

### 4. Admin Web Dashboard Repo
**Tech Stack:** Astro / Web

The control center for protocol operators and local community managers to oversee platform health and risk.
- **Protocol Analytics (TVL):** Real-time aggregation of Total Value Locked, active pools, participant demographics, and default rates across the entire ecosystem.
- **Risk & Treasury Management:** Monitors the micro-lending liquidity pools, tracks interest accruals, and provides controls to adjust platform parameters (e.g., minimum credit score requirements).
- **KYC & User Management:** Dashboard for reviewing user identities, approving community organizers, and handling disputes.
- **Audit Trails:** Provides transparent, easily readable logs combining off-chain backend events with immutable on-chain Soroban transactions.

---

## 🔄 System Flow: Joining & Contributing to a Pool

To understand how these repositories interact in production, let's walk through a core user action: **A vendor makes their daily Paluwagan contribution.**

1. **User Intent (Mobile App):** 
   The vendor opens the **Mobile App** and taps "Pay Daily Contribution". The app constructs a Soroban smart contract invocation locally, signs it using the securely stored local keypair, and sends the payload to the Backend.
   
2. **Gas Abstraction (Backend API):** 
   The **Backend API** receives the signed transaction. Instead of submitting it directly, it wraps the payload in a Stellar *Fee-Bump Transaction*. The backend signs this wrapper with the platform's sponsor wallet, paying the network fee so the user doesn't have to.

3. **Settlement & Escrow (Smart Contract):** 
   The transaction is submitted to the Stellar network. The **Soroban Smart Contract** executes the logic: it verifies the user's signature, deducts the contribution amount (e.g., USDC) from the user's wallet, locks it in the pool's escrow, and records the successful payment on-chain.

4. **Event Indexing (Backend API):** 
   The **Backend API** listens for the successful blockchain event. It updates the Supabase database to reflect the new pool balance, credits the user's contribution streak, and recalculates their off-chain credit score metric.

5. **Real-Time Reflection (Mobile App & Admin Dashboard):** 
   - The **Mobile App** receives a success push notification, and the UI updates to show the daily requirement as fulfilled.
   - The **Admin Web Dashboard** simultaneously updates its analytics, reflecting the increase in platform TVL and logging the transaction for audit purposes.

---
*Built with ❤️ for the Stellar Blockchain Hackathon.*
