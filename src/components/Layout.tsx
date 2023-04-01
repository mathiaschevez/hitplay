import { useState } from 'react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { BsArrowLeftSquare } from 'react-icons/bs'
import { BsArrowRightSquare } from 'react-icons/bs'

export function Layout({ children } : { children: JSX.Element }) {
  return (
    <div className='flex min-h-screen bg-gradient-to-b from-[#090446] to-[#1A0BC1]'>
      <Sidebar />
      <div className='flex flex-col min-h-screen justify-between w-full'>
        <Navbar />
        {children}
      </div>
    </div>
  )
}

function Navbar() {
  return(
    <div className='flex items-center w-full justify-between gap-12 px-8 py-3 border-b'>
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

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className={`border-r ${sidebarOpen ? 'w-72' : ''} flex flex-col p-3`}>
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className='flex justify-end text-white mb-9'>
        { sidebarOpen ? <BsArrowLeftSquare size={30} /> : <BsArrowRightSquare size={30} />}
      </button>
      <SideBarItem title='Create' sideBarOpen={sidebarOpen} />
      <SideBarItem title='Songs' sideBarOpen={sidebarOpen} />
      <SideBarItem title='Playlists' sideBarOpen={sidebarOpen} />
      <SideBarItem title='Duels' sideBarOpen={sidebarOpen} />
    </div>
  )
}

function SideBarItem({ title, sideBarOpen }: { title: string, sideBarOpen: boolean }) {
  return (
    <Link href={`/${title.toLowerCase()}`} className='p-3 mb-6 border-2 rounded-lg text-center font-bold text-white text-lg hover:bg-white hover:text-black'>
      {sideBarOpen ? title : ''}
    </Link>
  )
}

// const AuthShowcase = () => {
//   const { data: sessionData } = useSession();

//   return (
//     <div className="flex items-center justify-center gap-4">
//       <button
//         className="rounded-full bg-white/10 px-10 py-2 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//       {/* { sessionData && 
//         <Link href='/profile' className='text-white'>
//           <Avatar size={39} src={sessionData?.user.image}/>
//         </Link>
//       } */}
//     </div>
//   );
// }
