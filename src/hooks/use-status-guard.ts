// import axios from "axios";
import axiosInstance from "@/utils/axios-instance.ts";
import { isInvalidAuthData } from "@/utils/is-invalid-auth-data.ts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useStatusGuard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isServerOk, setIsServerOk] = useState<boolean>(false);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        // Retrieve token from local storage
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("userData");

        const _isInValidAuthData = isInvalidAuthData(token, userData);

        if (_isInValidAuthData) {
          localStorage.removeItem("token");
          localStorage.removeItem("userData");

          setLoading(false);

          navigate("/login");

          // force a refresh of the page
          window.location.reload();

          return; // Exit early
        }

        const response = await axiosInstance.get(`/`);

        setIsServerOk(response.status === 200);
      } catch (error) {
        console.error(error);
        setIsServerOk(false);
      } finally {
        setLoading(false);
      }
    };

    checkServerStatus().then((r) => console.log(r));
  }, [navigate]);

  return { loading, isServerOk };
};
