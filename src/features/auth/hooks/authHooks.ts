import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { logout, selectAuth, setAuthUserState } from '../../../redux/slices/authSlice';
import { useUpdateUserInfoMutation } from '../../../services/userApi';
import { UpdateUserPayload } from '../../../types/api/apiRequests';

const useUserEvents = () => {
  const authState = useAppSelector(selectAuth);
  const [updateUserInfo, { isLoading }] = useUpdateUserInfoMutation();
  const { user } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  
  const logoutUser = () => {
    dispatch(logout());
  };

  const handleUpdateUserInfo = async (userObjNewFields: UpdateUserPayload) => {
      if (user) {
        try {
          const userUpdateResponse = await updateUserInfo({
            userObj: {
              ...user,
              ...userObjNewFields,
            },
          }).unwrap();
          if (userUpdateResponse.success) {
            dispatch(
              setAuthUserState({
                ...userUpdateResponse.data
              }),
            );
            console.error(
              'User info updated successfully:',
              userUpdateResponse.data,
              user
            );
          };
  
        } catch (error) {
          console.error('Error updating user info:', error);
        }
      }
    };

  const roleNames = authState?.user?.roles?.map((role) => role.name.toLowerCase()) || [];

  return { roleNames, logoutUser, handleUpdateUserInfo };
};

export { useUserEvents };