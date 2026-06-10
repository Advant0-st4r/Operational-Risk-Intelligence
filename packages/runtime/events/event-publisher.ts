export interface EventPublisher {
  publish(
    event: object,
  ): Promise<void>;
}