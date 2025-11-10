import { UserContext } from "@/contexts/UserContext";
import { FunctionComponent, useContext } from "react";
import { Navigate } from "react-router-dom";

interface PracticeProps {}

const Practice: FunctionComponent<PracticeProps> = () => {
  const userCnt = useContext(UserContext);

  return (
    <>
      <p>Username: {userCnt?.user?.username}</p>
      <p>Email: {userCnt?.user?.email}</p>
      <p>Role: {userCnt?.user?.role}</p>

      <button onClick={() => Navigate}>TEST</button>
    </>
  );
};

export default Practice;
