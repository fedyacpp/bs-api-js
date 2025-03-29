# Brawl Stars API Client (JS/TS)

A fully typed JavaScript/TypeScript client for the official [Brawl Stars API](https://developer.brawlstars.com/), designed for Node.js environments.

## Features

*   **Fully Typed:** Written in TypeScript for strong type safety and excellent editor autocompletion.
*   **Complete API Coverage:** Implements all documented v1 API endpoints.
*   **Promise-Based:** Uses async/await for clean asynchronous operations.
*   **Interactive Test CLI:** Includes an interactive command-line tool to easily test all API functions.

## Installation

```bash
npm install @fedyacpp/bs-api-js
# or
yarn add @fedyacpp/bs-api-js
```

## Configuration

### API Key

You **must** obtain an API key (JWT) from the [Brawl Stars Developer Portal](https://developer.brawlstars.com/).

The recommended way to provide the API key to the client is through an environment variable named `BRAWL_STARS_API_KEY`.

**Example (PowerShell):**
```powershell
$env:BRAWL_STARS_API_KEY = 'YOUR_API_KEY'
```

**Example (Bash/Zsh):**
```bash
export BRAWL_STARS_API_KEY='YOUR_API_KEY'
```

Replace `YOUR_API_KEY` with your actual key.

You can also pass the key directly to the constructor, but who really does this?

## Usage

```typescript
import { BrawlStarsClient, BrawlStarsApiError, Player } from '@fedyacpp/bs-api-js';

// Retrieve the API key from environment variables
const apiKey = process.env.BRAWL_STARS_API_KEY;

if (!apiKey) {
  console.error('Error: BRAWL_STARS_API_KEY environment variable not set.');
  process.exit(1);
}

// Initialize the client
const client = new BrawlStarsClient(apiKey);

// Example: Fetch player data
async function getPlayerData(playerTag: string) {
  try {
    console.log(`Fetching player data for tag: ${playerTag}...`);
    const player: Player = await client.getPlayer(playerTag);

    console.log(`\nPlayer Name: ${player.name}`);
    console.log(`Trophies: ${player.trophies}`);
    console.log(`Highest Trophies: ${player.highestTrophies}`);
    const clubName = (player.club && typeof player.club === 'object' && 'name' in player.club) ? player.club.name : 'N/A';
    console.log(`Club: ${clubName}`);

    if (player.brawlers.length > 0) {
      console.log(`\nTop Brawler: ID ${player.brawlers[0].id} (Trophies: ${player.brawlers[0].trophies})`);
    }

  } catch (error) {
    if (error instanceof BrawlStarsApiError) {
      console.error(`API Error (${error.statusCode || 'N/A' }): ${error.message}`);
      if (error.errorData) {
        console.error(`Reason: ${error.errorData.reason}`);
      }
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}

// Example usage
const examplePlayerTag = '#PLAYER_TAG'; // TODO: Replace with a real tag
if (examplePlayerTag !== '#PLAYER_TAG') {
    getPlayerData(examplePlayerTag);
} else {
    console.warn("Please replace '#PLAYER_TAG' in the example code with a valid player tag.");
}

```

## API Client Methods

The client instance provides the following methods, corresponding to the API endpoints:

*   **Players**
    *   `getPlayer(playerTag: string): Promise<Player>`
    *   `getPlayerBattleLog(playerTag: string): Promise<BattleList>`
*   **Clubs**
    *   `getClub(clubTag: string): Promise<Club>`
    *   `getClubMembers(clubTag: string, options?: PagingOptions): Promise<ClubMemberList>`
*   **Brawlers**
    *   `getBrawlers(options?: PagingOptions): Promise<BrawlerList>`
    *   `getBrawler(brawlerId: number | string): Promise<BrawlerDefinition>`
*   **Rankings**
    *   `getPlayerRankings(countryCode: string, options?: PagingOptions): Promise<PlayerRankingList>`
    *   `getClubRankings(countryCode: string, options?: PagingOptions): Promise<ClubRankingList>`
    *   `getBrawlerRankings(countryCode: string, brawlerId: number | string, options?: PagingOptions): Promise<PlayerRankingList>`
*   **Events**
    *   `getEventRotation(): Promise<ScheduledEvents>`

Where `PagingOptions` is an object: `{ limit?: number; after?: string; before?: string }`.

All methods return Promises that resolve with the corresponding typed data (see `src/types.ts`) or reject with a `BrawlStarsApiError`.

## Error Handling

API errors are thrown as `BrawlStarsApiError` instances, extending the built-in `Error` class. They contain:

*   `message`: The error message from the API or the request.
*   `statusCode`: The HTTP status code (e.g., 403, 404, 429).
*   `errorData`: The original JSON error object returned by the API (if available), containing `reason`, `message`, `type`, etc.

```typescript
import { BrawlStarsApiError } from '@fedyacpp/bs-api-js';

try {
  const data = await client.getPlayer('#INVALID-TAG');
  // ... process data
} catch (error) {
  if (error instanceof BrawlStarsApiError) {
    console.error(`API Error: ${error.message}`);
    console.error(`Status Code: ${error.statusCode}`);
    if (error.errorData) {
        console.error(`API Reason: ${error.errorData.reason}`);
        console.error('Full Error Data:', error.errorData);
    }
  } else {
    // Handle other unexpected errors (network issues, etc.)
    console.error('Unknown error:', error);
  }
}
```

## Interactive Test CLI

This package includes an interactive command-line tool to easily test all client functions directly against the API.

**Requirements:**

1.  Node.js installed.
2.  `BRAWL_STARS_API_KEY` environment variable must be set (see [Configuration](#configuration)).

**Running the CLI:**

1.  Navigate to the package's root directory in your terminal.
2.  Install development dependencies: `npm install`
3.  Run the CLI script: `npm run test:cli`

The script will build the project if necessary and then launch an interactive prompt (using `inquirer`) asking which API function you want to test. Follow the prompts to enter required tags, IDs, country codes, or paging options.

## Project Structure

*   `/src`: Contains the TypeScript source code.
    *   `client.ts`: The main `BrawlStarsClient` class implementation.
    *   `types.ts`: TypeScript interfaces for all API data models and responses.
    *   `index.ts`: Entry point, exports the client and types.
    *   `test-cli.ts`: The source code for the interactive test CLI.
*   `/dist`: Contains the compiled JavaScript code and declaration files (`.d.ts`), generated by running `npm run build`. This is what gets published and used when the package is imported.
*   `package.json`: NPM package configuration, scripts, and dependencies.
*   `tsconfig.json`: TypeScript compiler configuration.
*   `definition.txt`: The original API definition provided (for reference).

## Building

To compile the TypeScript code to JavaScript in the `dist` directory, run:

```bash
npm run build
```

## Contributing

Contributions, issues, and feature requests are welcome! Please feel free to open an issue or submit a pull request.

## License

MIT 
