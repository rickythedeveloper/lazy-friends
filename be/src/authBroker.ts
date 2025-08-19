import { z } from "zod";
import auth0SecretJson from "./secrets/auth0-secrets.json";
import { ManagementClient } from "auth0";

interface AuthBrokerUser {
  userId: string;
  email: string;
  name: string;
}

export interface AuthBroker {
  getAllUsers(): Promise<AuthBrokerUser[]>;
  getUsersByEmail(email: string): Promise<AuthBrokerUser[]>;
}

export class AuthBrokerImpl implements AuthBroker {
  private readonly management = getAuth0ManagementClient();

  async getAllUsers(): Promise<AuthBrokerUser[]> {
    const result = await this.management.users.getAll();

    return result.data.map(
      (user): AuthBrokerUser => ({
        userId: user.user_id,
        email: user.email,
        name: user.name,
      }),
    );
  }

  async getUsersByEmail(email: string): Promise<AuthBrokerUser[]> {
    const result = await this.management.usersByEmail.getByEmail({
      email,
    });

    return result.data.map(
      (user): AuthBrokerUser => ({
        userId: user.user_id,
        email: user.email,
        name: user.name,
      }),
    );
  }
}

function getAuth0ManagementClient() {
  const { domain, clientId, clientSecret } = z
    .object({
      domain: z.string(),
      clientId: z.string(),
      clientSecret: z.string(),
    })
    .parse(auth0SecretJson);
  return new ManagementClient({
    domain,
    clientId,
    clientSecret,
  });
}
