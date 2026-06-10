import type { EventPublisher }
  from '../../runtime/events/event-publisher';

export class InMemoryEventPublisher
  implements EventPublisher
{
  private readonly events: object[] = [];

  async publish(
    event: object,
  ): Promise<void> {
    this.events.push(event);
  }

  getEvents(): readonly object[] {
    return this.events;
  }
}