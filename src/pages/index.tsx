import React, { useState, useEffect } from 'react'
import Head from "next/head";
import { type NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';

import type { TabsProps } from 'antd'
import { Tabs } from 'antd'
import { api } from '~/utils/api';
import { type PlaylistTrack, type Track } from '~/utils/types';
import Image from 'next/image';

interface PlaylistTracksData {
  items: PlaylistTrack[]
}

const Home: NextPage = () => {
  const { data: sessionData } = useSession()
  const { data: topOneHundredTracks } = api.track.getTopOneHundredAllTimeTracks.useQuery(sessionData?.user.id ?? '')
  const [currentTracks, setCurrentTracks] = useState<[Track | null, Track | null]>()

  useEffect(() => {
    function getTwoRandomTracks(trackList: PlaylistTracksData) {
      const first = Math.floor(Math.random() * trackList.items.length);
      let second = Math.floor(Math.random() * trackList.items.length);
      while (first === second) {
        second = Math.floor(Math.random() * trackList.items.length);
      }

      setCurrentTracks([
        trackList.items[first]?.track ?? null,
        trackList.items[second]?.track ?? null
      ])
    }
    
    topOneHundredTracks && getTwoRandomTracks(topOneHundredTracks) 
  }, [topOneHundredTracks])

  return (
    <>
      <Head>
        <title>HitPlay</title>
        <meta name='description' content='Find the best music for your playlists' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <div className='container flex flex-col items-center justify-center gap-12 px-4 py-1'>
          <h1 className='text-5xl text-[hsl(280,100%,70%)] font-extrabold tracking-tight sm:text-[5rem]'>Hitplay</h1>
          {/* <HomeTabs /> */}
          <div className='flex flex-wrap gap-20 items-center justify-center'>
            {currentTracks?.[0] && currentTracks?.[1] && currentTracks?.map(track => (
              <div key={track?.id} className='flex flex-col gap-6'>
                { track && <TrackCard track={track} />}
                <button
                  onClick={() => console.log(track?.id)}
                  className='text-white font-bold border-2 rounded-full py-2 hover:bg-purple-600'
                >Vote</button>
              </div>
            ))}
          </div>
          <AuthShowcase />
        </div>
      </main>
    </>
  );
};

export default Home;

function TrackCard({ track } : { track: Track }) {
  return (
    <div className='flex flex-col gap-3 p-6 items-center border-2 rounded'>
      { track.album.images?.[0]?.url && 
        <Image alt={track.name} src={track.album.images[0].url} width={350} height={350} />
      }
      <h1 className='text-white text-left w-full text-lg font-bold'>{track.name}</h1>
      <audio className='w-full' src={track.preview_url} controls />
    </div>
  )
}

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
