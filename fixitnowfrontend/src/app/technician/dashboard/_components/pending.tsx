export default function PendingJobsComponent() {
  return (
    <ul className="list bg-base-100 rounded-box shadow-md w-1/2">
      <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
        Pending Jobs
      </li>

      <li className="list-row">
        <div>
          <div>Job Name</div>
          <div className="text-xs uppercase font-semibold opacity-60">
            Job ID
          </div>
        </div>
        <p className="list-col-wrap text-xs">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Et provident
          amet placeat voluptatum veritatis, dolore facilis eum voluptates animi
          enim praesentium, dolores, magni sunt inventore temporibus esse?
          Numquam, autem soluta.
        </p>
        <button className="btn btn-square btn-ghost btn-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-check-icon lucide-check"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </button>
        <button className="btn btn-square btn-ghost btn-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-x-icon lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </li>
    </ul>
  );
}
