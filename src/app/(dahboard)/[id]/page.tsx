import { getSingleRecord } from "@/features/records/data/fetcher";
import SingleRecord from "@/features/records/singleRecord";

type Params = Promise<{ id: string }>

export default async function Page({params}: {params: Params}) {
    const {id} = await params
    
    const record = await getSingleRecord(id);
    
    return <SingleRecord record={record}/>
}
