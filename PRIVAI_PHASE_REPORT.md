# PrivAI: Pre-Hackathon Foundation & Post-Hackathon Integration Report
## *"Prove it. Don't reveal it."*

---

## Executive Summary

PrivAI is an AI-powered, privacy-focused student eligibility verification application. The system eliminates the need for students to submit sensitive academic documents to third parties by converting document text into verifiable zero-knowledge claims.

This report outlines the **Pre-Hackathon Foundation Implementation** (currently built & deployed) and the **Post-Hackathon Midnight ZK Integration Blueprint** (the upcoming privacy layer integration).

---

## Phase 1: Pre-Hackathon Foundation (Currently Implemented)

The pre-hackathon phase delivers a production-quality, full-stack web application establishing the AI extraction, deterministic decision logic, data isolation, and user experience.

```
[Uploaded Academic PDF]
       │
       ▼
[PDF Text Extractor (pdf-parse)]
       │
       ▼
[AI Extraction Service (Gemini / OpenAI / Demo Provider)]
       │ (Strict Zod Schema Output Validation)
       ▼
[Extracted Structured Data (Branch, Year, CGPA, Status)]
       │
       ▼
[Deterministic Rules Engine] (Branch=="CSE", Year>=3, CGPA>=7.0, Status==Active)
       │
       ▼
[Structured Eligibility Result & ZK-Ready Proof Digest]
       │
       ▼
[Privacy UX "What is Shared?" Matrix & Verification Audit Log]
```

### 1. Key Features Built
- **JWT Authentication & Security**: Password hashing via `bcryptjs`, JWT bearer token authorization, Multer file upload validation (5MB max limit, PDF MIME filtering).
- **PDF Text Extraction**: Automatic text extraction and SHA-256 buffer hashing for document integrity verification.
- **Extensible AI Provider Service**: Pluggable provider architecture (`GeminiProvider`, `OpenAIProvider`, `MockProvider`) with strict Zod JSON schema validation (`extractionSchema`).
- **Deterministic Rules Engine**: Objective rules engine (`evaluateEligibility()`) verifying candidate data against internship requirements without relying on LLM decision-making.
- **Data Privacy Separation**: Isolated Mongoose schemas separating private raw transcript attributes from public shareable claim digests.
- **Privacy-First UX**: Dedicated *"What is shared?"* component detailing private data elements versus shareable claim digests.
- **Instant Demo Mode**: Pre-loaded academic certificates for 1-click evaluation without requiring file uploads or active API keys.

---

### 2. System Architecture & Tech Stack

| Layer | Technology | Responsibilities |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons | Responsive glassmorphic UI, dashboard, dropzone uploader, real-time visualizer, audit log |
| **Backend API** | Node.js, Express.js | REST APIs (`/api/auth`, `/api/documents`, `/api/analysis`, `/api/eligibility`), auth middleware, error handling |
| **Database** | MongoDB & Mongoose | Data persistence with automatic **In-Memory MongoDB fallback** for zero-setup execution |
| **AI Extraction** | `@google/genai` (Gemini 2.5 Flash), OpenAI GPT-4o, Mock | Parsing academic document text into strict JSON |
| **Rules Engine** | Pure JavaScript | Deterministic, non-hallucinating rule evaluation |

---

### 3. Pre-Hackathon Functional Capabilities

1. **Authentication**: Register, login, and user profile management.
2. **Document Management**: Upload PDF, view uploaded document history, generate sample demo transcripts.
3. **AI Extraction**: Extract Student Name, Branch, Year, CGPA, Skills, and Textual Evidence quotes.
4. **Rules Evaluation**:
   - `studentStatus == true`
   - `normalizeBranch(branch) == 'CSE'`
   - `year >= 3`
   - `cgpa >= 7.0`
5. **Eligibility Result**: Display `ELIGIBLE` / `NOT_ELIGIBLE` status banner, requirement breakdown matrix, and simulated proof hash digest (`0x...`).

---

## Phase 2: Post-Hackathon Midnight ZK Privacy Integration Blueprint

The post-hackathon phase builds directly on top of the pre-hackathon foundation, replacing simulated proof digests with true **Zero-Knowledge (ZK) Proofs** on the **Midnight Privacy Blockchain**.

```
                        POST-HACKATHON ARCHITECTURE
                        ============================

  +-----------------------------------------------------------------------+
  |                   PRE-HACKATHON FOUNDATION (Built)                    |
  |  PDF Upload  ──►  AI JSON Extraction  ──►  Deterministic Rules Engine  |
  +-----------------------------------------------------------------------+
                                      │
                                      ▼ (Witness Input)
  +-----------------------------------------------------------------------+
  |                MIDNIGHT ZK PRIVACY LAYER (Hackathon Phase)            |
  |                                                                       |
  |   +---------------------------------------------------------------+   |
  |   |              Midnight Compact Smart Contract                  |   |
  |   |  - Private Witness State: { branch, year, cgpa, status }     |   |
  |   |  - Public State: { verifiedClaimsCounter, verifierKey }       |   |
  |   |  - ZK Circuit Function: proveEligibilityWitness()              |   |
  |   +---------------------------------------------------------------+   |
  |                                   │                                   |
  |                                   ▼                                   |
  |   +---------------------------------------------------------------+   |
  |   |              Lace / Midnight Wallet & Client SDK               |   |
  |   |  - Client-side Proof Generation                               |   |
  |   |  - On-chain Verification & Public Proof Certificate           |   |
  |   +---------------------------------------------------------------+   |
  +-----------------------------------------------------------------------+
```

---

### 1. Midnight Compact Smart Contract Design

During the hackathon phase, a Midnight Compact contract (`privai_eligibility.compact`) will be implemented:

```compact
// Example Midnight Compact Smart Contract Concept
pragma language_version >= 0.20.0;

contract PrivAIEligibility {
    // Public state stored on Midnight ledger
    export ledger counter: Counter;

    // Private witness struct passed locally by student
    struct StudentWitness {
        branch: Bytes<32>,
        year: Uint<8>,
        cgpaX100: Uint<16>, // e.g. 820 for 8.20
        status: Boolean
    }

    // ZK Circuit method: Proves eligibility without exposing witness values
    export circuit proveEligibility(witness: StudentWitness): Boolean {
        // Enforce criteria inside ZK circuit
        assert witness.status == true "Student status must be active";
        assert witness.branch == "CSE" "Branch must be CSE";
        assert witness.year >= 3 "Academic year must be 3 or above";
        assert witness.cgpaX100 >= 700 "CGPA must be 7.00 or above";

        return true;
    }
}
```

---

### 2. ZK Proof Generation & Verification Workflow

1. **Local Witness Assembly**: The pre-hackathon AI extraction & rules engine generates the student witness tuple `{ branch: "CSE", year: 3, cgpaX100: 820, status: true }`.
2. **Client-Side Proof Generation**: The Midnight JS SDK executes the ZK circuit locally inside the student's browser. The private witness **never leaves the client machine**.
3. **Proof Submission**: The client submits a zero-knowledge proof payload to the Midnight testnet via Lace / Midnight Wallet.
4. **On-Chain Verification**: The Midnight contract verifies the mathematical proof and emits an on-chain **Verified Eligibility Token / Certificate**.
5. **Recruiter Inspection**: Recruiters query the Midnight ledger or present a QR code to confirm that the student satisfies all internship requirements **without ever seeing their raw marksheet or exact CGPA score**.

---

## Pre vs. Post Phase Comparison

| Dimension | Pre-Hackathon Foundation (Implemented) | Post-Hackathon Midnight Integration |
| :--- | :--- | :--- |
| **Document Parsing** | PDF Text Extractor + Gemini AI | Unchanged (Reused as local witness generator) |
| **Eligibility Decision** | Deterministic JS Rules Engine | Compact Smart Contract ZK Circuits |
| **Proof Format** | Simulated SHA-256 Digest (`0x...`) | Real On-Chain Zero-Knowledge Proof (ZK-SNARK) |
| **Data Storage** | Isolated MongoDB Collections | Off-chain Local Witness + On-chain Midnight State |
| **Recruiter Verification** | REST API Proof Digest Lookup | On-chain Midnight Ledger Verification |
| **Wallet Integration** | JWT Authentication | Lace / Midnight Wallet |

---

## Conclusion

The **Pre-Hackathon Foundation** provides a fully functional, production-ready web application that handles PDF ingestion, AI extraction, deterministic eligibility checking, and privacy-first UX.

The code is cleanly modularized so that during the **Hackathon Implementation Phase**, the Midnight ZK prover and Lace wallet SDK can be added as a separate service layer without rewriting the core application.
