import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes';
import DefaultLayout from './layouts/DefaultLayout';
import { Fragment } from 'react';
import PrivateRoute from './routes/PrivateRoute';
import { UserAuth } from './contexts/authContext';
import useUnload from './hooks/useUnload';
import ScrollToTop from './component/ScrollToTop';

function App() {
    const {logOut} = UserAuth();

    useUnload(async (e) =>  {
        e.preventDefault();
        await logOut();
        console.log('Closing the tab or window!');
      });

    return (
            <Router>
                <div className="app">
                    <ScrollToTop/>
                    <Routes>
                        
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
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
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
                    </Routes>
                </div>
            </Router>
    );
}

export default App;
