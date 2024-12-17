'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, Radio, Square, Upload } from 'lucide-react'
import { RecordEntity } from '../entities'

interface DialogProps {
  onNewRecord: (record: RecordEntity) => void
}

export function StartRecordDialog({onNewRecord}: DialogProps) {
  const [activeTab, setActiveTab] = useState<'mic' | 'icecast'>('mic')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [icecastUrl, setIcecastUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | MediaElementAudioSourceNode | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      setError(null)
      audioChunksRef.current = []

      if (activeTab === 'mic') {
        await startMicRecording()
      } else {
        await startIcecastRecording()
      }

      setIsRecording(true)
      startTimer()
    } catch (error) {
      console.error('Error starting recording:', error)
      setError('Failed to start recording. Please try again.')
    }
  }

  const startMicRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
      setAudioBlob(audioBlob)
    }

    mediaRecorder.start()
  }

  const startIcecastRecording = async () => {
    if (!icecastUrl) {
      throw new Error('Please enter an Icecast stream URL')
    }

    const audioContext = new AudioContext()
    audioContextRef.current = audioContext

    const audio = new Audio(icecastUrl)
    audio.crossOrigin = 'anonymous'
    await audio.play()

    const source = audioContext.createMediaElementSource(audio)
    sourceNodeRef.current = source

    const destination = audioContext.createMediaStreamDestination()
    source.connect(destination)
    source.connect(audioContext.destination)

    const mediaRecorder = new MediaRecorder(destination.stream)
    mediaRecorderRef.current = mediaRecorder

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
      setAudioBlob(audioBlob)
      audio.pause()
    }

    mediaRecorder.start()
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      stopTimer()

      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect()
      }

      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }

  const startTimer = () => {
    setRecordingTime(0)
    timerRef.current = setInterval(() => {
      setRecordingTime((prevTime) => prevTime + 1)
    }, 1000)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const uploadAudio = async () => {
    if (!audioBlob) {
      console.error('No audio recorded')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.wav')
      formData.append('source', activeTab)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/records`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload audio')
      }

      const result = await response.json()
      
      setError(null)
      onNewRecord(result as RecordEntity);
      // You can add further actions here, such as showing a success message
    } catch (error) {
      console.error('Error uploading audio:', error)
      setError('Failed to upload audio. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return <Dialog>
        
        <DialogTrigger asChild>
            <Button className="relative">
                Grabar
            </Button>
        </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Audio</DialogTitle>
          <DialogDescription>
            Choose a source and start recording your audio.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'mic' | 'icecast')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mic">Microphone</TabsTrigger>
            <TabsTrigger value="icecast">Icecast Stream</TabsTrigger>
          </TabsList>
          <TabsContent value="mic">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-4xl font-bold">
                {formatTime(recordingTime)}
              </div>
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                className="w-16 h-16 rounded-full"
              >
                {isRecording ? (
                  <Square className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </Button>
              <span className="text-sm text-gray-500">
                {isRecording ? 'Recording...' : 'Ready to record'}
              </span>
            </div>
          </TabsContent>
          <TabsContent value="icecast">
            <div className="flex flex-col items-center space-y-4">
              <Input
                type="url"
                placeholder="Enter Icecast stream URL"
                value={icecastUrl}
                onChange={(e) => setIcecastUrl(e.target.value)}
                disabled={isRecording}
              />
              <div className="text-4xl font-bold">
                {formatTime(recordingTime)}
              </div>
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                className="w-16 h-16 rounded-full"
                disabled={!icecastUrl && !isRecording}
              >
                {isRecording ? (
                  <Square className="h-8 w-8" />
                ) : (
                  <Radio className="h-8 w-8" />
                )}
              </Button>
              <span className="text-sm text-gray-500">
                {isRecording ? 'Recording...' : 'Ready to record'}
              </span>
            </div>
          </TabsContent>
        </Tabs>
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
        {audioBlob && !isRecording && (
          <Button
            onClick={uploadAudio}
            disabled={isUploading}
            className="mt-4 w-full"
          >
            {isUploading ? (
              'Uploading...'
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Upload Recording
              </>
            )}
          </Button>
        )}
      </DialogContent>
    </Dialog>
}

