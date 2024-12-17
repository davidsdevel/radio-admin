import fetcher from "@/lib/fetcher"
import { PaginatedRecords, RecordEntity, RecordListQuery } from "../entities"

export async function getAllRecords(data?: RecordListQuery) {
    return fetcher<PaginatedRecords>('/records', data);
}

export async function getSingleRecord(id: string) {
    return fetcher<RecordEntity>(`/records/${id}`);
}
