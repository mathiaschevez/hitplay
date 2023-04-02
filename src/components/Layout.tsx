import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { BsArrowBarLeft, BsArrowBarRight } from 'react-icons/bs'
import { MdOutlineCreate, MdOutlineMusicNote } from 'react-icons/md'
import { IoPersonOutline } from 'react-icons/io5'
import { GiMusicalNotes } from 'react-icons/gi'
import { CgCompress } from 'react-icons/cg'
import { selectSideBarOpen, setSideBarOpen } from '~/store/reducers/navigationSlice'
import { useAppDispatch, useAppSelector } from '~/hooks'
import { Spin } from 'antd'

export function Layout({ children } : { children: JSX.Element }) {
  const { data: sessionData, status } = useSession()
  const sidebarOpen = useAppSelector(selectSideBarOpen)

  return (
    <>
      { status === 'loading' ?
          <div className='flex flex-col min-h-screen bg-gradient-to-b from-[#090446] to-[#1A0BC1] w-screen items-center justify-center'>
            <Spin /> 
          </div> : 
        sessionData ?
          <div className='flex bg-gradient-to-b from-[#090446] to-[#1A0BC1]'>
            <Sidebar sidebarOpen={sidebarOpen} />
            <div className='flex flex-col justify-between w-full min-h-screen'>
              <Navbar sidebarOpen={sidebarOpen} />
              <div className={`${sidebarOpen ? 'ml-64' : 'ml-16'} mt-16 h-full`}>{children}</div>
            </div>
          </div> : <Auth />
      }
    </>
  )
}

function Navbar({ sidebarOpen }: { sidebarOpen: boolean }) {
  return(
    <div className={`${sidebarOpen ? 'pl-[280px]' : 'pl-20'} fixed h-16 border-b flex w-full justify-between pr-4 py-3 bg-[#0B132B] z-40`}>
      <Link href='/' className='text-white flex gap-3 items-center'>
        <Image alt='Home' src='/hitplaylogo.png' width={50} height={50} />
        <h1 className='text-3xl text-[#7165F6] font-extrabold'>Hitplay</h1>
      </Link>
      <button
        className="rounded-full bg-white/10 px-10 py-2 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={() => void signOut()}
      >
        {'Sign out'}
      </button>
    </div>
  )
}

function Sidebar({ sidebarOpen }: { sidebarOpen: boolean }) {
  const dispatch = useAppDispatch()

  return (
    <div className={`border-r ${sidebarOpen ? 'w-64' : 'w-16 items-center'} fixed flex flex-col p-3 h-full z-50 bg-[#0B132B]`}>
      <button onClick={() => dispatch(setSideBarOpen(!sidebarOpen))} className={`${sidebarOpen ? 'self-end' : 'self-center'} w-[30px] rounded-md p-1 text-white bg-white/10 hover:bg-white/20 mb-9`}>
        { sidebarOpen ? <BsArrowBarLeft size={24} /> : <BsArrowBarRight size={24} />}
      </button>
      <SideBarItem title='Create' icon={<MdOutlineCreate size={24} />} sideBarOpen={sidebarOpen} />
      <SideBarItem title='Tracks' icon={<MdOutlineMusicNote size={24} />} sideBarOpen={sidebarOpen} />
      <SideBarItem title='Playlists' icon={<GiMusicalNotes size={24} />} sideBarOpen={sidebarOpen} />
      <SideBarItem title='Artists' icon={<IoPersonOutline size={24} />} sideBarOpen={sidebarOpen} />
      <SideBarItem title='Duels' icon={<CgCompress size={24} />} sideBarOpen={sidebarOpen} />
    </div>
  )
}

function SideBarItem({ title, icon, sideBarOpen }: { title: string, icon: JSX.Element, sideBarOpen: boolean }) {
  return (
    <Link href={`/${title.toLowerCase()}`} className={`${sideBarOpen ? 'py-2' : 'p-1'} mb-6 rounded-lg text-center font-bold text-white text-lg bg-white/10 hover:bg-white/20`}>
      { sideBarOpen ? title : icon }
    </Link>
  )
}

function Auth() {
  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-b from-[#090446] to-[#1A0BC1] w-screen items-center justify-center'>
      <h1 className='text-5xl text-[#7165F6] font-extrabold sm:text-[5rem] mb-9'>Hitplay</h1>
      <button
        className='rounded-full w-72 bg-white/10 px-10 py-2 font-semibold text-white no-underline transition hover:bg-white/20'
        onClick={() => void signIn()}
      >
        Sign In
      </button>
    </div>
  )
}