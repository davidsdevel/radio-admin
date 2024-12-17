'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RecordEntity } from "../entities"
import { Button } from '@/components/ui/button'
import { secondsToTime } from "@/lib/date"
import { stopRecording } from "../actions"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface AudioRecordItemProps {
	record: RecordEntity
}

export default function AudioRecordItem({ record: recordProp }: AudioRecordItemProps) {
	const [record, setRecord] = useState(recordProp);
	const router = useRouter()

	const isRecording = record.status === 'RECORDING';

	const handlePlay = () => {
		router.push(`/${record.id}`);
	}

	const handleStopRecord = async () => {
		const stoppedRecord = await stopRecording(record.id);
		
		setRecord(stoppedRecord)
	}

	return <Card className='flex gap-2 items-center p-2'>
		<div>
			<Button className="h-24 w-24" onClick={isRecording ? handleStopRecord :  handlePlay}>
				{
					isRecording
						? 'Stop'
						: 'Play'
				}
			</Button>
		</div>
		<div className='flex-grow'>
			<CardHeader>
				<CardTitle>{record.title || '(Nueva grabación)'}</CardTitle>
			</CardHeader>
			<CardContent className="flex justify-between items-center">
				{
					!isRecording &&
					<div className="flex justify-between items-center">
						<span className="text-sm">{secondsToTime(record.duration)}</span>
					</div>
				}
				<Badge
					variant={
						record.status === 'PUBLISHED'
							? 'default'
							: record.status === 'DRAFT'
								? 'secondary'
								: 'destructive'
					}
					color="green"
				>
					{record.status}
				</Badge>
			</CardContent>
		</div>
	</Card>
}
