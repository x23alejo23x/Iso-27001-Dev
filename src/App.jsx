import { useEffect } from "react";
import AppRoutes from "./Router";
import { useDispatch } from "react-redux";
import { setInfoUser } from "./Redux/slices/userInfoSlice";
import useGetCookies from "./Hooks/useGetCookies";


function App() {
  const dispatch = useDispatch();
  const cookiesData = useGetCookies(["authentication", "user", "personal"]);

  useEffect(() => {
    if (
      cookiesData.personal &&
      cookiesData.user &&
      cookiesData.authentication
    ) {
      dispatch(
        setInfoUser({
          authDTO: cookiesData.authentication,
          userDTO: cookiesData.user,
          personalDTO: cookiesData.personal,
        })
      );
    }
  }, [cookiesData, dispatch]);

  return <AppRoutes />;
}

export default App;
