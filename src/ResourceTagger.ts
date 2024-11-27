import { ResourceGroupsTaggingAPI } from 'aws-sdk';
import { TaggingResults } from './Types';

class AWSResourceTagger {
    private client: ResourceGroupsTaggingAPI;
    private static readonly BATCH_SIZE = 20;

    constructor(region: string = 'us-east-1') {
        this.client = new ResourceGroupsTaggingAPI({ region });
    }

    async applyTags(
        resources: string[],
        tags: Record<string, string>
    ): Promise<TaggingResults> {
        const results: TaggingResults = {
            successful: [],
            failed: []
        };

        // Process resources in batches
        for (let i = 0; i < resources.length; i += AWSResourceTagger.BATCH_SIZE) {
            const batch = resources.slice(i, i + AWSResourceTagger.BATCH_SIZE);

            try {
                const response = await this.client.tagResources({
                    ResourceARNList: batch,
                    Tags: tags
                }).promise();

                // Handle failed resources
                if (response.FailedResourcesMap) {
                    Object.entries(response.FailedResourcesMap).forEach(([arn, failure]) => {
                        results.failed.push({
                            arn,
                            error: failure.ErrorMessage || 'Unknown error'
                        });
                        batch.splice(batch.indexOf(arn), 1);
                    });
                }

                // Add successful resources
                results.successful.push(...batch);

            } catch (error) {
                console.error('Error tagging batch:', error);
                results.failed.push(
                    ...batch.map(arn => ({
                        arn,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    }))
                );
            }
        }

        return results;
    }
}

export {
    AWSResourceTagger
}