"use client"

import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import {
  Bars3BottomLeftIcon,
  BookmarkIcon,
  CircleStackIcon,
  Cog8ToothIcon,
  DocumentTextIcon,
  FolderIcon,
  HeartIcon,
  HomeIcon,
  InboxIcon,
  // PhotoIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Fragment, useState } from 'react'



const userDropDownNavigation = [
  { name: 'Settings', href: '/dashboard/account-settings' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export default function DashboardLayout({ siteSettings, children, user, userInfo }) {
  // const user = useAuthStore((state) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { footer_logo_img, logo_alt } = siteSettings[0];

  let navigation;
  // const clearUser = useAuthStore((state) => state.clearUser);


  if (user) {
    switch (user.role) {
      case "admin":
        navigation = AdminNavigation;
        break;
      case "user":
        navigation = UserNavigation;
        break;
      case "reporter":
        navigation = ReporterNavigation;
        break;
      case "editor":
        navigation = EditorNavigation;
        break;
      default:
        // navigation = AdminNavigation;
        break;
    }
  }
  if (user?.isSuperAdmin) {
    navigation = [...navigation, ...SuperAdminNavigation];
  }


  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/login' });  // Redirects user to the login page
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <>
      <div>
        {/* Sidebar for small screens */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-[#1f2937] pt-5 pb-4">

                  {/* <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child> */}
                  <div className="flex flex-shrink-0 items-center px-4">
                    <Link href={"/"}>
                      <Image
                        className='w-[300px] h-[50px] object-cover'
                        src={footer_logo_img ? (`/assets/images/${footer_logo_img}`) : "https://placehold.co/300x50.png"}
                        alt={logo_alt}
                        width={300}
                        height={50}
                      // blurDataURL="data:..." automatically provided
                      // placeholder="blur" // Optional blur-up while loading
                      />
                    </Link>
                  </div>
                  <div className="mt-5 flex flex-grow flex-col">
                    <nav className="flex-1 space-y-1 px-2" aria-label="Sidebar">
                      {navigation?.map((item) =>
                        !item.children ? (
                          <div key={item.name}>
                            <Link
                              href={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className={classNames(
                                item.current
                                  ? 'bg-gray-900 text-gray-100'
                                  : ' text-gray-400 hover:text-gray-100',
                                'group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md'
                              )}
                            >
                              <item.icon
                                className={classNames('mr-3 flex-shrink-0 h-6 w-6'
                                )}
                                aria-hidden="true"
                              />
                              {item.name}
                            </Link>
                          </div>
                        ) : (
                          <Disclosure as="div" key={item.name} className="space-y-1">
                            {({ open }) => (
                              <>
                                <Disclosure.Button
                                  className={classNames(
                                    item.current
                                      ? 'bg-gray-900 text-gray-100'
                                      : 'text-gray-400 hover:text-gray-100',
                                    'group w-full text-left flex items-center pl-2 py-2 text-sm font-medium rounded-md'
                                  )}
                                >
                                  <item.icon
                                    className="mr-3 h-6 w-6 flex-shrink-0"
                                    aria-hidden="true"
                                  />
                                  <span className="flex-1">{item.name}</span>
                                  <svg
                                    className={classNames(
                                      open ? 'text-gray-100 rotate-90' : 'text-gray-300',
                                      'ml-3 h-5 w-5 flex-shrink-0 transform transition-colors duration-150 ease-in-out'
                                    )}
                                    viewBox="0 0 20 20"
                                    aria-hidden="true"
                                  >
                                    <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                                  </svg>
                                </Disclosure.Button>
                                <Disclosure.Panel className="space-y-1">
                                  {item.children.map((subItem) => (
                                    <Link
                                      key={subItem.name}
                                      href={subItem.href}
                                      onClick={() => setSidebarOpen(false)}
                                      className="group flex w-full items-center rounded-md py-2 pl-11 pr-2 text-sm font-medium text-gray-400 hover:text-gray-100" >
                                      {subItem.name}
                                    </Link>
                                  ))}
                                </Disclosure.Panel>
                              </>
                            )}
                          </Disclosure>
                        )
                      )}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-20 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="dashboard-sidebar hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col bg-[#1f2937]">
          <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 pt-5">
            <div className="flex flex-shrink-0 items-center px-4">
              <Link href={"/"}>
                <Image
                  className='w-[300px] h-[50px] object-cover'
                  src={footer_logo_img ? (`/assets/images/${footer_logo_img}`) : "https://placehold.co/300x50.png"}
                  alt={logo_alt}
                  width={300}
                  height={50}
                // blurDataURL="data:..." automatically provided
                // placeholder="blur" // Optional blur-up while loading
                />
              </Link>
            </div>
            <div className="mt-5 flex flex-grow flex-col">
              <nav className="flex-1 space-y-1 px-2" aria-label="Sidebar">
                {navigation?.map((item) =>
                  !item.children ? (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-gray-900 text-gray-100'
                            : ' text-gray-400 hover:text-gray-100',
                          'group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            'mr-3 flex-shrink-0 h-6 w-6'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </div>
                  ) : (
                    <Disclosure as="div" key={item.name} className="space-y-1">
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={classNames(
                              item.current
                                ? 'bg-gray-900 text-gray-100'
                                : 'text-gray-400 hover:text-gray-100',
                              'group w-full text-left flex items-center pl-2 py-2 text-sm font-medium rounded-md'
                            )}
                          >
                            <item.icon
                              className="mr-3 h-6 w-6 flex-shrink-0"
                              aria-hidden="true"
                            />
                            <span className="flex-1">{item.name}</span>
                            <svg
                              className={classNames(
                                open ? 'text-gray-100 rotate-90' : 'text-gray-300',
                                'ml-3 h-5 w-5 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-gray-400'
                              )}
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                            </svg>
                          </Disclosure.Button>
                          <Disclosure.Panel className="space-y-1">
                            {item.children.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="group flex w-full items-center rounded-md py-2 pl-11 pr-2 text-sm font-medium text-gray-400 hover:text-gray-100"
                              >
                                {subItem.name}
                              </Link>
                            ))}

                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  )
                )}
              </nav>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col md:pl-64">
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex flex-1 justify-between px-4">
              <div className="flex flex-1 items-center mx-4">
                {/* <h3 className="text-base font-medium text-gray-900"> {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Dashboard</h3> */}
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                <p> Welcome, {user?.name}</p>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1091ff] focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <Image
                        className='h-8 w-8 rounded-full'
                        src={(user?.image ?? `/assets/images/${userInfo?.profile_image_url}`) || "/assets/images/users/user.png"}
                        alt={user?.name}
                        width={50}
                        height={50}
                      // blurDataURL="data:..." automatically provided
                      // placeholder="blur" // Optional blur-up while loading
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userDropDownNavigation?.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                              href={item.href}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              {item.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'w-full text-left block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            Log out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main className="flex-1">
            <div className="mt-2">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

const AdminNavigation = [
  {
    name: 'Dashboard', icon: HomeIcon,
    // current: true, 
    href: '/dashboard'
  },
  {
    name: 'Posts',
    icon: DocumentTextIcon,
    current: false,
    children: [
      { name: 'Add Post', href: '/dashboard/add-post' },
      { name: 'Posts List', href: '/dashboard/posts-list' },
      { name: 'Posts Comments', href: '/dashboard/comments' },
      // { name: 'Pending Posts', href: '/pending-posts' },
    ],
  },
  {
    name: 'Category',
    icon: CircleStackIcon,
    current: false,
    children: [
      { name: 'Category List', href: '/dashboard/category-list' },
    ],
  },
  {
    name: 'Breaking News',
    icon: DocumentTextIcon,
    current: false,
    href: '/dashboard/breaking-news'
  },
  {
    name: 'Editors',
    icon: UsersIcon,
    current: false,
    children: [
      { name: 'Editors List', href: '/dashboard/editors-list' },
    ],
  },
  {
    name: 'Reporters',
    icon: UsersIcon,
    current: false,
    children: [
      // { name: 'Add Reporter', href: '/dashboard/add-reporter' },
      { name: 'Reporter List', href: '/dashboard/reporters-list' },
    ],
  },
  { name: 'Inbox', icon: InboxIcon, href: '/dashboard/mailbox' },

]

const SuperAdminNavigation = [
  {
    name: 'Users',
    icon: UsersIcon,
    current: false,
    children: [
      { name: 'Users List', href: '/dashboard/users-list' },
    ],
  },
  {
    name: 'Meta Info',
    icon: FolderIcon,
    current: false,
    children: [
      { name: 'Add Meta Info', href: '/dashboard/add-page' },
      { name: 'Pages List', href: '/dashboard/pages-list' },
    ],
  },
  {
    name: 'General Settings',
    icon: Cog8ToothIcon,
    current: false,
    children: [
      // { name: 'Settings', href: '/settings' },
      { name: 'Site', href: '/dashboard/site-settings' },
      { name: 'Socials', href: '/dashboard/social-settings' },
    ],
  },
]

const UserNavigation = [
  {
    name: 'Dashboard', icon: HomeIcon,
    current: false,
    href: '/dashboard'
  },
  {
    name: 'Favorite News',
    icon: HeartIcon,
    current: false,
    href: '/dashboard/favorite-news'
  },
  {
    name: 'Bookmarked News',
    icon: BookmarkIcon,
    current: false,
    href: '/dashboard/bookmark-news'
  }
]

const ReporterNavigation = [
  {
    name: 'Dashboard', icon: HomeIcon,
    // current: true, 
    href: '/dashboard'
  },
  {
    name: 'Posts',
    icon: DocumentTextIcon,
    current: false,
    children: [
      { name: 'Add Post', href: '/dashboard/add-post' },
      { name: 'Posts List', href: '/dashboard/posts-list' },
      // { name: 'Pending Posts', href: '/pending-posts' },
    ],
  },

  {
    name: 'Favorite News',
    icon: HeartIcon,
    current: false,
    href: '/dashboard/favorite-news'
  },
  {
    name: 'Bookmarked News',
    icon: BookmarkIcon,
    current: false,
    href: '/dashboard/bookmark-news'
  },

]

const EditorNavigation = [
  {
    name: 'Dashboard', icon: HomeIcon,
    // current: true, 
    href: '/dashboard'
  },
  {
    name: 'Posts',
    icon: DocumentTextIcon,
    current: false,
    children: [
      { name: 'Add Post', href: '/dashboard/add-post' },
      { name: 'Posts List', href: '/dashboard/posts-list' },
      // { name: 'Pending Posts', href: '/pending-posts' },
    ],
  },
  {
    name: 'Breaking News',
    icon: DocumentTextIcon,
    current: false,
    href: '/dashboard/breaking-news'
  },
  {
    name: 'Favorite News',
    icon: HeartIcon,
    current: false,
    href: '/dashboard/favorite-news'
  },
  {
    name: 'Bookmarked News',
    icon: BookmarkIcon,
    current: false,
    href: '/dashboard/bookmark-news'
  },
]
