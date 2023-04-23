import { Spin } from 'antd'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { api } from '~/utils/api'
import { type Track } from '~/utils/types'

const TopPlaylist = () => {
  const { data: sessionData } = useSession()
  const { data: topTracksLongTerm } = api.user.getCurrentUserTopTracks.useQuery({ userId: sessionData?.user.id ?? '' })
  const { data: topTracksMediumTerm } = api.user.getCurrentUserTopTracks.useQuery({ userId: sessionData?.user.id ?? '', timeRange: 'medium_term' })
  const { data: topTracksShortTerm } = api.user.getCurrentUserTopTracks.useQuery({ userId: sessionData?.user.id ?? '', timeRange: 'short_term' })
  

  const router = useRouter()
  const type = router.query.type

  return (
    (topTracksLongTerm && topTracksMediumTerm && topTracksShortTerm) ?
      <div>
        {
          type === 'long_term' ? 
            <PlaylistPage tracks={topTracksLongTerm?.items} type={type}/> :
          type === 'medium_term' ?
            <PlaylistPage tracks={topTracksMediumTerm?.items} type={type}/> :
          type === 'short_term' ?
            <PlaylistPage tracks={topTracksShortTerm?.items} type={type}/> :
            <div>Something went wrong... :(</div>}
      </div> :
      <div className={`flex flex-col items-center justify-center w-full h-full flex-1 mt-20`}>
        <Spin />
      </div>
  )
}

export default TopPlaylist

function PlaylistPage({ tracks, type }: { tracks: Track[], type: 'long_term' | 'medium_term' | 'short_term' }) {
  const title = 
    type === 'long_term' ? 
      'of All Time' :
    type === 'medium_term' ?
      'of the Last 6 Months' :
      'of the Last Month'


  return (
    <div className={`p-6`}>
      <div className={`flex w-full justify-between mb-6 items-center`}>
        <h1 className={`text-white font-bold text-2xl`}>A playlist with your top tracks {title}</h1>
        <div className='flex gap-3'>
          <button className={`bg-white hover:bg-white/90 text-black rounded-full h-9 font-semibold w-32`}>Edit</button>
          <button className={`bg-white hover:bg-white/90 text-black rounded-full h-9 font-semibold w-44`}>Add to your library</button>
        </div>
      </div>
      <div className='grid grid-cols-4 gap-6'>
        {tracks.map((track, i) => (
          <div key={track.id} className='flex bg-[#0B132B] shadow-lg rounded-2xl p-3'>
            <div className='flex flex-col gap-3 w-full items-center justify-center'>
              { track.album.images[0]?.url && <Image alt={track.name} src={track.album.images[0].url} width={300} height={300} /> }
              <div className='flex gap-1 text-white'>
                <h1 className='font-bold text-lg'>{i + 1}. {track.name}</h1>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}