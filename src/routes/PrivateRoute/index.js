import { Navigate,Outlet } from "react-router-dom";
import { UserAuth } from "~/contexts/authContext";

function PrivateRoute() {
       const {user} = UserAuth();
       console.log(user,'fefse')
    return ( 
                user ? <Outlet/>: 
              <Navigate to="/login" replace={true} />
       );
}

export default PrivateRoute;