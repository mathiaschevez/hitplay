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
  const trackCreation = api.track.createTrack.useMutation()
  const duelCreation = api.duel.createDuel.useMutation()

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

  const handleCreate = () => {
    topOneHundredTracks?.items?.forEach((t, i) => {
      console.log(t.track?.name, i)
      trackCreation.mutate({
        id: t.track?.id,
        name: t.track?.name,
        imageUrl: t.track?.album?.images?.[0]?.url || '',
        previewURL: t.track?.preview_url || '',
      })
    })
  }

  const handleVote = async (winnerIndex: number) => {
    const winner = currentTracks?.[winnerIndex]
    const loser = currentTracks?.[winnerIndex === 0 ? 1 : 0]

    //create a track for both winner and loset
    await trackCreation.mutateAsync({
      id: winner?.id ?? '',
      name: winner?.name ?? '',
      imageUrl: winner?.album?.images?.[0]?.url || '',
      previewURL: winner?.preview_url || '',
    })

    await trackCreation.mutateAsync({
      id: loser?.id ?? '',
      name: loser?.name ?? '',
      imageUrl: loser?.album?.images?.[0]?.url || '',
      previewURL: loser?.preview_url || '',
    })

    const createdDuel = await duelCreation.mutateAsync({
      track1Id: currentTracks?.[0]?.id ?? '',
      track2Id: currentTracks?.[1]?.id ?? '',
      userId: sessionData?.user.id ?? '',
      winnerId: winner?.id ?? '',
      loserId: loser?.id ?? '',
    })

    console.log(createdDuel, 'createdDuel')

    // update the track with duel id
    //assign the duel to a user
  }

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
            {currentTracks?.[0] && currentTracks?.[1] && currentTracks?.map((track, i) => (
              <div key={track?.id} className='flex flex-col gap-6'>
                { track && <TrackCard track={track} />}
                <button
                  onClick={() => void handleVote(i)}
                  className='text-white font-bold border-2 rounded-full py-2 hover:bg-purple-600'
                >Vote</button>
              </div>
            ))}
          </div>
          <button onClick={() => handleCreate()}>CREATE</button>
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
