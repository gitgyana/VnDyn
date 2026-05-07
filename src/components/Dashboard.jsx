import {useNavigate} from 'react-router-dom'
import {useAuth} from '../AuthContext'

export default function Dashboard() {
    const {user, logout} = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout();
        navigate('/')
    }

    const handlePortal = () => {
        if (user.type === 'Street Vendor') navigate('/vendor')
        else if (user.type === 'Retailer to Vendor') navigate('/supplier')
        else if (user.type === 'Admin') navigate('/admin')
    }

    const roleColor = user?.type === 'Admin' ? '#ef4444' : user?.type === 'Street Vendor' ? '#4ade80' : '#60a5fa'

    return (
        <div id="app">
            <h2 className="text">Welcome, {user?.fullName}!</h2>

            <div className="panel" style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                <table style={{
                    width: '100%',
                    margin: '0 auto 1.5rem',
                    fontSize: '1rem',
                    color: '#fff',
                    borderCollapse: 'separate',
                    borderSpacing: '0 0.4rem'
                }}>
                    <tbody>
                    <tr>
                        <td style={{padding: '0.4rem', textAlign: 'left', opacity: 0.7}}><strong>Account Type:</strong>
                        </td>
                        <td style={{
                            padding: '0.4rem',
                            color: roleColor,
                            fontWeight: 700,
                            textAlign: 'right'
                        }}>{user?.type}</td>
                    </tr>
                    <tr>
                        <td style={{padding: '0.4rem', textAlign: 'left', opacity: 0.7}}><strong>Phone:</strong></td>
                        <td style={{padding: '0.4rem', textAlign: 'right'}}>{user?.phone}</td>
                    </tr>
                    <tr>
                        <td style={{padding: '0.4rem', textAlign: 'left', opacity: 0.7}}><strong>Email:</strong></td>
                        <td style={{padding: '0.4rem', textAlign: 'right'}}>{user?.email}</td>
                    </tr>
                    {user?.address && (
                        <>
                            <tr>
                                <td colSpan="2" style={{
                                    padding: '0.75rem 0.4rem 0.4rem',
                                    textAlign: 'left',
                                    opacity: 0.7,
                                    borderTop: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    <strong>Delivery Address:</strong>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2"
                                    style={{padding: '0.4rem', textAlign: 'left', fontSize: '0.9rem', opacity: 0.9}}>
                                    {user.address.street}, {user.address.city}, {user.address.state} - {user.address.pincode}
                                    {user.address.landmark && <div style={{
                                        marginTop: 2,
                                        opacity: 0.7,
                                        fontSize: '0.85rem'
                                    }}>Landmark: {user.address.landmark}</div>}
                                </td>
                            </tr>
                        </>
                    )}
                    </tbody>
                </table>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                <button className="btn" onClick={handlePortal} style={{
                    background: `rgba(${roleColor === '#4ade80' ? '76,222,128' : roleColor === '#ef4444' ? '239,68,68' : '96,165,250'},0.2)`,
                    borderColor: `${roleColor}60`
                }}>
                    {user?.type === 'Street Vendor' && 'Go to Vendor Portal'}
                    {user?.type === 'Retailer to Vendor' && 'Go to Supplier Portal'}
                    {user?.type === 'Admin' && 'Go to Admin Dashboard'}
                </button>

                {(user?.type === 'Admin' || user?.type === 'Retailer to Vendor') && (
                    <button className="btn" onClick={() => navigate('/payments')}>Payment Processing</button>
                )}

                <button className="btn" onClick={() => navigate('/complaints')}>File Complaint</button>

                {user?.type === 'Admin' && (
                    <button className="btn" onClick={() => navigate('/admin')}>Manage Complaints and Resources</button>
                )}

                <button type="button" className="switch-link" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}
