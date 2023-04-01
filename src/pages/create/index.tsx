import Head from 'next/head'
import React from 'react'
import { Layout } from '~/components/Layout'

const Create = () => {
  return (
    <>
      <Head>
        <title>Create</title>
        <meta name='description' content='Find the best music for your playlists' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Layout>
        <div>Create</div>
      </Layout>
    </>
  )
}

export default Create