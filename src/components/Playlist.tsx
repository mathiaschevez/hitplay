import Image from 'next/image'
import React from 'react'
import { type Playlist } from '~/utils/types'

export function Playlist({ playlist } : { playlist: Playlist }) {
  const playlistImage = playlist.images[0]
  console.log(playlistImage, 'here')
  
  return (
    <div className='border p-3 rounded'>
      {playlistImage && 
        <Image alt={playlist.name} src={playlistImage.url} width={300} height={300} />
      }
      {/* <Image alt='playlist' src={playlist.images[0].url} /> */}
      <h1 className='text-white text-lg'>{playlist.name}</h1>
    </div>
  )
}
