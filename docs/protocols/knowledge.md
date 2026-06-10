| Component                    | 1-Line Functional Encapsulation                                            |
| ---------------------------- | -------------------------------------------------------------------------- |
| `routes`                     | **Receives requests and sends them to the correct business capability.**   |
| `controller`                 | **Translates external input into internal domain operations.**             |
| `service`                    | **Executes business rules and orchestration.**                             |
| `repository`                 | **Provides a consistent way to retrieve and persist domain truth.**        |
| `adapter`                    | **Translates between your system and an external technology or protocol.** |
| `entity`                     | **Defines what exists in the business domain.**                            |
| `contract/interface`         | **Defines what is allowed without specifying how it is done.**             |
| `versioning.service`         | **Determines how truth changes over time.**                                |
| `deduplication.service`      | **Determines whether two observations represent the same reality.**        |
| `pattern-extraction.service` | **Converts historical reality into reusable operational knowledge.**       |


Ownership classification = **the degree to which a decision encodes your unique judgment/business philosophy versus generic industry knowledge that could be safely generated or borrowed.**
