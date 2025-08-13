import React from 'react'
import { menuItemsData } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { Icon } from 'lucide-react'

const MenuItems = ({setSideBarOpen}) => {
  return (
    <div className='px-6 text-gray-600 space-y-1 font-medium'>
        {
            menuItemsData.map((menu, index) => {
                return (
                    <NavLink key={index} to={menu.to} end={menu.to === '/'}
                    onClick={() => setSideBarOpen(false)}
                    className={({isActive}) => `px-3.5 py-2 flex items-center gap-3 rounded-xl 
                    ${isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                    >
                    <menu.Icon className='w-5 h-5' />
                    {menu.label}
                    </NavLink>
                )
            })
        }
    </div>
  )
}

export default MenuItems