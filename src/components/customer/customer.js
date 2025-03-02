import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Customer = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState('bottom');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const tableRef = useRef(null);
    const dropdownRefs = useRef({});
    const sortDropdownRef = useRef(null);

    useEffect(() => {
        fetchUser();

        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setActiveDropdown(null);
            }

            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setShowSortDropdown(false);
            }

        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        let result = [...customers];

        if (searchTerm.trim() !== '') {
            const lowercasedSearch = searchTerm.toLowerCase();
            result = result.filter(customer =>
                (customer.name?.toLowerCase() || '').includes(lowercasedSearch) ||
                (customer.email?.toLowerCase() || '').includes(lowercasedSearch) ||
                (String(customer.mobile || '')).toLowerCase().includes(lowercasedSearch)
            );
        }

        if (sortConfig.key) {
            result.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        setFilteredCustomers(result);
    }, [searchTerm, customers, sortConfig]);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/customers`);
            console.log('response', response);
            setCustomers(response?.data?.customers || []);
            setFilteredCustomers(response?.data?.customers || []);
        } catch (error) {
            console.log("error", error);
            setError('Failed to fetch customers. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    const toggleDropdown = (index, e) => {
        e.stopPropagation();

        if (dropdownRefs.current[index]) {
            const buttonRect = dropdownRefs.current[index].getBoundingClientRect();
            const tableBottom = tableRef.current.getBoundingClientRect().bottom;
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - buttonRect.bottom;

            if (spaceBelow < 200 || buttonRect.top > (tableBottom - 150)) {
                setDropdownPosition('top');
            } else {
                setDropdownPosition('bottom');
            }
        }

        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const handleAction = (action, customerId) => {
        navigate(`/customers/${action}/${customerId}`);
        setActiveDropdown(null);
    };

    const handleDelete = async (customerId) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_BASE_URL}/customers/${customerId}`);
                fetchUser();
                setActiveDropdown(null);
            } catch (error) {
                console.error('Error deleting customer:', error);
                alert('Failed to delete customer. Please try again.');
            }
        }
    };

    const toggleSortDropdown = (e) => {
        e.stopPropagation();
        setShowSortDropdown(!showSortDropdown);
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setShowSortDropdown(false);
    };

    return (
        <div className="flex-1 overflow-auto">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-10 py-2 border rounded-full w-80"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <svg
                            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative" ref={sortDropdownRef}>
                            <button
                                onClick={toggleSortDropdown}
                                className="flex items-center space-x-2 px-3 py-2 border rounded-md hover:bg-gray-50"
                            >
                                <span className="text-gray-600">Sort By</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>

                            {showSortDropdown && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border">
                                    <div className="py-1">
                                        <button
                                            onClick={() => handleSort('name')}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {sortConfig.key === 'name' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            <span className={sortConfig.key === 'name' ? 'ml-2 text-blue-600' : 'ml-7'}>Name</span>
                                        </button>
                                        <button
                                            onClick={() => handleSort('email')}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {sortConfig.key === 'email' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            <span className={sortConfig.key === 'email' ? 'ml-2 text-blue-600' : 'ml-7'}>Email</span>
                                        </button>
                                        <button
                                            onClick={() => handleSort('mobile')}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {sortConfig.key === 'mobile' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            <span className={sortConfig.key === 'mobile' ? 'ml-2 text-blue-600' : 'ml-7'}>Phone</span>
                                        </button>
                                       
                                    </div>
                                </div>
                            )}
                        </div>


                        <button onClick={() => navigate('/customers/new')} className="bg-blue-900 text-white px-4 py-2 rounded">
                            Add Customer
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div ref={tableRef} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="grid grid-cols-6 bg-blue-900 text-white p-4">
                        <div>Customer ID</div>
                        <div>Customer Name</div>
                        <div>Approved Proposals</div>
                        <div>Expired Proposals</div>
                        <div>Unapproved Proposals</div>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">
                            <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p>Loading customers...</p>
                        </div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            {searchTerm ? (
                                <>
                                    <p className="text-lg mb-2">No customers found with current filters</p>
                                    <div className="flex justify-center space-x-4 mt-2">
                                        {searchTerm && (
                                            <button
                                                onClick={clearSearch}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Clear search
                                            </button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <p className="text-lg">No customers available. Add your first customer!</p>
                            )}
                        </div>
                    ) : (
                        filteredCustomers.map((customer, index) => (
                            <div key={index} className="grid grid-cols-6 p-4 border-b">
                                <div>{index + 1}</div>
                                <div>
                                    <div className="font-medium">{customer?.name}</div>
                                    <div className="text-sm text-gray-500">{customer?.mobile}</div>
                                    <div className="text-sm text-gray-500">{customer?.email}</div>
                                </div>
                                <div>
                                    <div className="flex items-center">
                                        <span className="w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs mr-2">
                                            2
                                        </span>
                                        <span>${customer?.proposalsAwaiting}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center">
                                        <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs mr-2">
                                            2
                                        </span>
                                        <span>${customer?.approveProposal}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center">
                                        <span className="w-6 h-6 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs mr-2">
                                            2
                                        </span>
                                        <span>${customer?.expiredProposal}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs mr-2">
                                                2
                                            </span>
                                            <span>${customer?.unapprovedProposal}</span>
                                        </div>
                                        <div className="dropdown-container relative" ref={el => dropdownRefs.current[index] = el}>
                                            <button
                                                className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
                                                onClick={(e) => toggleDropdown(index, e)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>

                                            {activeDropdown === index && (
                                                <div
                                                    className={`absolute ${dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 w-48 bg-white rounded-md shadow-lg z-50 border`}
                                                >
                                                    <div className="py-1">
                                                        <button
                                                            onClick={() => handleAction("view", customer._id)}
                                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                            </svg>
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction("edit", customer._id)}
                                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                            </svg>
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(customer._id)}
                                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {filteredCustomers.length > 0 && (searchTerm) && (
                    <div className="mt-4 text-sm text-gray-600 flex items-center">
                        <span>Showing {filteredCustomers.length} of {customers.length} customers</span>
                        {(searchTerm) && (
                            <div className="ml-4 flex space-x-2">
                                {searchTerm && (
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                                        Search: "{searchTerm}"
                                        <button onClick={clearSearch} className="ml-1 text-blue-600 hover:text-blue-800">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                )}

                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Customer;