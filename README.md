# PrivAI
## *"Prove it. Don't reveal it."*

PrivAI is an AI-powered, privacy-focused student eligibility verification platform designed to verify academic qualifications for internships and jobs without forcing students to expose their raw certificates or sensitive personal data.

> [!IMPORTANT]
> **Pre-Hackathon Foundation Note**:  
> **"Midnight privacy integration is intentionally reserved for the hackathon implementation phase."**  
> This version establishes the complete AI document extraction, deterministic rules engine, REST API, MongoDB data separation, and privacy-first UX foundation ready for seamless Midnight ZK prover integration.

---

## 1. Core Problem & Solution

### Problem
When students apply for internships or academic programs, they are often required to upload complete academic transcripts, certificates, or marksheets. This practice exposes excessive personal information (home address, date of birth, roll numbers, individual subject marks).

### Solution
PrivAI separates raw document text from derived eligibility claims:
1. **AI Extraction**: Parses PDF documents into strict, structured JSON (Branch, Year, CGPA, Enrollment Status).
2. **Deterministic Rules Engine**: Evaluates extracted facts objectively against internship requirements without relying on LLM guesswork.
3. **Privacy-Preserving Proofs**: Generates a shareable eligibility claim proof digest so recruiters can verify eligibility while raw documents remain 100% private.

---

## 2. Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router v6, Axios, Lucide React Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB & Mongoose (Includes automatic In-Memory MongoDB fallback for zero-configuration setup).
- **AI Processing**: Google Gemini API (`@google/genai`) or OpenAI API, with built-in **Demo Mode Provider** fallback.
- **Document Processing**: `pdf-parse` for text extraction & SHA-256 integrity hashing.
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing.
- **Testing**: Jest & Supertest.

---

## 3. Application Architecture

```
[Uploaded Academic PDF]
       │
       ▼
[PDF Text Extractor (pdf-parse)]
       │
       ▼
[AI Extraction Service (Gemini / OpenAI / Demo Provider)]
       │ (Strict Zod Schema Validation)
       ▼
[Extracted Structured Data (Branch, Year, CGPA, Status)]
       │
       ▼
[Deterministic Rules Engine] ──► (Branch=="CSE", Year>=3, CGPA>=7.0, Status==Active)
       │
       ▼
[Structured Eligibility Result & ZK-Ready Proof Hash]
       │
       ▼
[Privacy UX "What is Shared?" Matrix & Verification Audit Log]
```

---

## 4. Default Internship Eligibility Requirements

PrivAI's rules engine evaluates candidate data against standard internship criteria:

| Requirement | Condition | Evaluation Type |
| :--- | :--- | :--- |
| **Student Status** | `Active Enrollment == true` | Boolean Match |
| **Branch** | `Branch == 'CSE'` | Normalized String Match (CSE / Computer Science) |
| **Academic Year** | `Year >= 3` | Numeric Greater-Than-Or-Equal |
| **CGPA** | `CGPA >= 7.0` | Precision Float Greater-Than-Or-Equal |

---

## 5. Getting Started & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Step 1: Clone & Install Dependencies

```bash
# Clone repository
git clone https://github.com/privai/privai.git
cd PrivAi

# Install root dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### Step 2: Configure Environment Variables

Create `.env` in the root directory (or copy `.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/privai
JWT_SECRET=privai_secure_jwt_token_secret_key_2026_dev
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

> *Note: If `GEMINI_API_KEY` is left empty or local MongoDB is unavailable, PrivAI automatically falls back to In-Memory MongoDB and Demo Mode, allowing immediate out-of-the-box execution!*

### Step 3: Run Application

```bash
# Run both Backend API (Port 5000) and Frontend Client (Port 5173) concurrently:
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 6. Running Automated Tests

PrivAI includes comprehensive unit tests for the deterministic eligibility rules engine and AI response schema validation:

```bash
# Run server test suite
npm run test
```

---

## 7. REST API Documentation

### Auth Endpoints
- `POST /api/auth/register` — Register a new student account.
- `POST /api/auth/login` — Authenticate user & return JWT token.
- `GET  /api/auth/me` — Fetch current user profile.

### Document Endpoints
- `POST /api/documents/upload` — Upload PDF academic transcript (Max 5MB).
- `POST /api/documents/demo-sample` — Load a 1-click demo sample document.
- `GET  /api/documents` — List user's uploaded documents.
- `GET  /api/documents/:id` — Get document details.

### AI Analysis Endpoints
- `POST /api/analysis/:documentId` — Run AI schema extraction on uploaded PDF.
- `GET  /api/analysis/:documentId` — Get analysis result.

### Eligibility Endpoints
- `POST /api/eligibility/check` — Evaluate extracted fields using deterministic rules engine.
- `GET  /api/eligibility/history` — Get user verification history.
- `GET  /api/eligibility/:id` — Get specific eligibility check result and proof digest.

---

## 8. Privacy-First UX Matrix ("What is shared?")

PrivAI enforces strict data minimization:

| Data Attribute | Visibility | Storage Location |
| :--- | :--- | :--- |
| **Raw PDF Transcript** | 🔒 **PRIVATE** | Encrypted / Private Storage |
| **Student Full Name** | 🔒 **PRIVATE** | Private User Document Store |
| **Exact CGPA & Subject Grades** | 🔒 **PRIVATE** | Isolated Extracted Facts |
| **Eligibility Claim (ELIGIBLE)** | 🟢 **SHAREABLE** | Public Verification Digest |

---

## 9. Future Midnight Zero-Knowledge Roadmap

In the upcoming hackathon implementation phase, PrivAI will incorporate:
- **Midnight Compact Contracts**: Smart contracts compiled for Midnight network.
- **ZK Circuit Proofs**: Proving `CGPA >= 7.0` and `Year >= 3` on-chain without revealing actual values.
- **Lace / Midnight Wallet**: Wallet connection for signing and presenting eligibility claims.

---

## License

ISC License. Built for the PrivAI Hackathon Foundation.
