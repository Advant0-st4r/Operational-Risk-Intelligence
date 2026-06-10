This file maps out progression of this project's development.



Version 0 — Executable Skeleton

Goal:

Prove:
  OperationalCase can exist

Capability:

Create Case
View Case
Persist Case

Contains:

OperationalCase
CaseRepository
CreateCaseCommand
CreateCaseHandler
IncidentIntakeWorkflow
CaseCreatedEvent

Success metric:

Case Lifecycle:
  observed

Nothing else matters yet.

Version 1 — Operational Awareness

Goal:

Answer:
  What happened?

Capability:

Signal
→ Case
→ Timeline

Contains:

CaseTimeline
TimelineRepository
Severity
Timeline Events

User can:

Create Case
Assign Severity
Track Events
View History

Success metric:

Operational visibility:
  achieved
Version 2 — Understanding Engine

Goal:

Answer:
  Why is this happening?

Capability:

Evidence
→ Root Cause
→ Cognition Advancement

Contains:

Cognition
RootCause
CognitionTimeline
IdentifyRootCauseCommand
CognitionAdvancementWorkflow

User can:

Move:
  observed
    ↓
  understood

This is the first version where the platform becomes cognition-oriented rather than incident-oriented.

Version 3 — Decision Support

Goal:

Answer:
  What should we do?

Capability:

Understanding
    ↓
Resolution Selection
    ↓
Execution Candidate

Contains:

Resolution
Priority
ResolutionSelectionWorkflow

User can:

Compare:
  possible actions

Select:
  preferred action

Success metric:

Decision support:
  achieved