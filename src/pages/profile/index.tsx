import { Avatar, Tabs, type TabsProps } from 'antd'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { api } from '~/utils/api'

const ProfilePage = () => {
  const { data: sessionData } = useSession()
  // const { data: user } = api.user.getCurrentUser.useQuery(sessionData?.user.id ?? '')

  return (
    <div className='border w-full flex-1'>
      <div className='flex p-8 pb-0 gap-3'>
        <Avatar src={sessionData?.user.image} size={200}/>
        <div>
          <h1 className='text-white font-bold text-3xl'>{sessionData?.user.name}</h1>
          <h1 className='text-white text-xl font-semibold'>{sessionData?.user.email}</h1>
        </div>
      </div>
      <ProfileTabs />
    </div>
  )
}

export default ProfilePage

function ProfileTabs() {
  const [activeTab, setActiveTab] = useState('1')

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: `Tracks`,
      children: <TopTracksTab />,
    },
    {
      key: '2',
      label: `Albums`,
      children: `Fetch user albums and sort them by play percentage`,
    },
    {
      key: '3',
      label: `Artists`,
      children: `Fetch user artists and sort them by play percentage`,
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

  console.log(topTracks, 'topTracks')

  return (
    <div>
      {topTracks?.items.map(track => (
        <div key={track.id}>{track.name}</div>
      ))}
    </div>
  )
}