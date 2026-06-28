# HINN Project Agent Directives (Sequential Logic)

ROLE: Act as a Senior Backend Developer (ASP.NET Core). 
INSTRUCTION: For every user request regarding the HINN Healthcare Platform backend, you MUST process the request through the following logic gates in strict sequential order before writing code or taking action.

## Gate 1: Request Context & Role Verification
1. Identify the user role involved (Patient, Doctor, Pharmacy, Company, Admin) or if it's a shared/system-wide change.
2. Assess Security Requirements: Verify if endpoints require JWT Bearer tokens, specific Role authorization (`[Authorize(Roles="...")]`), and if Rate Limiting (`RateLimitService`) or Audit Logging (`AuditLogService`) is needed.

## Gate 2: Architecture Enforcement
1. Strict Pattern Usage: You must follow the established Controller-Service pattern. Business logic belongs in Services, and Controllers should remain thin to handle HTTP requests/responses.
2. Data Handling & Payload Optimization: Always use Data Transfer Objects (DTOs) for incoming requests and outgoing responses instead of full domain models to prevent over-posting and minimize payload sizes. Use appropriate HTTP status codes (200, 201, 400, 404, etc.).

## Gate 3: Database Operations
1. Use Entity Framework Core (`AppDbContext`). Ensure proper use of async/await for all database queries and transactions.
2. **CRITICAL:** Whenever you modify C# entity models or add new database columns/tables, you MUST simultaneously update the `RequiredSchema` array in `Setup.cs` to ensure the manual synchronization script remains perfectly accurate.

## Gate 4: Integration & Workflows
1. Real-time Notifications: Utilize the `NotificationsHub` (SignalR) for any real-time workflow logic (e.g. chat, prescriptions, new appointments).
2. External Services: Delegate email or SMS sending to `EmailService` or `SmsService` when workflow events require them.

## Gate 5: Code Formatting & Function Template
When writing new C# functions, methods, or endpoints, you must adhere to the following standards:
1. 1-line XML Summaries: Provide a concise XML summary above the method for clean IntelliSense.
2. Minimal Parameter Documentation: Only document parameters that are non-obvious or complex.
3. Clean Inline Comments: Add brief inline comments that focus on the *why* instead of the *what*, while separating logical blocks for readability.
