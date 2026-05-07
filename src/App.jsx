import {Routes, Route, Navigate} from 'react-router-dom'
import {AuthProvider, useAuth} from './AuthContext'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import VendorPortal from './components/VendorPortal'
import SupplierPortal from './components/SupplierPortal'
import Admin from './components/Admin'
import PaymentProcessing from './components/PaymentProcessing'
import ComplaintForm from './components/ComplaintForm'

function ProtectedRoute({children, allowedTypes}) {
    const {user} = useAuth()
    if (!user) return <Navigate to="/login" replace/>
    if (allowedTypes && !allowedTypes.includes(user.type)) return <Navigate to="/dashboard" replace/>
    return children
}

function AppRoutes() {
    const {user} = useAuth()
    return (
        <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" replace/> : <Home/>}/>
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace/> : <Login/>}/>
            <Route path="/signup" element={user ? <Navigate to="/dashboard" replace/> : <Signup/>}/>
            <Route path="/signup/:type" element={user ? <Navigate to="/dashboard" replace/> : <Signup/>}/>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
            <Route path="/vendor"
                   element={<ProtectedRoute allowedTypes={["Street Vendor"]}><VendorPortal/></ProtectedRoute>}/>
            <Route path="/supplier"
                   element={<ProtectedRoute allowedTypes={["Retailer to Vendor"]}><SupplierPortal/></ProtectedRoute>}/>
            <Route path="/admin" element={<ProtectedRoute allowedTypes={["Admin"]}><Admin/></ProtectedRoute>}/>
            <Route path="/payments" element={<ProtectedRoute><PaymentProcessing/></ProtectedRoute>}/>
            <Route path="/complaints" element={<ProtectedRoute><ComplaintForm/></ProtectedRoute>}/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <AppRoutes/>
        </AuthProvider>
    )
}
