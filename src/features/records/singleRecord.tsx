'use client'

import type {RecordEntity} from './entities'
import { ArrowLeft } from 'lucide-react'
import AudioHLSPlayer from './components/audioPlayer'
import Link from 'next/link'
import AudioMetadataForm from './components/audioMetadataForm'

interface RecordPageProps {
    record: RecordEntity
}

export default function SingleRecord({record}: RecordPageProps) {

	return <div className="w-full m-auto p-4 space-y-4">
		<div className='max-w-[70rem] w-full mx-auto flex flex-col items-center'>
			<div className='w-full'>
				<Link href='/'>
					<ArrowLeft className='h-6 w-6' />
				</Link>
			</div>
			<h1 className="text-2xl font-bold">{record.title || '(Nueva grabación)'}</h1>
			<div className='flex flex-col mt-8 gap-2 sm:flex-row'>
				<div>
					<AudioHLSPlayer src={record.path}/>
				</div>
				<div>
					<AudioMetadataForm/>
				</div>
			</div>
		</div>
	</div>
}
