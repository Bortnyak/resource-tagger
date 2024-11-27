import { AWSResourceLister } from './ResourceLister';
import { AWSResourceTagger } from './ResourceTagger';
import { formatTags, printResource, printResourceRed } from './utils';
import { AWSResource } from './Types';


async function main() {
    try {
        const lister = new AWSResourceLister();
        const tagger = new AWSResourceTagger();

        // Find resources with 'ogou' in the name
        console.log('\nFinding resources containing "test"...');
        const resources = await lister.listResourcesByName('test', { caseSensitive: false });

        /*
            //or with resource type filter
            const resourceTypes = [
                'ecs:cluster',
                'ecs:task',
                'ecs:service',
                'ecs:task-definition',
                'ecr:repository'
            ]; 
            const resources = await lister.listResourcesByName('test', { resourceTypes, caseSensitive: false });
        */

        console.log('\nFound resources:');
        console.log('-'.repeat(100));


        const resourcesWithoutTags: Array<AWSResource> = [];
        resources.forEach((resource: AWSResource) => {
            printResource(resource);
            const tags = formatTags(resource.tags);
            if (tags == 'No tags') {
                resourcesWithoutTags.push(resource);
            }
        });

        if (resourcesWithoutTags.length > 0) {
            console.log("\x1b[31m", 'Resources without tags');
            console.log("\x1b[31m", '-'.repeat(100));
            resourcesWithoutTags.forEach((resource: AWSResource) => {
                printResourceRed(resource)
            })
        }

        // Example of applying new tags
        const newTags = {
            Project: 'test-project'
        };

        console.log('\nApplying new tags...');
        // Uncomment next lines to apply the tag
        // const results = await tagger.applyTags(
        //     resources.map((r: AWSResource) => r.arn),
        //     newTags
        // );

        // console.log('\nTagging results:');
        // console.log('Successfully tagged:', results.successful.length);
        // console.log('Failed to tag:', results.failed.length);
        
        // if (results.failed.length > 0) {
        //     console.log('\nFailed resources:');
            
        //     results.failed.forEach(failure => {
        //         console.log(`${failure.arn}: ${failure.error}`);
        //     });
        // }

    } catch (error) {
        console.error('Error in main:', error);
    }
}

main();