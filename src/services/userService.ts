import { userQueries, addressQueries, User, ChainAddress } from '../db/database';

export class UserService {
  getUserByUsername(username: string): User | undefined {
    return userQueries.findByUsername.get(username) as User | undefined;
  }

  createUser(username: string, displayName?: string): number {
    const result = userQueries.create.run(username, displayName || username);
    return result.lastInsertRowid as number;
  }

  getUserAddresses(userId: number): ChainAddress[] {
    return addressQueries.findByUserId.all(userId) as ChainAddress[];
  }

  addUserAddress(
    userId: number,
    chainName: string,
    address: string
  ): number {
    const result = addressQueries.create.run(userId, chainName, address);
    return result.lastInsertRowid as number;
  }

  getFormattedAddresses(userId: number): Record<string, any> {
    const addresses = this.getUserAddresses(userId);
    const formatted: Record<string, any> = {};

    // Optional: Chain ID mapping for EVM chains (can be added at API layer if needed)
    const chainIdMap: Record<string, number> = {
      ethereum: 1,
      polygon: 137,
      arbitrum: 42161,
      optimism: 10,
      base: 8453,
    };

    for (const addr of addresses) {
      formatted[addr.chain_name] = {
        address: addr.address,
        // Optionally include chainId for EVM chains
        ...(chainIdMap[addr.chain_name] && { chainId: chainIdMap[addr.chain_name] }),
      };
    }

    return formatted;
  }
}

export const userService = new UserService();

