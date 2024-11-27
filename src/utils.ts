import { AWSResource } from './Types';

export const formatTags = (tags: Record<string, string>): string => {
    if (Object.keys(tags).length === 0) {
        return 'No tags';
    }
    return Object.entries(tags)
        .map(([key, value]) => `${key}=${value}`)
        .join(', ');
};

export const printResource = (resource: AWSResource) => {
    console.log(`Type: ${resource.type.padEnd(15)} Name: ${resource.name.padEnd(30)}`);
    console.log(`ARN:  ${resource.arn}`);
    console.log(`Tags: ${formatTags(resource.tags)}`);
    console.log('-'.repeat(100));
}

export const printResourceRed = (resource: AWSResource) => {
    console.log("\x1b[31m", `Type: ${resource.type.padEnd(15)} Name: ${resource.name.padEnd(30)}`);
    console.log("\x1b[31m", `ARN:  ${resource.arn}`);
    console.log("\x1b[31m", `Tags: ${formatTags(resource.tags)}`);
    console.log("\x1b[31m", '-'.repeat(100));
}