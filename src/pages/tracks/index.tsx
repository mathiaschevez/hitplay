import { type NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import { api } from '~/utils/api'
import { type Track } from '~/utils/types'

const Tracks: NextPage = () => {
  const { data: sessionData } = useSession()
  const { data: topTracks } = api.user.getCurrentUserTopTracks.useQuery(sessionData?.user.id ?? '')

  return (
    <>
      <Head>
        <title>Top Tracks</title>
        <meta name='description' content='Find the best music for your playlists' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='grid grid-cols-4 gap-6 p-6'>
        {topTracks?.items.map((track, i: number) => (
          <TopTrack key={track.id} track={track} rank={i + 1} />
        ))}
      </div>
    </>
  )
}

export default Tracks

function TopTrack({ track, rank } : { track: Track, rank: number }) {
  return (
    <div style={{ backgroundColor: 'rgba(171, 119, 248, .25)' }} className='border-2 flex p-3 rounded gap-3'>
      <div className='flex flex-col gap-3 w-full items-center justify-center'>
        { track.album.images[0]?.url && <Image alt={track.name} src={track.album.images[0].url} width={200} height={200} /> }
        <div className='flex gap-1 text-white'>
          <span className='font-bold text-lg'>{rank}.</span>
          <h1 className='font-bold text-lg'>{track.name}</h1>
        </div>
      </div>
    </div>
  )
}