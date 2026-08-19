function Modal() {
  return (
    <div>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add A New Service</h3>
          <div>
            <form>
              <input
                type="text"
                placeholder="Service Name"
                className="input input-bordered w-full max-w-xs"
              />
              <input
                type="text"
                placeholder="Category"
                className="input input-bordered w-full max-w-xs"
              />
              <input
                type="text"
                placeholder="Description"
                className="input input-bordered w-full max-w-xs"
              />
              <input
                type="text"
                placeholder="Active Status"
                className="input input-bordered w-full max-w-xs"
              />
              <button type="submit">Add Service</button>
            </form>
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
export default Modal;
