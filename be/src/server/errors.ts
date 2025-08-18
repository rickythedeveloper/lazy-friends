export class AnyError extends Error {
  constructor(
    message?: string,
    public err?: unknown,
  ) {
    super(message);
  }
}

export class AuthorizationError extends AnyError {}

export class DbError extends AnyError {}
