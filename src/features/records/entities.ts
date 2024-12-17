export type RecordListQuery = Record<string, string | string[] | undefined>

export interface RecordEntity {
    id: string;
    path: string | null;
    title: string | null;
    description: string | null;
    date: string;
    duration: number;
    status: 'PROCESSING' | 'DRAFT' | 'PUBLISHED';
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

export interface RecordUpdateDTO {
    title?: string | null;
    description?: string | null;
    status?: 'RECORDING' | 'DRAFT' | 'PUBLISHED';
}