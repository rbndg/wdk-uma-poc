# Test Suite

## Overview

This directory contains integration tests for the UMA backend service.

## Running Tests

```bash
npm test
```

## What the Tests Cover

### 1. Database Cleanup
- Removes any existing test database
- Ensures clean state for testing

### 2. Database Initialization
- Creates fresh database with schema
- Verifies all tables are created (users, chain_addresses, payment_requests)

### 3. User Creation
- Creates a test user
- Verifies user can be retrieved
- Checks username and display name

### 4. Chain Address Management
- Adds multiple chain addresses (Spark, Ethereum, Polygon, Solana)
- Verifies addresses are stored correctly
- Tests retrieval of addresses

### 5. Formatted Address Output
- Tests the service layer formatting
- Verifies chainId is added for EVM chains
- Checks JSON structure matches expected format

### 6. UMA Lookup Response
- Generates UMA lookup response (first request, no amount)
- Verifies callback URL, min/max sendable amounts
- Checks UMA version and metadata

### 7. UMA Pay Response (Invoice Generation)
- Generates Lightning invoice with amount and nonce
- Verifies invoice format (bolt11)
- Checks payeeData contains all chain addresses
- Tests that Spark address is embedded in the invoice

### 8. Error Handling
- Tests non-existent user scenarios
- Verifies proper null/undefined returns

### 9. Database Constraints
- Tests unique username constraint
- Tests unique chain_name per user constraint
- Verifies proper error handling

## Test Output

The test suite provides colorized output:
- 🔵 Blue headers for test sections
- ✓ Green checkmarks for passed assertions
- ✗ Red X for failures
- 🟡 Yellow for detailed information

## Example Output

```
════════════════════════════════════════════
  UMA Backend Integration Test Suite
════════════════════════════════════════════

[Test 1] Database Cleanup
─────────────────────────────────────────
✓ Removed existing test database
✓ Database file should not exist

[Test 2] Database Initialization
─────────────────────────────────────────
✓ Database file should be created
✓ All three tables should be created

[Test 3] User Creation
─────────────────────────────────────────
✓ User should be created with ID: 1
✓ User should be retrievable
✓ Username should match
✓ Display name should match
   User ID: 1
   Username: testuser
   Display Name: Test User

...

════════════════════════════════════════════
  ✓ All Tests Passed!
════════════════════════════════════════════
```

## Test Database

- Uses a separate test database: `./data/test-uma.db`
- Automatically cleaned up after tests complete
- Does not affect production database

## Continuous Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run Tests
  run: npm test
```

## Adding New Tests

To add new tests, edit `integration.test.ts` and follow the existing pattern:

```typescript
log('\n[Test N] Your Test Name', colors.blue);
log('─────────────────────────────────────────', colors.blue);

// Your test code here
assert(condition, 'Description of what should be true');
```

## Known Limitations

- Tests may show warnings about Spark SDK if not fully initialized
- This is expected behavior and does not indicate test failure
- Invoice generation will work once Spark SDK is properly integrated

