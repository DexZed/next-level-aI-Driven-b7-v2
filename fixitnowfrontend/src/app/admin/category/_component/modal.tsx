"use client";

import Input from "@/components/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  activeStatus: z.boolean(),
});

type ServiceSchema = z.infer<typeof serviceSchema>;

function Modal() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceSchema>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      activeStatus: true,
    },
  });
  async function submitHandler(data: ServiceSchema) {
    // TODO: Add handler logic
    console.log("service data:", data);
  }
  return (
    <div>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Add A New Service</h3>
          <div>
            <form
              className="flex flex-col justify-start"
              onSubmit={handleSubmit(submitHandler)}
            >
              <Input
                name="Service Name"
                placeholder="Service Name"
                type="text"
                inputClass="input input-bordered input-info"
                props={register("name")}
                children={
                  errors.name && (
                    <span className="label text-red-500">
                      {errors.name.message}
                    </span>
                  )
                }
              />
              <Input
                name="Service Category"
                placeholder="Category"
                type="text"
                inputClass="input input-bordered input-info"
                props={register("category")}
                children={
                  errors.category && (
                    <span className="label text-red-500">
                      {errors.category.message}
                    </span>
                  )
                }
              />
              <Input
                name="Service Description"
                placeholder="Description"
                type="text"
                inputClass="input input-bordered input-info"
                props={register("description")}
                children={
                  errors.description && (
                    <span className="label text-red-500">
                      {errors.description.message}
                    </span>
                  )
                }
              />
              <div className="modal-action justify-start">
                <button
                  type="submit"
                  className="btn btn-outline btn-primary btn-md"
                >
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
export default Modal;
