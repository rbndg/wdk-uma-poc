# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- SQLite3

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp env.example .env
```

Edit `.env` if needed to customize:
- `PORT`: Server port (default: 3000)
- `BASE_URL`: Your server's public URL
- `DB_PATH`: SQLite database path (default: ./data/uma.db)

### 3. Initialize Database

```bash
npm run db:init
```

This will:
- Create the SQLite database
- Set up the schema (users, chain_addresses, payment_requests tables)
- Seed with an example user "alice" and multi-chain addresses

### 4. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000` (or your configured port).

## Testing

### Run Automated Test Suite

```bash
npm test
```

The test suite will:
1. Erase any existing test database
2. Initialize a fresh database with schema
3. Create a test user with Spark and multi-chain addresses
4. Generate UMA lookup responses
5. Generate Lightning invoices
6. Verify all addresses are properly formatted
7. Test error handling and constraints

### Manual API Testing

#### Test UMA Lookup (First Request)

```bash
curl http://localhost:3000/.well-known/lnurlp/alice
```

Expected response:
```json
{
  "callback": "http://localhost:3000/.well-known/lnurlp/alice",
  "maxSendable": 100000000,
  "minSendable": 1000,
  "metadata": "[[\"text/plain\", \"Pay to Alice Smith\"]]",
  "currencies": [...],
  "payerData": {...},
  "umaVersion": "1.0",
  "commentAllowed": 255
}
```

### Test UMA Pay Request (Second Request with Amount)

```bash
curl "http://localhost:3000/.well-known/lnurlp/alice?amount=1000&nonce=test123"
```

Expected response:
```json
{
  "pr": "lnbc1u1p0mock0invoice...",
  "routes": [],
  "payeeData": {
    "chains": {
      "ethereum": {
        "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        "chainId": 1
      },
      "polygon": {
        "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        "chainId": 137
      },
      ...
    }
  },
  "disposable": false,
  "successAction": {
    "tag": "message",
    "message": "Payment received! Thank you for paying Alice Smith."
  }
}
```

## Adding New Users

You can add new users directly to the database or create an admin API. For now, use SQLite directly:

```bash
sqlite3 data/uma.db
```

```sql
-- Add a new user
INSERT INTO users (username, display_name) VALUES ('bob', 'Bob Johnson');

-- Add addresses for the user (get user_id from previous insert)
INSERT INTO chain_addresses (user_id, chain_name, address, chain_id) 
VALUES (2, 'ethereum', '0xYourAddressHere', 1);
```

## Production Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Environment Variables for Production

Update `.env` with your production values:

```bash
PORT=3000
BASE_URL=https://your-domain.com
DB_PATH=/var/lib/uma/uma.db
```

## Spark SDK Integration

The implementation includes **Spark SDK integration** with the following features:

### Spark Address Embedding

The system automatically embeds Spark addresses in Lightning invoices:

- When a user has a Spark identity pubkey (stored as `chain_name='spark'`), it gets embedded in the invoice
- The invoice includes a 36-byte Spark address (`SPK:identitypubkey`) in the fallback field
- Spark wallets can detect this and initiate instant Spark-to-Spark transfers
- Non-Spark wallets simply process it as a regular Lightning payment

### How It Works

```typescript
// Invoice is created with embedded Spark address
const invoice = await sparkClient.createLightningInvoice({
  amount_msat: amountMsats,
  description: "Payment to alice",
  includeSparkAddress: true,  // Embeds SPK:pubkey in fallback field
  receiverIdentityPubkey: userSparkPubkey  // Optional: for other users
});
```

### Adding Spark Identity to Users

You can add Spark identity pubkeys as addresses:

```sql
INSERT INTO chain_addresses (user_id, chain_name, address) 
VALUES (1, 'spark', '0250949ec35b022e3895fd37750102f94fe813523fa220108328a81790bf67ade5');
```

## Troubleshooting

### Database locked error
- Make sure only one instance of the server is running
- Check file permissions on the database directory

### Port already in use
- Change the PORT in `.env`
- Or kill the process using the port: `lsof -ti:3000 | xargs kill`

### Dependencies not installing
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then reinstall

