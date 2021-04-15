/* This example requires Tailwind CSS v2.0+ */
import { Disclosure } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navigation({ navigation }) {
  return (
    <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 pb-4 bg-white overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <img
          className="h-8 w-auto"
          src="/logo.svg"
          alt="CueBlox"
        />
      </div>
      <div className="mt-5 flex-grow flex flex-col">
        <nav className="flex-1 px-2 space-y-1 bg-white" aria-label="Sidebar">
          {navigation.map((item) =>
            !item.children ? (
              <div key={item.name}>
                <a
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group w-full flex items-center pl-7 pr-2 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  {item.name}
                </a>
              </div>
            ) : (
              <Disclosure as="div" key={item.name} className="space-y-1">
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      className={classNames(
                        item.current
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        'group w-full flex items-center pr-2 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                      )}
                    >
                      <svg
                        className={classNames(
                          open ? 'text-gray-400 rotate-90' : 'text-gray-300',
                          'mr-2 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150'
                        )}
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                      </svg>
                      {item.name}
                    </Disclosure.Button>
                    <Disclosure.Panel className="space-y-1">
                      {item.children.map((subItem) =>

                      (
                        <Disclosure as="div" key={subItem.name} className="space-y-1">
                          {({ open }) => (
                            <>
                              <Disclosure.Button
                                className={classNames(
                                  subItem.current
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                  'group w-full flex items-center pr-2 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                )}
                              >
                                <svg
                                  className={classNames(
                                    open ? 'text-gray-400 rotate-90' : 'text-gray-300',
                                    'mr-2 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150'
                                  )}
                                  viewBox="0 0 20 20"
                                  aria-hidden="true"
                                >
                                  <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                                </svg>
                                {subItem.name}
                              </Disclosure.Button>
                              <Disclosure.Panel className="space-y-1">
                                {!subItem.Pages ? (
                                  <div key={subItem.name}>
                                    <a
                                      href={subItem.href}
                                      className={classNames(
                                        subItem.current
                                          ? 'bg-gray-100 text-gray-900'
                                          : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                        'group w-full flex items-center pl-7 pr-2 py-2 text-sm font-medium rounded-md'
                                      )}
                                    >
                                      {subItem.name}
                                    </a>
                                  </div>
                                ) : (

                                  subItem.Pages.map((item2) =>
                                  (
                                    <a
                                      key={item2.id}
                                      href={item2.id}
                                      className="group w-full flex items-center pl-10 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                                    >
                                      { item2.title}
                                    </a>
                                  ))

                                )}
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      ))}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            )
          )}
        </nav>
      </div>
    </div >
  )
}
