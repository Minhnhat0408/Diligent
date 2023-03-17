import { Route,Navigate,Outlet } from "react-router-dom";

function PrivateRoute({user,...rest}) {
       console.log(user)
    return ( 
                user ? <Outlet/>: 
              <Navigate to="/login" replace={true} />
       );
}

export default PrivateRoute;