"use client";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z
    .enum(["admin", "customer", "technician"])
    .default("customer")
    .optional(),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "customer",
    },
  });

  const router = useRouter();

  const submitHandler = async (data: SignUpSchema) => {
    const name = data.firstName.concat(" ").concat(data.lastName);

    await authClient.signUp.email(
      {
        name: name,
        email: data.email,
        password: data.password,
        role: data.role! as "admin" | "customer" | "technician",
      },
      {
        onSuccess: (ctx) => {
          toast.success("User created successfully");
          const role = ctx.data?.user?.role;
          if (role === "admin") {
            router.push("/admin/dashboard");
          } else if (role === "customer") {
            router.push("/customer/dashboard");
          } else if (role === "technician") {
            router.push("/technician/dashboard");
          }
        },
        onError: (error) => {
          toast.error("Error creating user");
          console.error(
            "Error in Signup ",
            error?.error?.message || "Something went wrong",
          );
        },
      },
    );
  };

  return (
    <div>
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <div className="card-body">
          <h2 className="text-xl font-bold text-neutral-200 card-title">
            Sign Up
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-300 ">
            Please fill out the form to create an account
          </p>

          <form onSubmit={handleSubmit(submitHandler)}>
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
              name="email"
              type="email"
              placeholder="Email"
              props={register("email")}
              inputClass="input input-bordered input-info"
              children={
                errors.email && (
                  <span className="label text-red-500">
                    {errors.email.message}
                  </span>
                )
              }
            />

            <Input
              name="password"
              type="password"
              placeholder="Password"
              props={register("password")}
              inputClass="input input-bordered input-info"
              children={
                errors.password && (
                  <span className="label text-red-500">
                    {errors.password.message}
                  </span>
                )
              }
            />

            <Select
              name="role"
              props={register("role")}
              selectClass="select select-info"
              options={[
                { value: "customer", label: "Customer" },
                { value: "technician", label: "Technician" },
                { value: "admin", label: "Admin" },
              ]}
              children={
                errors.role && (
                  <span className="label text-red-500">
                    {errors.role.message}
                  </span>
                )
              }
            />
            <button type="submit" className="btn btn-neutral mt-4">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
