import { Route,Navigate,Outlet } from "react-router-dom";
import { UserAuth } from "~/contexts/authContext";

function PrivateRoute() {
       const {user} = UserAuth();
    return ( 
                user ? <Outlet/>: 
              <Navigate to="/login" replace={true} />
       );
}

export default PrivateRoute;