import {
    BrowserRouter as Router,
    Route,
    ScrollRestoration,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes';
import DefaultLayout from './layouts/DefaultLayout';
import { Fragment } from 'react';
import PrivateRoute from './routes/PrivateRoute';
import { UserAuth } from './contexts/authContext';
import useUnload from './hooks/useUnload';
import RootLayout from './layouts/RootLayout/RootLayout';
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootLayout/>}>
            {publicRoutes.map((route, index) => {
                const Page = route.component;
                let Layout = DefaultLayout;
                if (route.layout) {
                    Layout = route.layout;
                } else if (route.layout === null) {
                    Layout = Fragment;
                }
                return (
                    <Route
                        key={index}
                        index={route.path === '/'}
                        path={route.path}
                        element={
                            <>
                                <Layout>
                                    <Page />
                                </Layout>
                                <ScrollRestoration
                                    getKey={(location, matches) => {
                                        return location.key;
                                    }}
                                />
                            </>
                        }
                    />
                );
            })}
            <Route element={<PrivateRoute />}>
                {privateRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = DefaultLayout;
                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}
            </Route>

        </Route>,
    ),
);
function App() {
    const { logOut } = UserAuth();
    useUnload(async (e) => {
        e.preventDefault();

        await logOut();
    });

    return  <RouterProvider router={router} />
     
}

export default App;
