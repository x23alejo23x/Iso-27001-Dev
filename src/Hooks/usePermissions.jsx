import { useSelector } from "react-redux";
import { getPermissions } from "../utils/permissions";

export function usePermissions() {
  const roleId = useSelector((state) => state.login.user?.rol_id);

  return getPermissions(roleId);
}
