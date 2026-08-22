export function assertUnreachable(segment: never): never {
  throw new Error(`Unhandled auth segment: ${segment}`);
}
