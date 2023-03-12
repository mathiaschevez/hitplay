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
  return(
    <div className='flex w-full justify-end p-3'>
      <Link href='/profile' className='text-white'>Profile</Link>
    </div>
  )
}