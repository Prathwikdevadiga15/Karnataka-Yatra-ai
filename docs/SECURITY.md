# Karnataka Yatra AI — Security & Privacy Architecture

## 1. Principles
- **No Client Cost Trust:** Financial calculations, driving distances, and coordinate mathematics are strictly computed by the Python backend. The frontend cannot dictate arbitrary calculations.
- **SQL Parameterization:** All database operations utilize SQLAlchemy 2.0 ORM expressions, preventing SQL injection vulnerabilities.
- **Zero Plaintext Credentials:** Secrets (Azure keys, database connection strings) are loaded strictly via environment variables. Default templates use `.env.example` with non-sensitive placeholders.
- **Strict Input Validation:** Pydantic models enforce type safety, bounds checks (duration 1-14 days, budget min ₹1,000, travellers 1-20), and string length limits on all endpoints.
- **CORS Restrictions:** Configured via `ALLOWED_ORIGINS` environment variable, defaulting to trusted local development origins.
- **Microphone & Voice Privacy:** Audio capture is handled via browser Web Speech API on user consent; no audio streams are persistently logged or stored on server disks without permission.
- **No Hallucinated Fact Claims:** The RAG system explicitly tags sources with verification badges.
