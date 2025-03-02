import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

const Sidebar = () => {
    const [activeTab, setActiveTab] = useState('customers');
    const navigate = useNavigate();

    useEffect(() => {
        navigate(activeTab);
    }, [activeTab]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(tab);
    };

    return (
        <div className="w-60 bg-blue-900 text-white">
            <div className="p-4">
                <nav className="space-y-6">
                    <div onClick={() => handleTabClick('home')} className={`flex items-center space-x-3 p-2 rounded hover:bg-blue-800 ${activeTab === 'home' ? 'bg-blue-800' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-house-door-fill" viewBox="0 0 16 16">
                            <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
                        </svg>
                        <span>Home</span>
                    </div>

                    <div onClick={() => handleTabClick('templates')} className={`flex items-center space-x-3 p-2 rounded hover:bg-blue-800 ${activeTab === 'templates' ? 'bg-blue-800' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-file-earmark-text-fill" viewBox="0 0 16 16">
                            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1z" />
                        </svg>
                        <span>Templates</span>
                    </div>

                    <div onClick={() => handleTabClick('customers')} className={`flex items-center space-x-3 p-2 rounded hover:bg-blue-800 ${activeTab === 'customers' ? 'bg-blue-800' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16">
                            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                        </svg>
                        <span>Customers</span>
                    </div>

                    <div onClick={() => handleTabClick('employees')} className={`flex items-center space-x-3 p-2 rounded hover:bg-blue-800 ${activeTab === 'employees' ? 'bg-blue-800' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16">
                            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                        </svg>
                        <span>Employees</span>
                    </div>

                    <div onClick={() => handleTabClick('settings')} className={`flex items-center space-x-3 p-2 rounded hover:bg-blue-800 ${activeTab === 'settings' ? 'bg-blue-800' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16">
                            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                        </svg>
                        <span>My Business Settings</span>
                    </div>
                </nav>
            </div>

            <div className="mt-auto p-4 absolute bottom-0">
                <div className="flex items-center space-x-3 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    <span>Notifications</span>
                    <span className="bg-blue-600 text-xs rounded-full px-2 py-1">10</span>
                </div>

                <div className="flex items-center mt-4 space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-xs">DB</span>
                    </div>
                    <div>
                        <div className="text-sm">David ben Yosef</div>
                        <div className="text-xs text-gray-300">Admin</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;
