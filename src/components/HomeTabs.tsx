import React, { useState } from 'react'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import Tracks from '~/tabs/Tracks'

const items: TabsProps['items'] = [
  {
    key: '1',
    label: `Songs`,
    children: <Tracks />,
  },
  {
    key: '2',
    label: `Albums`,
    children: `Content of Tab Pane 2`,
  },
  {
    key: '3',
    label: `Artists`,
    children: `Content of Tab Pane 3`,
  },
];


export function HomeTabs() {
  const [activeTab, setActiveTab] = useState('1')

  return (
    <Tabs 
      className='w-full' 
      activeKey={activeTab} 
      items={items} 
      onChange={(e) => setActiveTab(e)} 
    />
  )
}
