import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { api } from '~/utils/api'
import { Track } from '~/utils/types';

const PlaylistPage = () => {
  const router = useRouter()
  const id = router.query.id as string

  const { data: sessionData } = useSession();
  const { data: tracks } = api.track.getTracksByPlaylist.useQuery({ userId: sessionData?.user.id ?? '', playlistId: id})
  const [topTrack, setTopTrack] = useState(tracks?.[0]?.track)

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]'>
      {!tracks ?
        <div>Nothing Here</div> :
        <div>
          <div>
            <h1>{topTrack?.name}</h1>
          </div>
          <div className='p-3 grid grid-cols-4 gap-3'>
            {
              tracks.map(track => (
                <Track key={track.track.name} track={track.track} />
              ))
            }
          </div>
        </div>
      }
    </div>
  )
}

export default PlaylistPage

function Track({ track } : { track: Track }) {
  return (
    <div className='text-white bg-black rounded p-3'>
      <h1 className='text-xl font-bold'>{track.name}</h1>
      <h1>{track.artists.map(artist => (artist.name))}</h1>
    </div>
  )
}