import { type NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import { api } from '~/utils/api'

const Artists: NextPage = () => {
  const { data: sessionData } = useSession()
  const { data: topArtists } = api.user.getCurrentUserTopArtists.useQuery(sessionData?.user.id ?? '')

  return (
    <>
      <Head>
        <title>Artists</title>
        <meta name='description' content='Find the best music for your playlists' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-6'>
        {topArtists?.items.map((artist, i) => (
          <div style={{ backgroundColor: 'rgba(171, 119, 248, .25)' }} className='border rounded p-3 flex flex-col items-center h-full justify-center gap-3' key={artist.id}>
            <div className='flex gap-1 text-white'>
              <span className='font-bold text-lg'>{i + 1}.</span>
              <h1 className='font-bold text-lg'>{artist.name}</h1>
            </div>
            {artist.images[0]?.url && 
              <Image alt={artist.name} src={artist.images[0].url} width={200} height={200} />
            }
          </div>
        ))}
      </div>
    </>
  )
}

export default Artists
