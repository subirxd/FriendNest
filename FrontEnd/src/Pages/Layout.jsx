import React, { useState } from 'react'
import Sidebar from '../Components/Sidebar'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react';
import { dummyUserData } from '../assets/assets';
import Loading from '../Components/Loading';

const Layout = () => {
  const user = dummyUserData
  const [sideBarOpen, setSideBarOpen] = useState(false);
  return user ? (
    <div className='w-full flex h-screen'>
    <Sidebar sideBarOpen = {sideBarOpen} setSideBarOpen ={setSideBarOpen} />
    
    <div className='flex-1 bg-slate-50'>
      <Outlet />
    </div>

    {
      sideBarOpen ? 
      <X className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden' 
        onClick={() => setSideBarOpen(false)}
      />
      : <Menu className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden'  
        onClick={() => setSideBarOpen(true)}
      />
    }
    </div>
  ) : (
    <Loading />
  )
}

export default Layout