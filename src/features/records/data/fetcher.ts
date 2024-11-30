import fetcher from "@/lib/fetcher"
import { PaginatedRecords, RecordListQuery } from "../entities"

export async function getAllRecords(data?: RecordListQuery) {
    return fetcher<PaginatedRecords>('/records', data);
}

export async function getSingleRecord(id: string) {
    return null
}

export async function createRecord() {
    return null
}

export async function stopRecord(id: string) {
    return null
}