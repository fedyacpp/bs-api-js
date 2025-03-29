import inquirer from 'inquirer';
import { BrawlStarsClient, BrawlStarsApiError, PagingOptions } from './index';

const printJson = (data: any) => {
  console.log('\n--- Result ---');
  console.log(JSON.stringify(data, null, 2));
  console.log('--------------\n');
};

const handleError = (error: unknown) => {
    console.error('\n--- Error ---');
    if (error instanceof BrawlStarsApiError) {
      console.error(`API Error (${error.statusCode || 'N/A'}): ${error.message}`);
      if (error.errorData) {
        console.error('Details:', JSON.stringify(error.errorData, null, 2));
      }
    } else if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unknown error occurred:', error);
    }
    console.error('-------------\n');
};

const apiKey = process.env.BRAWL_STARS_API_KEY;
if (!apiKey) {
  console.error('Error: BRAWL_STARS_API_KEY environment variable is not set.');
  console.error('Please set it before running the CLI.');
  process.exit(1);
}

const client = new BrawlStarsClient(apiKey);

const askPaging = [
    {
        type: 'confirm',
        name: 'usePaging',
        message: 'Add paging options (limit, after, before)?',
        default: false,
    },
];

const pagingQuestions = [
    {
        type: 'input',
        name: 'limit',
        message: 'Limit (optional, press Enter to skip):',
        filter: (input: string) => input ? parseInt(input.trim(), 10) : undefined,
        validate: (input?: number) => input === undefined || !isNaN(input) || 'Please enter a valid number or leave blank.',
        when: (answers: any) => answers.usePaging,
    },
    {
        type: 'input',
        name: 'after',
        message: 'After marker (optional, press Enter to skip):',
        filter: (input: string) => input.trim() || undefined,
        when: (answers: any) => answers.usePaging,
    },
    {
        type: 'input',
        name: 'before',
        message: 'Before marker (optional, press Enter to skip):',
        filter: (input: string) => input.trim() || undefined,
        when: (answers: any) => answers.usePaging,
    },
];

async function runInteractiveCLI() {
  console.log('Brawl Stars API Interactive Test CLI');
  console.log('====================================');

  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Choose an API function to test:',
        choices: [
          'getPlayer',
          'getPlayerBattleLog',
          'getClub',
          'getClubMembers',
          'getBrawlers',
          'getBrawler',
          'getPlayerRankings',
          'getClubRankings',
          'getBrawlerRankings',
          'getEventRotation',
          new inquirer.Separator(),
          { name: 'Exit', value: 'exit' },
        ],
      },
    ]);

    if (action === 'exit') {
      console.log('Exiting CLI.');
      break;
    }

    try {
        let answers: any = {};
        let pagingOptions: PagingOptions | undefined;

        switch (action) {
            case 'getPlayer':
            case 'getPlayerBattleLog':
                answers = await inquirer.prompt([
                    { type: 'input', name: 'playerTag', message: 'Enter Player Tag (e.g., #YVCQLJ):' }
                ]);
                if (action === 'getPlayer') printJson(await client.getPlayer(answers.playerTag));
                else printJson(await client.getPlayerBattleLog(answers.playerTag));
                break;

            case 'getClub':
                answers = await inquirer.prompt([
                    { type: 'input', name: 'clubTag', message: 'Enter Club Tag (e.g., #2V0G8P):' }
                ]);
                printJson(await client.getClub(answers.clubTag));
                break;

            case 'getClubMembers':
                answers = await inquirer.prompt([
                    { type: 'input', name: 'clubTag', message: 'Enter Club Tag (e.g., #2V0G8P):' },
                    ...askPaging
                ]);
                if (answers.usePaging) {
                    pagingOptions = await inquirer.prompt(pagingQuestions);
                }
                printJson(await client.getClubMembers(answers.clubTag, pagingOptions));
                break;

            case 'getBrawlers':
                answers = await inquirer.prompt(askPaging);
                if (answers.usePaging) {
                    pagingOptions = await inquirer.prompt(pagingQuestions);
                }
                printJson(await client.getBrawlers(pagingOptions));
                break;

            case 'getBrawler':
                answers = await inquirer.prompt([
                    { type: 'input', name: 'brawlerId', message: 'Enter Brawler ID (e.g., 16000000):' }
                ]);
                printJson(await client.getBrawler(answers.brawlerId));
                break;

            case 'getPlayerRankings':
            case 'getClubRankings':
                answers = await inquirer.prompt([
                    { type: 'input', name: 'countryCode', message: 'Enter Country Code (e.g., FI) or \'global\':' },
                    ...askPaging
                ]);
                if (answers.usePaging) {
                    pagingOptions = await inquirer.prompt(pagingQuestions);
                }
                if (action === 'getPlayerRankings') printJson(await client.getPlayerRankings(answers.countryCode, pagingOptions));
                else printJson(await client.getClubRankings(answers.countryCode, pagingOptions));
                break;

            case 'getBrawlerRankings':
                answers = await inquirer.prompt([
                    { type: 'input', name: 'countryCode', message: 'Enter Country Code (e.g., FI) or \'global\':' },
                    { type: 'input', name: 'brawlerId', message: 'Enter Brawler ID (e.g., 16000000):' },
                    ...askPaging
                ]);
                 if (answers.usePaging) {
                    pagingOptions = await inquirer.prompt(pagingQuestions);
                }
                printJson(await client.getBrawlerRankings(answers.countryCode, answers.brawlerId, pagingOptions));
                break;

            case 'getEventRotation':
                printJson(await client.getEventRotation());
                break;

            default:
                console.log('Invalid action selected.');
        }
    } catch (error) {
        handleError(error);
    }

    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
  }
}

runInteractiveCLI(); 
