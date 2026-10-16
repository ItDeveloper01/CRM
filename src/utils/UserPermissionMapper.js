
import { useCallback, useMemo } from "react";
import { useGetSessionUser } from "../SessionContext";

export const usePermission = () => {
    const { user: sessionUser } = useGetSessionUser();


console.log("Session User Permissions:", {
    sessionUser: sessionUser,
    permissions: sessionUser?.permissions,
    permissionMap: sessionUser?.permissionMap,
});

    const permissionMap = useMemo(
        () =>
            sessionUser?.permissions ??
            sessionUser?.permissionMap ??
            {},
        [sessionUser?.permissions, sessionUser?.permissionMap]
    );

    const hasPermission = useCallback(
        (permissionKey) => {
            return permissionMap[permissionKey] === true;
        },
        [permissionMap]
    );

    return { hasPermission };
};
