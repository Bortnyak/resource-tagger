# AWS Resource Manager

A TypeScript utility for managing AWS resources - listing and tagging them based on name patterns.

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Build

To compile TypeScript to JavaScript:
```bash
npm run build
```

This will create a `dist` directory with the compiled JavaScript files.

To clean and rebuild:
```bash
npm run rebuild
```

## Development

For development with hot reloading:
```bash
npm run start:dev
```

## Project Structure

```
.
├── src/
│   ├── types.ts           # Type definitions
│   ├── ResourceLister.ts  # Resource listing functionality
│   ├── ResourceTagger.ts  # Resource tagging functionality
│   ├── utils.ts           # Utility functions
│   └── main.ts            # Usage example
├── dist/                  # Compiled JavaScript (created after build)
├── package.json
├── tsconfig.json
└── README.md
```

## AWS Credentials

Make sure you have AWS credentials configured either through:
- AWS CLI (`aws configure`)
- Environment variables
- IAM role if running on AWS infrastructure

Required permissions:
- `tag:GetResources`
- `tag:TagResources`

## Usage

```typescript
import { AWSResourceLister } from './resourceLister';
import { AWSResourceTagger } from './resourceTagger';

async function main() {
    const lister = new AWSResourceLister();
    const tagger = new AWSResourceTagger();

    // Find resources with specific name pattern
    const resources = await lister.listResourcesByName('servicename');

    // Apply tags to found resources
    const results = await tagger.applyTags(
        resources.map(r => r.arn),
        { Environment: 'Production' }
    );
}
```