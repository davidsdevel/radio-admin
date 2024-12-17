'use client'

import React, { useState, useRef, useEffect, RefObject } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'

import ReactHlsPlayer from 'react-hls-player'

export default function AudioHLSPlayer({ src }: { src: string | null | undefined }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const playerRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = playerRef.current;
    
    if (!audio)
      return;

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    const setTimeToInit = () => {
      audio.currentTime = 0;
    }

    audio.addEventListener('loadedmetadata', setTimeToInit)
    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('durationchange', updateDuration)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('durationchange', updateDuration)
      audio.removeEventListener('loadedmetadata', setTimeToInit)
    }
  }, [src])

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause()
      } else {
        playerRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0]
    setVolume(volumeValue)
    if (playerRef.current) {
      playerRef.current.volume = volumeValue
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full sm:w-[40rem] md:w-[50rem] mx-auto bg-background shadow-lg rounded-lg overflow-hidden border border-slate-100">
      <div className='bg-red-200 flex items-center justify-center'>
        <ReactHlsPlayer
          src={src || ''}
          autoPlay={false}
          controls={false}
          width="100%"
          height="auto"
          playerRef={playerRef as RefObject<HTMLVideoElement>}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={togglePlay}>
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          <div className="flex items-center space-x-2">
            {volume > 0 ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
            <Slider
              value={[volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  )
}

