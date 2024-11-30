'use client'

import type {RecordEntity} from './entities'
import { ArrowLeft } from 'lucide-react'
import AudioHLSPlayer from './components/audioPlayer'
import Link from 'next/link'

interface RecordPageProps {
    record: RecordEntity
}

export default function SingleRecord({record}: RecordPageProps) {

	return <div className="w-full m-auto p-4 space-y-4">
		<div className='max-w-4xl w-full mx-auto flex flex-col items-center'>
			<div className='w-full'>
				<Link href='/'>
					<ArrowLeft className='h-6 w-6' />
				</Link>
			</div>
			<h1 className="text-2xl font-bold">{record.title || '(Nueva grabación)'}</h1>
			<div className='mt-8'>
				<AudioHLSPlayer src={record.path}/>
			</div>
		</div>
	</div>
}
