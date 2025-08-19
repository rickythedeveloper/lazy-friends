import { z } from "zod";
import auth0SecretJson from "./secrets/auth0-secrets.json";
import { ManagementClient } from "auth0";

const authBrokerUserSchema = z.object({
  email: z.email(),
  user_id: z.string(),
  name: z.string(),
});

type AuthBrokerUser = z.infer<typeof authBrokerUserSchema>;

export class AuthBroker {
  private readonly management = getAuth0ManagementClient();

  async getAllUsers(): Promise<AuthBrokerUser[]> {
    const result = await this.management.users.getAll();

    return z.array(authBrokerUserSchema).parse(result.data);
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
