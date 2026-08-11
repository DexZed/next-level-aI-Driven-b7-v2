"use client"
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
    role: z.enum(["admin", "customer", "technician"]).default("customer").optional(),
})

type SignUpSchema = z.infer<typeof signUpSchema>;

function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpSchema>({
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

        await authClient.signUp.email({
            name: name,
            email: data.email,
            password: data.password,
            role: data.role! as "admin" | "customer" | "technician"
        }, {
            onSuccess: () => {
                toast.success("User created successfully");
                router.push("/");
            },
            onError: (error) => {
                toast.error("Error creating user");
                console.error("Error in Signup ", error?.error?.message || "Something went wrong");
            }
        });
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
                        <fieldset className="fieldset">
                            <label className="label" htmlFor="firstName">First Name</label>
                            <input type="text" id="firstName" {...register("firstName")} className="input input-bordered input-info" placeholder="First Name" />
                            {errors.firstName && <span className="label text-red-500">{errors.firstName.message}</span>}
                        </fieldset>

                        <fieldset className="fieldset">
                            <label className="label" htmlFor="lastName">Last Name</label>
                            <input type="text" id="lastName" {...register("lastName")} className="input input-bordered input-info" placeholder="Last Name" />
                            {errors.lastName && <span className="label text-red-500">{errors.lastName.message}</span>}
                        </fieldset>

                        <fieldset className="fieldset">
                            <label className="label" htmlFor="email">Email</label>
                            <input type="email" id="email" {...register("email")} className="input input-bordered input-info" placeholder="Email" />
                            {errors.email && <span className="label text-red-500">{errors.email.message}</span>}
                        </fieldset>

                        <fieldset className="fieldset">
                            <label className="label" htmlFor="password">Password</label>
                            <input type="password" id="password" {...register("password")} className="input input-bordered input-info" placeholder="Password" />
                            {errors.password && <span className="label text-red-500">{errors.password.message}</span>}
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Role</legend>
                            <select id="role" {...register("role")} className="select select-info">
                                <option value="customer">Customer</option>
                                <option value="technician">Technician</option>
                                <option value="admin">Admin</option>
                            </select>
                            {errors.role && <span className="label text-red-500">{errors.role.message}</span>}
                        </fieldset>

                        <button type="submit" className="btn btn-neutral mt-4">Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;