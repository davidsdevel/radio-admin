import { RecordEntity } from "@/features/records/entities"
import SingleRecord from "@/features/records/singleRecord";
import fetcher from "@/lib/fetcher"

type Params = Promise<{ id: string }>

export default async function Page({params}: {params: Params}) {
    const {id} = await params
    
    const record = await fetcher<RecordEntity>(`/records/${id}`);
    
    return <SingleRecord record={record}/>
}
