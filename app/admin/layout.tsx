import BasicAuthGuard from "@/components/basic-auth-guard";
import { PropsWithChildren } from "react";

const AdminLayout = ({ children }: PropsWithChildren) => {
  return <BasicAuthGuard>{children}</BasicAuthGuard>;
};

export default AdminLayout;
