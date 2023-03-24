import React, { useState, useEffect } from 'react'
import Head from "next/head";
import { type NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';

import { api } from '~/utils/api';
import { type PlaylistTrack, type Track } from '~/utils/types';
import Image from 'next/image';

interface PlaylistTracksData {
  items: PlaylistTrack[]
}

interface TrackFromDb {
  id: string,
  createdAt: Date,
  name: string,
  imageUrl: string,
  previewURL: string,
  winnerOf: { id: string }[]
  loserOf: { id: string }[]
}

const Home: NextPage = () => {
  // const trackCreation = api.track.createTrack.useMutation()
  // const duelCreation = api.duel.createDuel.useMutation()
  // const { data: sessionData } = useSession()
  // const { data: tracksInDb, refetch: refetchTracksFromDb } = api.track.getTracksFromDb.useQuery()
  // const { data: topOneHundredTracks } = api.track.getTopOneHundredAllTimeTracks.useQuery(sessionData?.user.id ?? '', {
  //   staleTime: 1000 * 60 * 60 * 24,
  //   cacheTime: 1000 * 60 * 60 * 24,
  // })

  // const [currentTracks, setCurrentTracks] = useState<[Track | null, Track | null]>()
 
  // useEffect(() => {
  //   topOneHundredTracks && getTwoRandomTracks(topOneHundredTracks) 
  // }, [topOneHundredTracks])

  // function getTwoRandomTracks(trackList: PlaylistTracksData) {
  //   const first = Math.floor(Math.random() * trackList.items.length);
  //   let second = Math.floor(Math.random() * trackList.items.length);

  //   while (first === second) {
  //     second = Math.floor(Math.random() * trackList.items.length);
  //   }

  //   setCurrentTracks([
  //     trackList.items[first]?.track ?? null,
  //     trackList.items[second]?.track ?? null
  //   ])
  // }

  // const handleVote = async (winnerIndex: number) => {
  //   const winner = currentTracks?.[winnerIndex]
  //   const loser = currentTracks?.[winnerIndex === 0 ? 1 : 0]

  //   //create a track for both winner and loser
  //   await trackCreation.mutateAsync({
  //     id: winner?.id ?? '',
  //     name: winner?.name ?? '',
  //     imageUrl: winner?.album?.images?.[0]?.url || '',
  //     previewURL: winner?.preview_url || '',
  //   })

  //   await trackCreation.mutateAsync({
  //     id: loser?.id ?? '',
  //     name: loser?.name ?? '',
  //     imageUrl: loser?.album?.images?.[0]?.url || '',
  //     previewURL: loser?.preview_url || '',
  //   })

  //   // Create a duel with a winner, loser, and the user who voted
  //   await duelCreation.mutateAsync({
  //     track1Id: currentTracks?.[0]?.id ?? '',
  //     track2Id: currentTracks?.[1]?.id ?? '',
  //     userId: sessionData?.user.id ?? '',
  //     winnerId: winner?.id ?? '',
  //     loserId: loser?.id ?? '',
  //   })

  //   topOneHundredTracks && getTwoRandomTracks(topOneHundredTracks)
  //   await refetchTracksFromDb()
  // }

  return (
    <>
      <Head>
        <title>HitPlay</title>
        <meta name='description' content='Find the best music for your playlists' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='flex flex-col items-center justify-center gap-12 px-4 py-1 w-full'>
        <h1 className='text-5xl text-[hsl(280,100%,70%)] font-extrabold tracking-tight sm:text-[5rem]'>Hitplay</h1>
        {/* <div className='flex gap-3 justify-around w-full'>
          <div className='flex flex-wrap gap-10 items-center justify-center'>
            {currentTracks?.[0] && currentTracks?.[1] && currentTracks?.map((track, i) => (
              <div key={track?.id} className='flex flex-col gap-6'>
                { track && <TrackCard track={track} />}
                <button onClick={() => void handleVote(i)} className='text-white font-bold border-2 rounded-full py-2 hover:bg-purple-600'>
                  Vote
                </button>
              </div>
            ))}
          </div>
          { tracksInDb && <TrackStandings tracks={tracksInDb} /> }
        </div> */}
        <AuthShowcase />
      </main>
    </>
  );
};

export default Home;

const TrackStandings = ({ tracks }: { tracks: TrackFromDb[] }) => {

  const tracksWithWinRate = tracks.map(track => {
    const totalDuels = track.winnerOf.length + track.loserOf.length
    const winRate = track.winnerOf.length / totalDuels

    return {
      ...track,
      winRate: winRate * 100
    }
  })

  const sortedTracks = tracksWithWinRate.sort((a, b) => b.winRate - a.winRate)

  return (
    <div className='border rounded p-6 w-[33%]'>
      <h1 className='font-bold text-3xl text-[hsl(280,100%,70%)] mb-3'>TRACK STANDINGS</h1>
      {sortedTracks?.slice(0, 20).map((track, i) => (
        <div key={track.id} className='text-white flex gap-3'>
          <div className='flex justify-between w-full'>
            <div>
              <span>{i + 1}. </span>
              <span className='font-semibold text-lg'>{track.name}</span>
            </div>
            <span className='text-[hsl(280,100%,70%)] font-bold'>
              {track.winRate.toFixed()}%
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

const TrackCard = ({ track } : { track: Track }) => {
  return (
    <div className='flex flex-col gap-3 p-6 items-center border-2 rounded'>
      { track.album.images?.[0]?.url && 
        <Image alt={track.name} src={track.album.images[0].url} width={300} height={300} />
      }
      <h1 className='text-white text-left w-full text-lg font-bold'>{track.name}</h1>
      { track.preview_url ?
        <audio className='w-full' src={track.preview_url} controls /> :
        <h1 className='text-white h-full'>This song is missing a preview :&#40;</h1>
      }
    </div>
  )
}

const AuthShowcase = () => {
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
