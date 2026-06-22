# Client Portal

Kord Support is primarily a client-facing support portal. Internal CRM, object passports and integrations exist to make client communication faster and simpler than Telegram.

## Core principles

### 1. Client portal first

The client must be able to:

- open the portal quickly;
- select an object;
- select a problem category;
- start a chat with support;
- see only their own requests.

### 2. No priority selector for clients

Clients do not choose `urgent`, `critical` or other priorities.

They choose what happened. The system and engineers decide the internal priority.

### 3. One account sees only own tickets

Strict rule:

```text
One account = one person = only their own tickets.
```

No exceptions for owner, manager or accountant in the first product version.

If somebody else must join a specific request, access is granted explicitly for that ticket only in a future collaboration feature.

## Ticket categories

Client-facing categories:

- Venue is down;
- Cash register problem;
- Payment problem;
- Printer problem;
- iiko problem;
- EGAIS problem;
- Chestny Znak problem;
- Equipment problem;
- Settings change;
- Consultation;
- Documents;
- Other.

The UI must ask: `What happened?`, not `What priority?`.

## MVP flow

```text
Client opens portal
↓
Selects object
↓
Selects category
↓
Answers 1-3 short questions
↓
Chat opens
↓
System creates ticket
↓
Engineer replies online
```

## Authentication direction

MVP direction:

- contacts are created by engineer in CRM;
- invite link activates account;
- login is passwordless by one-time code;
- user sessions are stored as trusted devices later.

No public self-registration in the first version.
