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
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-6'>
        {playlists && playlists.map(p => (
          <Playlist key={p.id} playlist={p} />
        ))}
      </div>
    </>
  )
}

export default Playlists

export function Playlist({ playlist } : { playlist: Playlist }) {
  const playlistImage = playlist.images[0]
  
  return (
    <Link 
      href={`/playlists/${playlist.id}`} 
      className='border p-3 rounded'
      style={{ backgroundColor: 'rgba(171,119,248,.25)' }}
    >
      {playlistImage && <Image alt={playlist.name} src={playlistImage.url} width={300} height={300} />}
      <h1 className='text-white text-lg mt-3'>{playlist.name}</h1>
    </Link>
  )
}