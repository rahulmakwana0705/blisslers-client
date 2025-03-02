import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import axios from 'axios';
import { toast } from 'react-toastify';
import { z } from 'zod';

const customerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    mobile: z.string()
        .min(1, "Mobile number is required")
        .regex(/^\d+$/, "Mobile number must contain only digits"),
    email: z.string()
        .min(1, "Email is required")
        .email("Invalid email format"),
    proposalsAwaiting: z.number().nonnegative("Must be a positive number"),
    approveProposal: z.number().nonnegative("Must be a positive number"),
    expiredProposal: z.number().nonnegative("Must be a positive number"),
    unapprovedProposal: z.number().nonnegative("Must be a positive number")
});

const NewCustomer = () => {
    const { action, customerId } = useParams();
    const isEdit = action === 'edit';
    const isView = action === 'view';
    
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [customer, setCustomer] = useState({
        name: '',
        mobile: '',
        email: '',
        proposalsAwaiting: 0,
        approveProposal: 0,
        expiredProposal: 0,
        unapprovedProposal: 0
    });
    
    useEffect(() => {
        if ((isEdit || isView) && customerId) {
            fetchCustomerData();
        }
    }, [isEdit, isView, customerId]);
    
    const fetchCustomerData = async () => {
        setFetchLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/customers/${customerId}`);
            if (response.data && response.data.customer) {
                setCustomer(response.data.customer);
            } else {
                setError('Customer not found');
            }
        } catch (err) {
            console.error('Error fetching customer:', err);
            setError('Failed to load customer data. Please try again.');
        } finally {
            setFetchLoading(false);
        }
    };
    
    const handleChange = (e) => {
        if (isView) return;
        
        const { name, value } = e.target;
        
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
        
        if (['proposalsAwaiting', 'approveProposal', 'expiredProposal', 'unapprovedProposal'].includes(name)) {
            setCustomer(prev => ({
                ...prev,
                [name]: value === '' ? 0 : Number(value)
            }));
        } else {
            setCustomer(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    
    const validateForm = () => {
        try {
            customerSchema.parse(customer);
            setValidationErrors({});
            return true;
        } catch (error) {
            const formattedErrors = {};
            error.errors.forEach(err => {
                formattedErrors[err.path[0]] = err.message;
            });
            setValidationErrors(formattedErrors);
            return false;
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isView) return; 
        
        if (!validateForm()) {
            toast.error("Please fix the validation errors");
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const customerData = {
                ...customer,
                proposalsAwaiting: parseInt(customer.proposalsAwaiting),
                approveProposal: parseInt(customer.approveProposal),
                expiredProposal: parseInt(customer.expiredProposal),
                unapprovedProposal: parseInt(customer.unapprovedProposal)
            };
            
            let response;
            if (isEdit) {
                response = await axios.put(`${process.env.REACT_APP_BASE_URL}/customers/${customerId}`, customerData);
            } else {
                response = await axios.post(`${process.env.REACT_APP_BASE_URL}/customers`, customerData);
            }
            toast.success(response.data.message)
            console.log('response', response);
            navigate('/customers');
        } catch (err) {
            setError(err.message || 'An error occurred');
            toast.error(err.message)
        } finally {
            setLoading(false);
        }
    };
    
    const handleCancel = () => {
        navigate('/customers');
    };
    
    const getTitle = () => {
        if (isEdit) return 'Edit Customer';
        if (isView) return 'View Customer';
        return 'Add New Customer';
    };
    
    const getButtonText = () => {
        if (isEdit) return loading ? 'Saving...' : 'Save Changes';
        return loading ? 'Adding...' : 'Add Customer';
    };
    
    if (fetchLoading) {
        return (
            <div className="p-6 flex justify-center items-center">
                <div className="text-center">
                    <svg className="animate-spin h-10 w-10 mx-auto mb-4 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-600">Loading customer data...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{getTitle()}</h1>
                <button 
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    {isView ? 'Back' : 'Cancel'}
                </button>
            </div>
            
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Customer Information</h2>
                            
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={customer.name}
                                    onChange={handleChange}
                                    disabled={isView}
                                    className={`mt-1 block w-full border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${isView ? 'bg-gray-100' : ''}`}
                                />
                                {validationErrors.name && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                                    Mobile
                                </label>
                                <input
                                    type="text"
                                    id="mobile"
                                    name="mobile"
                                    value={customer.mobile}
                                    onChange={handleChange}
                                    disabled={isView}
                                    className={`mt-1 block w-full border ${validationErrors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${isView ? 'bg-gray-100' : ''}`}
                                />
                                {validationErrors.mobile && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.mobile}</p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={customer.email}
                                    onChange={handleChange}
                                    disabled={isView || isEdit}
                                    className={`mt-1 block w-full border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${isView ? 'bg-gray-100' : ''}`}
                                />
                                {validationErrors.email && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Proposal Information</h2>
                            
                            <div>
                                <label htmlFor="proposalsAwaiting" className="block text-sm font-medium text-gray-700">
                                    Proposals Awaiting
                                </label>
                                <input
                                    type="number"
                                    id="proposalsAwaiting"
                                    name="proposalsAwaiting"
                                    value={customer.proposalsAwaiting}
                                    onChange={handleChange}
                                    min="0"
                                    disabled={isView}
                                    className={`mt-1 block w-full border ${validationErrors.proposalsAwaiting ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${isView ? 'bg-gray-100' : ''}`}
                                />
                                {validationErrors.proposalsAwaiting && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.proposalsAwaiting}</p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="approveProposal" className="block text-sm font-medium text-gray-700">
                                    Approved Proposals
                                </label>
                                <input
                                    type="number"
                                    id="approveProposal"
                                    name="approveProposal"
                                    value={customer.approveProposal}
                                    onChange={handleChange}
                                    min="0"
                                    disabled={isView}
                                    className={`mt-1 block w-full border ${validationErrors.approveProposal ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${isView ? 'bg-gray-100' : ''}`}
                                />
                                {validationErrors.approveProposal && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.approveProposal}</p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="expiredProposal" className="block text-sm font-medium text-gray-700">
                                    Expired Proposals
                                </label>
                                <input
                                    type="number"
                                    id="expiredProposal"
                                    name="expiredProposal"
                                    value={customer.expiredProposal}
                                    onChange={handleChange}
                                    min="0"
                                    disabled={isView}
                                    className={`mt-1 block w-full border ${validationErrors.expiredProposal ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${isView ? 'bg-gray-100' : ''}`}
                                />
                                {validationErrors.expiredProposal && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.expiredProposal}</p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="unapprovedProposal" className="block text-sm font-medium text-gray-700">
                                    Unapproved Proposals
                                </label>
                                <input
                                    type="number"
                                    id="unapprovedProposal"
                                    name="unapprovedProposal"
                                    value={customer.unapprovedProposal}
                                    onChange={handleChange}
                                    min="0"
                                    disabled={isView}
                                    className={`mt-1 block w-full border ${validationErrors.unapprovedProposal ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${isView ? 'bg-gray-100' : ''}`}
                                />
                                {validationErrors.unapprovedProposal && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.unapprovedProposal}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            {isView ? 'Back' : 'Cancel'}
                        </button>
                        
                        {!isView && (
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {getButtonText()}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewCustomer;
