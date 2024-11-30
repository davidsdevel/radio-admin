import Records from '@/features/records/Records';
import { getAllRecords } from '@/features/records/data/fetcher';

export default async function Page() {
    const data = await getAllRecords()
    
    return <Records {...data}/>
}