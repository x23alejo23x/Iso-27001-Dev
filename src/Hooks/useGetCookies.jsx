import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useGetCookies(cookieNames = []) {
  const [cookiesData, setCookiesData] = useState({});
  const navigate = useNavigate();

  const getCookie = (name) => {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split("=");
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  };

  const decodeData = (base64String) => {
    try {
      const decodedString = atob(base64String);
      return JSON.parse(decodedString);
    } catch (error) {
      console.error("Error al decodificar:", error);
      return null;
    }
  };

  useEffect(() => {
    const data = {};
    let invalid = false;

    cookieNames.forEach((name) => {
      const raw = getCookie(name);
      const decoded = decodeData(raw);

      if (!decoded) {
        invalid = true;
      }

      data[name] = decoded;
    });

    if (invalid) {
      navigate("/tokenExpired");
    } else {
      setCookiesData(data);
    }
  }, []);

  return cookiesData;
}
