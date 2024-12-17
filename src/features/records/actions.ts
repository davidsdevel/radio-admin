'use server'

import {RecordEntity, RecordUpdateDTO} from './entities'
import updater from '@/lib/updater'

export async function startNewLoad() {
    const record = await updater<RecordEntity>('POST', '/records');

    return record;
}

export async function stopRecording(id: string) {
    const record = await updater<RecordEntity>('POST', `/records/${id}/end-record`);

    return record;
}

export async function updateRecord(id: string, data: RecordUpdateDTO) {
    const record = await updater<RecordEntity>('PATCH', `/records/${id}`, data);

    return record;
}