import { selectAuth } from "../redux/slices/authSlice";
import { Role } from "../types/api/modelTypes";
import { useAppSelector } from "./useAppSelector";

export const useHasRole = (role: string): boolean => {
    const { user } = useAppSelector(selectAuth);
    return (user?.roles as Role[] | undefined)?.some((r) => r.name === role) || false;
}