import { Avatar } from 'antd'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { api } from '~/utils/api'

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
        <Image alt='Home' src='/hitplaylogo.png' width={45} height={45} />
      </Link>
      <AuthShowcase />
    </div>
  )
}

const AuthShowcase = () => {
  const { data: sessionData } = useSession();
  const { data: accountData } = api.user.getAccountFromDb.useQuery(sessionData?.user.id ?? '')

  // const { data: secretMessage } = api.example.getSecretMessage.useQuery(
  //   undefined, // no input
  //   { enabled: sessionData?.user !== undefined },
  // );

  return (
    <div className="flex items-center justify-center gap-4">
      {/* <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p> */}
      <button
        className="rounded-full bg-white/10 px-10 py-2 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
      { (sessionData && accountData?.provider === 'spotify') && 
        <Link href='/profile' className='text-white'>
          <Avatar size={39} src={sessionData?.user.image}/>
        </Link>
      }
    </div>
  );
}
