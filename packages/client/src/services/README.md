# Benchling MCP Client

This service connects to the Benchling MCP Server to fetch life sciences data for visualization.

## Setup

### 1. Install Benchling MCP Server

The Benchling MCP Server is a Python package that needs to be installed separately:

```bash
# Using pipx (recommended)
pipx install benchling-mcp-server

# Or using uv
uv tool install benchling-mcp-server
```

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Benchling credentials in `.env.local`:
   ```
   VITE_BENCHLING_URL=https://yourcompany.benchling.com
   VITE_BENCHLING_CLIENT_ID=your_client_id
   VITE_BENCHLING_CLIENT_SECRET=your_client_secret
   ```

### 3. Obtain Benchling Credentials

1. Log in to your Benchling account
2. Go to **Settings > Developer Console**
3. Create a new App or use an existing one
4. Select **"Client Credentials"** grant type
5. Copy the **Client ID** and **Client Secret**
6. Set the appropriate scopes for your app:
   - `read:dna_sequences`
   - `read:custom_entities`
   - `read:assay_results`
   - `read:containers`
   - `read:plates`
   - `read:boxes`
   - `read:entries`

## Usage

```typescript
import {BenchlingMCPClient} from './services/BenchlingMCPClient';

const client = new BenchlingMCPClient();

// Connect to Benchling
await client.connect();

// Fetch DNA sequences
const sequences = await client.listDNASequences({
  name_includes: 'plasmid',
  max_results: 10
});

// Fetch assay results
const results = await client.listAssayResults({
  schema_id: 'assaysch_abc123',
  created_at_gte: '2024-01-01'
});

// Disconnect when done
await client.disconnect();
```

## Available Methods

### DNA Sequences
- `listDNASequences(filters?)` - List DNA sequences
- `getDNASequence(sequenceId)` - Get a specific DNA sequence

### Custom Entities (Registry)
- `listCustomEntities(filters?)` - List custom entities
- `getCustomEntity(entityId)` - Get a specific custom entity

### Assay Results
- `listAssayResults(filters?)` - List assay results
- `getAssayResult(resultId)` - Get a specific assay result

### Inventory
- `listContainers(filters?)` - List containers
- `getContainer(containerId)` - Get a specific container
- `listPlates(filters?)` - List plates
- `getPlate(plateId)` - Get a specific plate
- `listBoxes(filters?)` - List boxes
- `getBox(boxId)` - Get a specific box

### Notebook Entries
- `listNotebookEntries(filters?)` - List notebook entries
- `getNotebookEntry(entryId)` - Get a specific notebook entry

## Error Handling

The client will throw errors if:
- Connection to Benchling MCP Server fails
- Invalid credentials are provided
- API calls fail
- Response parsing fails

Always wrap calls in try-catch blocks:

```typescript
try {
  await client.connect();
  const sequences = await client.listDNASequences();
} catch (error) {
  console.error('Benchling error:', error);
}
```

