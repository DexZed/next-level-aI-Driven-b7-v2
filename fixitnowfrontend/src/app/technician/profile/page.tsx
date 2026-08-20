"use client";
import Input from "@/components/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const profileSchema = z.object({
  firstName: z.string().min(3, "First Name must be at least 3 characters long"),
  lastName: z.string().min(3, "Last Name must be at least 3 characters long"),
  bio: z.string().min(3, "Bio must be at least 3 characters long"),
  city: z.string().min(1, "City is required"),
  isAvailable: z.boolean().default(true).optional(),
});

type ProfileSchema = z.infer<typeof profileSchema>;

function ProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      bio: "",
      city: "",
      isAvailable: true,
    },
  });
  async function submitHandler(data: ProfileSchema) {}
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <div>
            <h1 className="text-5xl font-bold">Update Your Profile</h1>
          </div>

          <div className="m-5">
            <form onSubmit={handleSubmit(submitHandler)} className="w-125">
              <Input
                name="firstName"
                type="text"
                placeholder="First Name"
                props={register("firstName")}
                inputClass="input input-bordered input-info"
                children={
                  errors.firstName && (
                    <span className="label text-red-500">
                      {errors.firstName.message}
                    </span>
                  )
                }
              />
              <Input
                name="lastName"
                type="text"
                placeholder="Last Name"
                props={register("lastName")}
                inputClass="input input-bordered input-info"
                children={
                  errors.lastName && (
                    <span className="label text-red-500">
                      {errors.lastName.message}
                    </span>
                  )
                }
              />
              <Input
                name="bio"
                type="text"
                placeholder="Bio"
                props={register("bio")}
                inputClass="input input-bordered input-info"
                children={
                  errors.bio && (
                    <span className="label text-red-500">
                      {errors.bio.message}
                    </span>
                  )
                }
              />
              <Input
                name="city"
                type="text"
                placeholder="City"
                props={register("city")}
                inputClass="input input-bordered input-info"
                children={
                  errors.city && (
                    <span className="label text-red-500">
                      {errors.city.message}
                    </span>
                  )
                }
              />
              <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
                <legend className="fieldset-legend">Set Avalability</legend>
                <label className="label">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="checkbox"
                    {...register("isAvailable")}
                  />
                  Avaliable
                </label>
              </fieldset>
              <button type="submit" className="btn btn-neutral mt-4">
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
