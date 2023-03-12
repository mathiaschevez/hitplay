import { Avatar } from 'antd'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

export function Layout({ children } : { children: JSX.Element }) {
  return (
    <div className='flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]'>
      <Navbar />
      {children}
    </div>
  )
}

function Navbar() {
  const { data: sessionData } = useSession()

  return(
    <div className='flex items-center w-full justify-end gap-12 px-8 py-3'>
      <Link href='/profile' className='text-white'>
        <Avatar src={sessionData?.user.image}/>
      </Link>
    </div>
  )
}