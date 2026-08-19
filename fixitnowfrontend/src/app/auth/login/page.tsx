"use client";
import Input from "@/components/Input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

const signInSchema = z.object({
  email: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z
    .enum(["admin", "customer", "technician"])
    .default("customer")
    .optional(),
});

type SignInSchema = z.infer<typeof signInSchema>;

function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const submitHandler = async (data: SignInSchema) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success("User logged in successfully");
          router.push("/");
        },
        onError: (error) => {
          toast.error("Error logging in user");
          console.error(
            "Error in login ",
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
            Sign In
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-300 ">
            Please fill out the form to sign in to your account
          </p>

          <form onSubmit={handleSubmit(submitHandler)}>
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

            <button type="submit" className="btn btn-neutral mt-4">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
