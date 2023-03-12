import React, { useState } from 'react'
import Image from 'next/image'
import Head from "next/head";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

import type { TabsProps } from 'antd'
import { Tabs } from 'antd'
import { api } from "~/utils/api";
import { type Playlist } from '~/utils/types'
import Link from 'next/link';

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const { data: playlists} = api.playlist.getPlaylists.useQuery(sessionData?.user.id ?? '');

  return (
    <>
      <Head>
        <title>HitPlay</title>
        <meta name="description" content="Find the best music for your playlists" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl text-[hsl(280,100%,70%)] font-extrabold tracking-tight sm:text-[5rem]">Hitplay</h1>
          {/* <HomeTabs /> */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            { playlists && 
              playlists.map(p => (
                <Playlist key={p.id} playlist={p} />
              ))
            }
          </div>
          <AuthShowcase />
        </div>
      </main>
    </>
  );
};

export default Home;

export function HomeTabs() {
  const [activeTab, setActiveTab] = useState('1')

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: `Songs`,
      children: <Tracks />,
    },
    {
      key: '2',
      label: `Albums`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: '3',
      label: `Artists`,
      children: `Content of Tab Pane 3`,
    },
  ];

  return (
    <Tabs 
      className='w-full' 
      activeKey={activeTab} 
      items={tabItems} 
      onChange={(e) => setActiveTab(e)} 
    />
  )
}

export function Tracks() {
  const { data: sessionData } = useSession();
  const { data: track } = api.track.getTrack.useQuery(sessionData?.user.id ?? '');

  return (
    track ? 
      <div>{track.name}</div> :
      <div>Track not found</div>
  )
}


export function Playlist({ playlist } : { playlist: Playlist }) {
  const playlistImage = playlist.images[0]
  
  return (
    <Link href={`/playlist/${playlist.id}`} className='border p-3 rounded'>
      {playlistImage && <Image alt={playlist.name} src={playlistImage.url} width={300} height={300} />}
      <h1 className='text-white text-lg'>{playlist.name}</h1>
    </Link>
  )
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
