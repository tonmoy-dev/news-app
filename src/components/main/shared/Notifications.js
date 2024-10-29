import { XMarkIcon } from '@heroicons/react/20/solid'

export default function Notifications({ onClose, title, description, icon }) {

  return (
    <div className="flex-1 w-0 p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <div className="ml-4 flex flex-shrink-0">
          <button
            type="button"
            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1091ff] focus:ring-offset-2"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}


// toast.custom((t) => (
//   <div
//     className={`${t.visible ? 'animate-enter' : 'animate-leave'
//       } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
//   >
//     <Notifications
//       icon={<InformationCircleIcon className="h-6 w-6 text-blue-500" aria-hidden="true" />}
//       onClose={() => toast.dismiss(t.id)} title="Login Required!" description="Please login to bookmark this post" />
//   </div>
// ))