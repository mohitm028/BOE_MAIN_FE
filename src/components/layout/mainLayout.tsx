/**
 * @author d33pan on 10/17/25
 */

import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    return (
        <div className="flex min-h-screen">
            {<Sidebar />}
            <div className="flex-1 flex flex-col">
                {<Header />}
                <div className="flex-1 bg-gray-50">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
