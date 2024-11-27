import { ResourceGroupsTaggingAPI } from 'aws-sdk';
import { AWSResource } from './Types';

class AWSResourceLister {
    private client: ResourceGroupsTaggingAPI;

    constructor(region: string = 'us-east-1') {
        this.client = new ResourceGroupsTaggingAPI({ region });
    }

    async listResources(resourceTypes?: string[]): Promise<string[]> {
        const resources: string[] = [];
        let nextToken: string | undefined;

        try {
            do {
                const params: ResourceGroupsTaggingAPI.GetResourcesInput = {
                    ResourceTypeFilters: resourceTypes,
                    PaginationToken: nextToken,
                };

                const response = await this.client.getResources(params).promise();
                response.ResourceTagMappingList?.forEach(resource => {
                    if (resource.ResourceARN) {
                        resources.push(resource.ResourceARN);
                    }
                });

                nextToken = response.PaginationToken;
            } while (nextToken);

        } catch (error) {
            console.error('Error listing resources:', error);
            throw error;
        }

        return resources;
    }

    async listResourcesByName(
        namePattern: string,
        options: {
            resourceTypes?: string[];
            caseSensitive?: boolean;
        } = {}
    ): Promise<AWSResource[]> {
        const resources: AWSResource[] = [];
        let nextToken: string | undefined;

        try {
            do {
                const params: ResourceGroupsTaggingAPI.GetResourcesInput = {
                    ResourceTypeFilters: options.resourceTypes,
                    PaginationToken: nextToken,
                };

                const response = await this.client.getResources(params).promise();

                response.ResourceTagMappingList?.forEach(resource => {
                    if (resource.ResourceARN) {
                        const name = this.extractNameFromArn(resource.ResourceARN);
                        const shouldInclude = options.caseSensitive
                            ? name.includes(namePattern)
                            : name.toLowerCase().includes(namePattern.toLowerCase());

                        if (shouldInclude) {
                            resources.push({
                                arn: resource.ResourceARN,
                                name,
                                type: resource.ResourceARN.split(':')[2],
                                tags: this.convertTags(resource.Tags || [])
                            });
                        }
                    }
                });

                nextToken = response.PaginationToken;
            } while (nextToken);

        } catch (error) {
            console.error('Error listing resources by name:', error);
            throw error;
        }

        return resources;
    }

    private extractNameFromArn(arn: string): string {
        return arn.split('/').pop()?.split(':').pop() || arn;
    }

    private convertTags(tags: ResourceGroupsTaggingAPI.TagList): Record<string, string> {
        return tags.reduce((acc, tag) => {
            if (tag.Key) {
                acc[tag.Key] = tag.Value || '';
            }
            return acc;
        }, {} as Record<string, string>);
    }
}

export {
    AWSResourceLister
}