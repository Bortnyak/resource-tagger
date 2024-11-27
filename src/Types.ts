export interface AWSResource {
    arn: string;
    name: string;
    type: string;
    tags: Record<string, string>;
}

export interface TaggingResults {
    successful: string[];
    failed: Array<{
        arn: string;
        error: string;
    }>;
}