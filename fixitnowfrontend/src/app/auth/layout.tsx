

type Props = { children: React.ReactNode }

function layout({ children }: Props) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            {children}
        </div>
    )
}

export default layout