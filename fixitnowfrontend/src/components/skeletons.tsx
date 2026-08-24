export function SkeletonCards(number: number) {
  return (
    <div className="flex justify-center items-center gap-4 w-full m-2">
      {[...new Array(number)].map((_, i) => {
        return (
          <div key={i} className="flex w-52 flex-col gap-4">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        );
      })}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="flex justify-center items-center gap-4 w-full m-2">
      <div className="flex w-96 flex-col gap-4 justify-center items-center">
        <div className="skeleton h-10 w-250"></div>
        <div className="skeleton h-4 w-200"></div>
        <div className="skeleton h-4 w-150"></div>
        <div className="skeleton h-4 w-100"></div>
      </div>
    </div>
  );
}
export function SkeletonAccordian() {
  return (
    <>
      <details
        className="skeleton collapse bg-base-100 border border-base-300 w-full"
        name="my-accordion-det-1"
        open
      >
        <summary className="skeleton collapse-title font-semibold w-96"></summary>
        <div className="skeleton collapse-content text-sm w-70"></div>
      </details>
      <details
        className="skeleton collapse bg-base-100 border border-base-300 w-full"
        name="my-accordion-det-1"
      >
        <summary className="skeleton collapse-title font-semibold w-96"></summary>
        <div className="skeleton collapse-content text-sm w-70"></div>
      </details>
      <details
        className="skeleton collapse bg-base-100 border border-base-300 w-full"
        name="my-accordion-det-1"
      >
        <summary className="skeleton collapse-title font-semibold w-96"></summary>
        <div className="skeleton collapse-content text-sm w-70"></div>
      </details>
    </>
  );
}
