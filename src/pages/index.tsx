import React, { useState, useEffect } from 'react'
import Head from "next/head";
import { type NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';

import type { TabsProps } from 'antd'
import { Tabs } from 'antd'
import { api } from '~/utils/api';
import { type Track } from '~/utils/types';
import Image from 'next/image';

const Home: NextPage = () => {
  const { data: sessionData } = useSession()
  const { data: topOneHundredTracks } = api.track.getTopOneHundredAllTimeTracks.useQuery(sessionData?.user.id ?? '')
  const [currentTracks, setCurrentTracks] = useState<[Track, Track] | [null, null] >()

  console.log(topOneHundredTracks)

  useEffect(() => {
    //call to a function that gets two random songs from 0-99
    topOneHundredTracks?.items[0] && topOneHundredTracks.items[1] ?
      setCurrentTracks([topOneHundredTracks.items[0]?.track, topOneHundredTracks.items[1]?.track]) :
      setCurrentTracks([null,  null])
  }, [topOneHundredTracks])

  console.log(currentTracks)

  return (
    <>
      <Head>
        <title>HitPlay</title>
        <meta name='description" content="Find the best music for your playlists' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <div className='container flex flex-col items-center justify-center gap-12 px-4 py-1'>
          <h1 className='text-5xl text-[hsl(280,100%,70%)] font-extrabold tracking-tight sm:text-[5rem]'>Hitplay</h1>
          {/* <HomeTabs /> */}
          <div className='flex gap-12 w-full'>
            {currentTracks?.[0] && currentTracks?.[1] && currentTracks?.map(track => (
              <div key={track?.id} className='flex flex-col gap-6 w-1/2'>
                <TrackCard track={track} />
                <button
                  onClick={() => console.log(track.id)}
                  // style={{ backgroundColor: 'rgba(171,119,248,.25)' }}
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
