import { type NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { api } from '~/utils/api';
import { Playlist } from '~/utils/types';

const Playlists: NextPage = () => {
  const { data: sessionData } = useSession();
  const { data: playlists} = api.playlist.getUserPlaylists.useQuery(sessionData?.user.id ?? '');

  return (
    <>
      <Head>
        <title>Playlists</title>
        <meta name='description' content='Find the best music for your playlists' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <h1 className='text-white font-bold text-5xl p-6 pb-0'>YOUR PLAYLISTS</h1>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-6'>
          {playlists && playlists.map(p => (
            <Playlist key={p.id} playlist={p} />
          ))}
        </div>
      </main>
    </>
  )
}

export default Playlists

export function Playlist({ playlist } : { playlist: Playlist }) {
  const playlistImage = playlist.images[0]
  
  return (
    <Link href={`/playlists/${playlist.id}`} className='p-3 bg-[#0B132B] shadow-lg rounded-2xl'>
      {playlistImage && <Image alt={playlist.name} src={playlistImage.url} width={300} height={300} />}
      <h1 className='text-white text-lg mt-3 font-bold'>{playlist.name}</h1>
    </Link>
  )
}
