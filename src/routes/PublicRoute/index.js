import { Navigate,Outlet } from "react-router-dom";
import { UserAuth } from "~/contexts/authContext";

function PublicRoute() {
       const {userData} = UserAuth();
       
    return ( 
                userData?.user_name ? <Outlet/>: 
              <Navigate to="/login" replace={true} />
       );
}

export default PublicRoute;