export type RecordListQuery = Record<string, any>

export interface RecordEntity {
    id: string;
    path: string | null;
    title: string | null;
    description: string | null;
    date: string;
    duration: number;
    status: 'RECORDING' | 'DRAFT' | 'PUBLISHED';    
}

export interface PaginatedRecords {
    data: RecordEntity[],
    meta: {
        hasNextPage: boolean,
        hasPreviousPage: boolean,
        startCursor: string,
        endCursor: string
    }
}
