import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { api } from '~/utils/api'
import { type PlaylistTrack } from '~/utils/types';
import { FaArrowCircleUp, FaArrowCircleDown } from 'react-icons/fa'
import { type NextPage } from 'next';

const PlaylistPage: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string

  const { data: sessionData } = useSession();
  const { data: tracks } = api.track.getTracksByPlaylist.useQuery({ userId: sessionData?.user.id ?? '', playlistId: id ?? ''})
  
  const [topTrack, setTopTrack] = useState<PlaylistTrack>()
  const [trackList, setTrackList] = useState<PlaylistTrack[]>()

  useEffect(() => {
    tracks?.[0] && 
      setTopTrack(tracks[0])
      setTrackList(tracks ? tracks : [])
  }, [tracks])

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]'>
      <div className='p-32'>
        {!tracks ?
          <div>Nothing Here</div> :
          <div className='flex flex-col gap-12 justify-center'>
            <div className='flex flex-col gap-6'>
              <h1 className='text-4xl text-white font-extrabold'>#1 RANKED TRACK FOR THIS PLAYLIST</h1>
              <div className='flex flex-col gap-6 lg:flex-row'>
                { topTrack?.track?.album?.images?.[0]?.url &&
                  <Image 
                    alt={topTrack?.track.name ?? 'Track'} 
                    src={topTrack?.track.album.images[0].url} 
                    width={400} height={400} 
                  />
                }
                <div className='flex flex-col justify-between gap-6'>
                  <div className='flex gap-3 items-center lg:flex-col lg:items-start'>
                    <h1 className='text-white font-bold text-4xl'>{ topTrack?.track.name }</h1>
                    { topTrack?.track.artists.map(artist => (
                      <h1 key={artist.id} className='text-white font-semibold text-lg'>{artist.name}</h1>
                    ))}
                  </div>
                  <audio src={topTrack?.track.preview_url} controls />
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-3'>
              {(!trackList || trackList.length === 0) ?
                <div>no tracks</div> :
                trackList.slice(1).map(track => (
                  <Track 
                    key={track.track.id} 
                    playlistTrack={track}
                    trackList={trackList}
                    setTrackList={setTrackList}
                    setTopTrack={setTopTrack}
                  />
                ))
              }
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default PlaylistPage

function Track({ playlistTrack, trackList, setTrackList, setTopTrack } : { playlistTrack: PlaylistTrack, trackList: PlaylistTrack[], setTrackList: (_: PlaylistTrack[]) => void, setTopTrack: (_: PlaylistTrack) => void }) {
  const { track } = playlistTrack;

  function updateTrackList(direction: string, trackId: string) {
    let updatedTrackList: PlaylistTrack[] = []
    const index = trackList.map(t => t.track.id).indexOf(trackId)

    updatedTrackList = trackList.filter((t) => t.track.id !== trackId)

    if(direction === 'up') {
      updatedTrackList.splice(index - 1 , 0, playlistTrack)
      if(index === 1) setTopTrack(playlistTrack)
    } else {
      updatedTrackList.splice(index + 1, 0, playlistTrack)
    }

    setTrackList(updatedTrackList)
  }

  return (
    <div className='text-white bg-black rounded p-3 flex gap-6 justify-between'>
      <div className='flex gap-3'>
        { track.album.images[0]?.url && 
          <Image alt={track.name} src={track.album.images[0].url} width={100} height={100} />
        }
        <div>
          <h1 className='text-xl font-bold'>{track.name}</h1>
          <div className='flex gap-1'>
            { track.artists.map(artist => (
              <h1 key={artist.id}>{artist.name}</h1>
            ))}
          </div>
        </div>
      </div>
      <div className='flex items-center gap-6'>
        <audio src={track.preview_url} controls />
        <div className='flex flex-col gap-6'>
          <button className='' onClick={() => updateTrackList('up', track.id)}>
            <FaArrowCircleUp size={25} />
          </button>
          <button className='' onClick={() => updateTrackList('down', track.id)}>
            <FaArrowCircleDown size={25} />
          </button>
        </div>
      </div>
    </div>
  )
}