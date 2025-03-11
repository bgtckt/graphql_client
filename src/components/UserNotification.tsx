import { useSubscription } from "@apollo/client";
import { USER_CREATED } from "../subscription/user";

const UserNotification = () => {
  const { data, loading } = useSubscription(USER_CREATED);

  return (
    <div>
      {!loading && data && (
        <p>New user created: {data?.userCreated?.name}</p>
      )}
    </div>
  );
}

export default UserNotification;