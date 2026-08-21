import { ReactNode } from "react";

type Props = { children: ReactNode };

function layout({ children }: Props) {
  return <div className="min-h-screen">{children}</div>;
}

export default layout;
