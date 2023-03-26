// import { Avatar } from 'antd'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export function Layout({ children } : { children: JSX.Element }) {
  return (
    <div className='flex min-h-screen flex-col items-center bg-gradient-to-b from-[#090446] to-[#1A0BC1] pb-8'>
      <Navbar />
      {children}
    </div>
  )
}

function Navbar() {
  return(
    <div className='flex items-center w-full justify-between gap-12 px-8 pt-6 pb-3'>
      <Link href='/' className='text-white'>
        <Image alt='Home' src='/hitplaylogo.png' width={50} height={50} />
      </Link>
      <AuthShowcase />
    </div>
  )
}

const AuthShowcase = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        className="rounded-full bg-white/10 px-10 py-2 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
      {/* { sessionData && 
        <Link href='/profile' className='text-white'>
          <Avatar size={39} src={sessionData?.user.image}/>
        </Link>
      } */}
    </div>
  );
}
