'use client'

import type {RecordEntity} from './entities'

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import AudioRecordItem from './components/recordElement'
import AudioHLSPlayer from './components/audioPlayer'
import { createContext, useContext, useState } from 'react'
import { startNewLoad } from './actions'

interface RecordPageProps {
    data: RecordEntity[]
    meta: {
        hasNextPage: boolean,
        hasPreviousPage: boolean,
        startCursor: string,
        endCursor: string
    }
}

interface RecordContextValues {
	records: [
		RecordEntity[],
		(records: RecordEntity[]) => void
	],
	playing: [
		RecordEntity | null,
		(playing: RecordEntity | null) => void
	]
}

const RecordContext = createContext<RecordContextValues | null>(null);

export function useRecords() {
	const context = useContext(RecordContext);
	
	if (context === null) {
		throw new Error("useRecords must be used within a RecordProvider");
	}
	
	return context.records
}


export function useActualPlaying() {
	const context = useContext(RecordContext);
	
	if (context === null) {
		throw new Error("useActualPlaying must be used within a RecordProvider");
	}
	
	return context.playing
}

export default function Records(props: RecordPageProps) {
	const [records, setRecords] = useState(props.data);
	const [playing, setPlaying] = useState<RecordEntity | null>(null);

	async function handleNewRecord() {
		const record = await startNewLoad()

		setRecords(prev => {
			return [
				record,
				...prev
			]
		})
	}

	return <RecordContext.Provider value={{
		records: [
			records,
			setRecords
		],
		playing: [
			playing,
			setPlaying
		]
	}}>
		<div className="w-full m-auto p-4 space-y-4">
			<h1 className="text-2xl font-bold">Programas</h1>
			<div className="flex space-x-2">
				<Button onClick={handleNewRecord}>Grabar</Button>
				<Button>Subir nuevo audio</Button>
			</div>
			<div className="w-full grid grid-cols-1 gap-2 sm:grid-cols-2">
				{records.map((record) => (
					<AudioRecordItem key={record.id} record={record}/>
				))}
			</div>
		</div>
	</RecordContext.Provider>
}