import React, { useState, useEffect } from 'react'
import Head from "next/head";
import { type NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { api } from '~/utils/api';
import Image from 'next/image';
import { Spin } from 'antd';

interface TrackFromDb {
  id: string,
  createdAt: Date,
  name: string,
  imageUrl: string,
  previewURL: string,
  winnerOf: { id: string }[]
  loserOf: { id: string }[]
}

const Duels: NextPage = () => {
  // const [impactText, setImpactText] = useState<string | null>(null)
  const duelCreation = api.duel.createDuel.useMutation()
  const { data: sessionData } = useSession()
  const { data: tracksInDb, refetch: refetchTracksFromDb } = api.track.getTracksFromDb.useQuery()
  // const { data: trackImpact, refetch: refetchTrackImpact } = api.impact.getTrackImpact.useQuery({ text: impactText })

  const [currentTracks, setCurrentTracks] = useState<[TrackFromDb | null, TrackFromDb | null]>()
 
  useEffect(() => {
    tracksInDb && !currentTracks && getTwoRandomTracks(tracksInDb) 
  }, [tracksInDb, currentTracks])

  function getTwoRandomTracks(trackList: TrackFromDb[]) {
    const first = Math.floor(Math.random() * trackList.length);
    let second = Math.floor(Math.random() * trackList.length);

    while (first === second) {
      second = Math.floor(Math.random() * trackList.length);
    }

    setCurrentTracks([
      trackList[first] ?? null,
      trackList[second] ?? null
    ])
  }

  const handleVote = async (winnerIndex: number) => {
    if(sessionData) {
      const winner = currentTracks?.[winnerIndex]
      const loser = currentTracks?.[winnerIndex === 0 ? 1 : 0]
      
      await duelCreation.mutateAsync({
        track1Id: currentTracks?.[0]?.id ?? '',
        track2Id: currentTracks?.[1]?.id ?? '',
        userId: sessionData.user.id ?? '',
        winnerId: winner?.id ?? '',
        loserId: loser?.id ?? '',
      })

      await refetchTracksFromDb()
    }

    tracksInDb && getTwoRandomTracks(tracksInDb)
  }

  // const handleGetTrackImpact = async (text: string) => {
  //   setImpactText(text)
  //   const response = await refetchTrackImpact()
  //   console.log(response, 'RESPONSE HERE')
  // }

  return (
    <>
      <Head>
        <title>Duels</title>
        <meta name='description' content='Find the best music for your playlists' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='flex flex-col items-center justify-center p-10 w-full flex-1'>
        <h1 className='text-white font-bold text-5xl mb-6'>DUELS</h1>
        {/* <h1 className='text-white font-bold text-5xl'>{trackImpact}</h1> */}
        {/* <button onClick={() => void handleGetTrackImpact('What is the difference between 500 and 1000')}>BUTTON</button> */}
        <div className='flex flex-col xl:flex-row gap-10 xl:gap-0 justify-around w-full flex-1 items-center'>
          { tracksInDb && currentTracks ?
            <>
              <div className='flex flex-wrap gap-16 items-center justify-center mt-10 xl:mt-0'>
                {currentTracks?.[0] && currentTracks?.[1] && currentTracks?.map((track, i) => (
                  <div key={track?.id} className='flex flex-col gap-6'>
                    { track && <TrackCard track={track} />}
                    <button onClick={() => void handleVote(i)} className='text-white font-bold border-2 rounded-full py-2 bg-white/10 hover:bg-white/20'>
                      Vote
                    </button>
                  </div>
                ))}
              </div>
              <TrackStandings tracks={tracksInDb} />
            </> : 
            <Spin />
          }
        </div>
      </main>
    </>
  )
}

export default Duels

const TrackStandings = ({ tracks }: { tracks: TrackFromDb[] }) => {
  const { data: sessionData } = useSession()

  const tracksWithWinRate = tracks.map(track => {
    const totalDuels = track.winnerOf.length + track.loserOf.length
    const winRate = totalDuels === 0 ? 0 : track.winnerOf.length / totalDuels

    return {
      ...track,
      winRate: winRate * 100
    }
  })

  const sortedTracks = tracksWithWinRate.sort((a, b) => b.winRate - a.winRate)

  return (
    <div className='bg-[#0B132B] shadow-lg rounded-2xl p-6 w-full xl:w-[33%]'>
      <div className='flex flex-col mb-6 gap-1'>
        <h1 className='font-extrabold text-3xl text-[#7165F6]'>TRACK STANDINGS</h1>
        { !sessionData && <h1 className='text-white font-bold'>Sign in to update standings!</h1>}
      </div>
      <div className='flex flex-col gap-1'>
        {sortedTracks?.slice(0, 20).map((track, i) => (
          <div key={track.id} className='flex justify-between w-full text-white'>
            <div>
              <span>{i + 1}. </span>
              <span className='font-semibold text-lg'>{track.name}</span>
            </div>
            <span className='text-[#7165F6] font-bold'>
              {track.winRate.toFixed()}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const TrackCard = ({ track } : { track: TrackFromDb }) => {
  const { data: sessionData } = useSession()

  return (
    <div className='flex flex-col gap-3 p-6 items-center bg-[#0B132B] shadow-lg rounded-2xl '>
      { track.imageUrl && <Image alt={track.name} src={track.imageUrl} width={315} height={315} />}
      <h1 className='text-white text-left w-full text-lg font-extrabold'>{track.name}</h1>
      { sessionData?.user ?
        <>
          { track.previewURL ?
            <audio className='w-full' src={track.previewURL} controls /> :
            <h1 className='text-white h-full font-bold'>This song is missing a preview :&#40;</h1>
          }
        </> :
        <h1 className='text-white h-full font-bold'>Sign in to hear a preview!</h1>
      }
    </div>
  )
}

