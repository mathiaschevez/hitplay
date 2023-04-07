import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import React from 'react'
import { api } from '~/utils/api'
import { Input, Tabs } from 'antd'
import { addSelectedTrack, clearSelectedTracks, removeSelectedTrack, selectSelectedPlaylist, selectSelectedTracks, setSelectedPlaylist } from '~/store/reducers/creationSlice'
import { useAppDispatch, useAppSelector } from '~/hooks'
import { type Playlist, type Track } from '~/utils/types'
import { VscDiffAdded } from 'react-icons/vsc'
import { AiFillCheckCircle } from 'react-icons/ai'
import Image from 'next/image'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useDispatch } from 'react-redux'

const Create = () => {
  const [activeSection, setActiveSection] = useState<'create' | 'add'>('create')

  return (
    <>
      <Head>
        <title>Create</title>
        <meta name='description' content='Find the best music for your playlists' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='flex h-full'>
        <div className='flex flex-col w-full'>
          <h1 className='text-white text-5xl font-bold mb-6 px-6 pt-6'>CREATE</h1>
          <div className='flex w-full justify-between border-b pb-6 px-6'>
              <button onClick={() => setActiveSection('create')} className={`${activeSection === 'create' ? 'bg-white text-black' : 'text-white'} font-bold border-2 py-2 px-3 rounded-lg text-xl hover:bg-white hover:text-black`}>
              Create a new playlist
            </button>
            <button onClick={() => setActiveSection('add')} className={`${activeSection === 'add' ? 'bg-white text-black' : 'text-white'} font-bold border-2 py-2 px-3 rounded-lg text-xl hover:bg-white hover:text-black`}>
              Add to an existing playlist
            </button>
          </div>
          { activeSection === 'create' ? <CreateSection /> : <AddSection /> }
        </div>
      </main>
    </>
  )
}

export default Create

const CreateSection = () => {
  const dispatch = useAppDispatch()
  const selectedTracks = useAppSelector(selectSelectedTracks)
  const { data: sessionData } = useSession()
  const { data: spotifyUser } = api.user.getCurrentUser.useQuery(sessionData?.user.id ?? '')
  const playlistCreation = api.playlist.createPlaylist.useMutation()
  const addTracksToPlaylist = api.playlist.addTracksToPlaylist.useMutation()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [activeTab, setActiveTab] = useState<string>('1')

  const handlePlaylistCreation = async () => {
    if (!sessionData || !spotifyUser) return
    const playlist = await playlistCreation.mutateAsync({
      userId: sessionData.user.id,
      userSpotifyId: spotifyUser.id,
      title,
      description
    })

    if(playlist?.id && selectedTracks.length > 0) {
      const playlistWithTracks = await addTracksToPlaylist.mutateAsync({
        userId: sessionData.user.id,
        playlistId: playlist?.id,
        trackList: selectedTracks.map(track => track.uri)
      })

      console.log(playlistWithTracks, 'PLAYLIST WITH TRACKS')
    }

    dispatch(clearSelectedTracks())
    setTitle('')
    setDescription('')
  }

  const items = [
    { key: '1', 
      label: 'Recommended Tracks', 
      children: <CreateSectionRecommendedTracksTab selectedTracks={selectedTracks} /> },
    { key: '2',
    label: 'Search',
    children: <CreateSectionSearchTab /> },
    { key: '3', 
      label: 'Selected Tracks',
      disabled: selectedTracks.length === 0,
      children: <CreateSectionSelectedTracksTab selectedTracks={selectedTracks} /> },
  ]

  return (
    <div className='flex flex-col p-6'>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} className='bg-[#0B132B] border-2 w-1/2 border-white font-bold' placeholder='Title' />
      <Input value={description} onChange={(e) => setDescription(e.target.value)} className='bg-[#0B132B] w-1/2 border-2 border-white font-bold mt-6' placeholder='Description' />
      <Tabs className='mt-3' onChange={setActiveTab} activeKey={activeTab} items={items} />
      <button disabled={!title} onClick={() => void handlePlaylistCreation()} className={`${!title ? 'cursor-not-allowed' : 'hover:bg-white/30'} rounded-lg w-full bg-white/20 text-white py-3 px-2 text-lg font-bold mt-3`}>Create</button>
    </div>
  )
}

const CreateSectionRecommendedTracksTab = ({ selectedTracks }: { selectedTracks: Track[]}) => {
  const dispatch = useDispatch()
  const { data: sessionData } = useSession()
  const { data: userTopTracks } = api.user.getCurrentUserTopTracks.useQuery(sessionData?.user.id ?? '')

  return (
    <div className='flex gap-3'>
      <div className='flex flex-col w-1/2'>
        <h1 className='font-bold text-xl mb-3'>Your Top Tracks</h1>
        <div className='flex flex-col overflow-y-scroll max-h-[400px] gap-3 pr-3 bg-[#0B132B] rounded-lg shadow-lg'>
          { userTopTracks?.items.map((track) => (
            <div key={track.id} className='text-white border-b px-3 py-2 flex justify-between'>
              <div>{track.name}</div>
              { selectedTracks.find((selectedTrack) => selectedTrack.id === track.id) ? 
                <button onClick={() => dispatch(removeSelectedTrack({ trackId: track.id }))}><AiFillCheckCircle size={27} /></button> :
                <button onClick={() => dispatch(addSelectedTrack(track))}><VscDiffAdded size={27} /></button>
              }
            </div>
          ))}
        </div>
      </div>
      <AiRecommendations />
    </div>
  )
}

const AiRecommendations = () => {
  // const { data: aiRecommendations } = api.ai.getAiRecommendedTracks.useQuery(['Runaway, Goodnews, Moonlight'])
  // console.log(aiRecommendations, 'AI RECOMMENDATIONS')

  return (
    <div className='flex flex-col w-1/2'>
      <h1 className='font-bold text-xl mb-3'>Ai Recommended Tracks</h1>
      <div className='flex flex-col overflow-y-scroll max-h-[400px] gap-3 pr-3 bg-[#0B132B] rounded-lg shadow-lg'>
        {/* { aiRecommendations?.map((track) => (
          <div key={track.title}>{track.title}</div>
        ))} */}
      </div>
    </div>
  )
}

const CreateSectionSearchTab = () => {
  return (
    <div className='flex flex-col gap-3'>
      <Input className='bg-[#0B132B] border-2 border-white font-bold' placeholder='Search' />
      <div className='flex flex-col overflow-y-scroll max-h-[400px] gap-3 pr-3 bg-[#0B132B] rounded-lg shadow-lg'>
      </div>
    </div>
  )
}

const CreateSectionSelectedTracksTab = ({ selectedTracks }: { selectedTracks: Track[] }) => {
  return (
    <div className='border-2 rounded-lg bg-[#0B132B] overflow-y-scroll max-h-[400px] w-[50%]'>
      <h1 className='px-3 py-2 text-white border-b font-bold text-lg'>Songs in Playlist</h1>
      { selectedTracks.map((track) => (
        <div key={track.id} className='text-white border-b px-3 py-2 flex justify-between'>
          <div>{track.name}</div>
        </div>  
      ))}
    </div>
  )
}

const AddSection = () => {
  const selectedPlaylist = useAppSelector(selectSelectedPlaylist)
  const [activeTab, setActiveTab] = useState(selectedPlaylist ? '2' : '1')

  const items = [
    { key: '1', 
      label: 'Item 1',
      children: <PlaylistOptionsTab setActiveTab={setActiveTab}/> },
    { key: '2',
      label: 'Item 2',
      children: <EditPlaylistTab setActiveTab={setActiveTab} selectedPlaylist={selectedPlaylist} /> },
  ]

  return (
    <Tabs activeKey={activeTab} tabBarStyle={{ display: 'none' }} items={items} />
  )
}

function PlaylistOptionsTab({ setActiveTab }: { setActiveTab: (_: string) => void }) {
  const dispatch = useAppDispatch()
  const { data: sessionData } = useSession()
  const { data: spotifyUser } = api.user.getCurrentUser.useQuery(sessionData?.user.id ?? '')
  const { data: usersPlaylists } = api.playlist.getUserPlaylists.useQuery(sessionData?.user.id ?? '')

  function handleSelectPlaylist(playlist: Playlist) {
    dispatch(setSelectedPlaylist(playlist))
    setActiveTab('2')
  }

  return (
    <div className='p-6'>
      <h1 className='font-bold text-white text-3xl'>Select a playlist to add to:</h1>
      <div className='grid grid-cols-4 gap-6'>
        { usersPlaylists?.filter(playlist => playlist.owner.id === spotifyUser?.id).map((playlist) => (
          <button onClick={() => handleSelectPlaylist(playlist)} key={playlist.id} className='bg-[#0B132B] border-2 border-white rounded-lg mt-6 p-3'>
            {playlist.images[0] && <Image src={playlist.images[0].url} className='mb-3' alt={playlist.name} width={300} height={300} />}
            <h1 className='font-bold text-white text-lg'>{playlist.name}</h1>
          </button>
        ))}
      </div>
    </div>
  )
}

function EditPlaylistTab({ setActiveTab, selectedPlaylist }: { setActiveTab: (_: string) => void, selectedPlaylist: Playlist | null }) {
  const { data: sessionData } = useSession()
  const { data: spotifyPlaylist } = api.playlist.getPlaylistById.useQuery({ userId: sessionData?.user.id ?? '', playlistId: selectedPlaylist?.id ?? '' })

  return (
    !selectedPlaylist ? <div className='p-3 text-white'>Something went wrong please try again...</div> :
      <div className='flex flex-col gap-6 p-6'>
        <button className='w-28 rounded-lg p-1 flex items-center gap-3 text-xl font-bold bg-white/10 hover:bg-white/20' onClick={() => setActiveTab('1')}><IoMdArrowRoundBack size={30}/> Back</button>
        <div className='flex gap-6'>
          {selectedPlaylist.images[0]?.url && <Image src={selectedPlaylist.images[0].url} alt={selectedPlaylist.name} width={300} height={300} />}
          <div className='flex flex-col gap-3'>
            <h1 className='text-white text-4xl font-bold'>{selectedPlaylist.name}</h1>
            <h1 className='font-bold text-lg'>{selectedPlaylist.tracks.total} Total Tracks</h1>
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          {spotifyPlaylist?.items.map((track, i) => (
            <div className='flex gap-3 items-center bg-[#0B132B] shadow-lg rounded-lg p-3' key={track.track.name}>
              {track.track.album.images[0] && <Image src={track.track.album.images[0].url} alt={track.track.name} width={50} height={50} />}
              <h1 className='font-bold'>{i + 1}. {track.track.name}</h1>
            </div>
          ))}
        </div>
      </div>
  )
}