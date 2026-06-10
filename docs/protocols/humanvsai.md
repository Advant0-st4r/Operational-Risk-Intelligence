AI:
  most of the code implementation
  helpers
  boilerplate
  enforcement
  execution

Human:
  meaning
  judgment
  constraints
  accountability


# Human Aspect

The implementation may be AI-generated.

The architecture is not.

A block is considered human-owned only when the following are provided by a human decision-maker.

## Meaning

* Domain boundaries defined.
* Responsibilities assigned.
* Ownership decisions made.
* Concepts distinguished from one another.
* Vocabulary frozen.

Examples:

* What is an Incident?
* What is Severity?
* What is Priority?
* What is a Duplicate?
* What evidence constitutes Understanding?

## Judgment

* Tradeoffs explicitly chosen.
* Ambiguities resolved.
* Conflicting interpretations decided.
* Organizational policy encoded.

Examples:

* Severity derives from Impact and Urgency.
* Different root causes cannot be duplicates.
* False positives are more expensive than false negatives.
* Validation requires outcome confirmation.

## Constraints

* What the system may do.
* What the system may never do.
* Acceptable failure modes.
* Non-negotiable invariants.

Examples:

* Severity history must be preserved.
* Root cause is required before Acted Upon.
* Default deny for unspecified transitions.

## Accountability

* Decision owner identified.
* Rationale recorded.
* Open questions recorded.
* Rejected alternatives recorded when material.

## Continuity

A new engineer, operator, or LLM can determine:

* Why the decision exists.
* What assumptions were made.
* What remains unresolved.
* What must not be changed accidentally.

If these are absent, the block may be implemented but is not human-complete.
