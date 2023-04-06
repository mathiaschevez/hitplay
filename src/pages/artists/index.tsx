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
      <main>
        <h1 className='text-white font-bold text-5xl p-6 pb-0'>YOUR TOP ARTISTS</h1>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-6'>
          {topArtists?.items.map((artist, i) => (
            <div className='bg-[#0B132B] shadow-lg rounded-2xl p-3 flex flex-col items-center h-full justify-center gap-3' key={artist.id}>
              {artist.images[0]?.url && 
                <Image alt={artist.name} src={artist.images[0].url} width={300} height={300} />
              }
              <div className='flex gap-1 text-white'>
                <span className='font-bold text-lg'>{i + 1}.</span>
                <h1 className='font-bold text-lg'>{artist.name}</h1>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}

export default Artists
