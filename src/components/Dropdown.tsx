'use client'

import settings from './settings.svg'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'


export default function Dropdown() {
  return (
    <Menu as="div" className="relative inline-block">
      <div>
        <MenuButton className="inline-flex w-full justify-center rounded-full px-3 py-2 text-sm font-semibold">
            <img alt="" src="/assets/dropdown.svg"className="h-8 w-auto"/>
        </MenuButton>
      </div>
      <MenuItems
        transition
        className="absolute w-full justify-center px-3 py-3 mt-2 rounded-full bg-black"
      >
        <div className="py-1">
          <MenuItem>
            <a
              href="#"
              className="inline-flex w-full rounded-full hover:bg-gray-100"
            >
              <img alt="" src="/assets/home.svg"className="h-8 w-auto"/>
            </a>
          </MenuItem>
          <MenuItem>
            <a
              href="#"
              className="inline-flex w-full rounded-full hover:bg-gray-100"
            >
              <img alt="" src="/assets/calendar_today.svg"className="h-8 w-auto"/>
            </a>
          </MenuItem>
          <MenuItem>
            <a
              href="#"
              className="inline-flex w-full rounded-full hover:bg-gray-100"
            >
              <img alt="" src="/assets/feature_search.svg"className="h-8 w-auto"/>
            </a>
          </MenuItem>
          <form action="#" method="POST">
            <MenuItem>
              <a
                href="#"    
                className="inline-flex w-full rounded-full hover:bg-gray-100"
              >
                <img alt="" src="/assets/settings.svg" className="h-8 w-auto"/>
              </a>
            </MenuItem>
          </form>
        </div>
      </MenuItems>
    </Menu>
  )
}