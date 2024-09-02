'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"

export default function AudioButton({src} : {src: string}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audio = new Audio(src)
  const playAudio = async () => {
    setIsPlaying(true)
    await audio.play()
    setIsPlaying(false)
  }

  return (
    <Button
      onClick={playAudio}
      variant="outline"
      size="icon"
      aria-label={isPlaying ? "Pause audio" : "Play audio"}
    >
      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
    </Button>
  )
}