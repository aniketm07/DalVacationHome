import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export const useRequireAuth = (stateKeys, role) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const isStateValid = stateKeys.every(key => location.state?.[key]);
    
    if (!isStateValid) {
      if(role === "AGENT") {
        navigate("/agent/login", { state: { role } });
      }else{
        navigate("/login", { state: { role } });
      }
    }
  }, [navigate, location, stateKeys, role]);
};
