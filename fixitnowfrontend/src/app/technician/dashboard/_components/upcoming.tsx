type Props = {};

function UpcomingJobsComponent({}: Props) {
  return (
    <>
      <ul className="list bg-base-100 rounded-box shadow-md w-1/2">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          Upcoming Jobs
        </li>

        <li className="list-row">
          <div>
            <div>Job Name</div>
            <div className="text-xs uppercase font-semibold opacity-60">
              Job ID
            </div>
          </div>
          <p className="list-col-wrap text-xs">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id vitae
            iste hic nihil, aspernatur officiis cumque ut corrupti eligendi?
            Omnis, ad dignissimos. Ducimus earum voluptatem, ab incidunt enim
            tenetur iure!
          </p>
        </li>
      </ul>
    </>
  );
}

export default UpcomingJobsComponent;
