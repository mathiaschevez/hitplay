import { Avatar, Tabs, type TabsProps } from 'antd'
import { type NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import React, { useState } from 'react'
import { api } from '~/utils/api'
import { type Track } from '~/utils/types'

const ProfilePage: NextPage = () => {
  const { data: sessionData } = useSession()
  // const { data: user } = api.user.getCurrentUser.useQuery(sessionData?.user.id ?? '')

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name='description" content="Find the best music for your playlists' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='w-full flex-1'>
        <div className='flex p-8 pb-0 gap-9'>
          <Avatar src={sessionData?.user.image} size={200}/>
          <div>
            <h1 className='text-white font-bold text-3xl'>{sessionData?.user.name}</h1>
            <h1 className='text-white text-xl font-semibold'>{sessionData?.user.email}</h1>
          </div>
        </div>
        <ProfileTabs />
      </main>
    </>
  )
}

export default ProfilePage

function ProfileTabs() {
  const [activeTab, setActiveTab] = useState('1')

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: `Your Top Tracks`,
      children: <TopTracksTab />,
    },
    {
      key: '2',
      label: `Your Top Artists`,
      children: <TopArtistsTab />,
    },
  ];

  return (
    <Tabs 
      centered
      className='w-full h-full'
      activeKey={activeTab} 
      items={tabItems} 
      onChange={(e) => setActiveTab(e)} 
    />
  )
}

function TopTracksTab() {
  const { data: sessionData } = useSession()
  const { data: topTracks } = api.user.getCurrentUserTopTracks.useQuery(sessionData?.user.id ?? '')

  return (
    <div className='grid grid-cols-4 gap-6 px-8 pb-6'>
      {topTracks?.items.map((track, i: number) => (
        <TopTrack key={track.id} track={track} rank={i + 1} />
      ))}
    </div>
  )
}

function TopTrack({ track, rank } : { track: Track, rank: number }) {
  return (
    <div 
      style={{ backgroundColor: 'rgba(171, 119, 248, .25)' }} 
      className='border-2 flex p-3 rounded gap-3'
    >
      <h1 className='font-bold'>{rank}.</h1>
      <div className='flex flex-col'>
        { track.album.images[0]?.url && <Image alt={track.name} src={track.album.images[0].url} width={200} height={200} /> }
        <h1 className='font-bold'>{track.name}</h1>
        {track.artists.map(artist => (
          <h1 key={artist.id}>{artist.name}</h1>
        ))}
      </div>
    </div>
  )
}

function TopArtistsTab() {
  const { data: sessionData } = useSession()
  const { data: topArtists } = api.user.getCurrentUserTopArtists.useQuery(sessionData?.user.id ?? '')


  return (
    <div>
      here
    </div>
  )
}