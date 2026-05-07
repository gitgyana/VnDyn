import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../AuthContext'
import {complaintAPI, resourceAPI, generateObjectId} from '../api'

export default function Admin() {
    const {user, logout} = useAuth()
    const navigate = useNavigate()
    const [complaints, setComplaints] = useState([])
    const [resources, setResources] = useState([])
    const [tab, setTab] = useState('complaints')
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(true)
    const [newResource, setNewResource] = useState({name: '', description: '', price: '', category: 'Ingredients'})

    useEffect(() => {
        Promise.all([fetchComplaints(), fetchResources()]).finally(() => setLoading(false))
    }, [])

    const fetchComplaints = async () => {
        try {
            setComplaints(await complaintAPI.getAll())
        } catch (e) {
        }
    }

    const fetchResources = async () => {
        try {
            setResources(await resourceAPI.getAll())
        } catch (e) {
        }
    }

    const notify = (m) => {
        setMsg(m);
        setTimeout(() => setMsg(''), 3000)
    }

    const resolve = async (id) => {
        try {
            await complaintAPI.resolve(id);
            notify('Complaint resolved.');
            fetchComplaints()
        } catch (e) {
            notify('Failed')
        }
    }

    const deleteCom = async (id) => {
        if (!window.confirm('Delete this complaint?')) return
        try {
            await complaintAPI.delete(id);
            notify('Deleted.');
            fetchComplaints()
        } catch (e) {
            notify('Failed')
        }
    }

    const addResource = async (e) => {
        e.preventDefault()
        if (!newResource.name || !newResource.description || !newResource.price) {
            notify('Fill all fields');
            return
        }
        try {
            await resourceAPI.create({...newResource, price: parseFloat(newResource.price), _id: generateObjectId()})
            notify('Resource added!')
            setNewResource({name: '', description: '', price: '', category: 'Ingredients'})
            fetchResources()
        } catch (e) {
            notify('Failed: ' + e.message)
        }
    }

    const handleLogout = () => {
        logout();
        navigate('/')
    }

    if (loading) return (
        <div id="app">
            <div className="text" style={{textAlign: 'center', padding: '2rem'}}>
                <span className="spinner"/> Loading admin dashboard...
            </div>
        </div>
    )

    const pendingComplaints = complaints.filter(c => c.status === 'pending')

    return (
        <div id="app">
            <h2 className="text">Admin Dashboard - {user.fullName}</h2>

            {msg && <div className="success-msg">{msg}</div>}

            <div className="tab-bar">
                <button className={'tab-btn' + (tab === 'complaints' ? ' active' : '')}
                        onClick={() => setTab('complaints')}>
                    Complaints ({pendingComplaints.length})
                </button>
                <button className={'tab-btn' + (tab === 'resources' ? ' active' : '')}
                        onClick={() => setTab('resources')}>
                    Manage Resources
                </button>
            </div>

            {tab === 'complaints' && (
                <div>
                    <h3 className="text">Complaint Management</h3>
                    {complaints.length === 0 ? (
                        <div className="text" style={{textAlign: 'center', padding: '2rem'}}>No complaints found.</div>
                    ) : (
                        <div style={{display: 'grid', gap: '1rem'}}>
                            {complaints.map(c => (
                                <div key={c._id} className="panel">
                                    <div style={{marginBottom: '1rem'}}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            flexWrap: 'wrap',
                                            gap: 8,
                                            marginBottom: 8
                                        }}>
                                            <h4 className="text" style={{margin: 0}}>{c.category} Complaint</h4>
                                            <span
                                                className={'badge badge-' + (c.status === 'pending' ? 'pending' : 'resolved')}>{c.status}</span>
                                        </div>
                                        <p className="text" style={{margin: '0 0 0.25rem 0', fontSize: '0.9rem'}}>
                                            <strong>From:</strong> {c.partyName}
                                        </p>
                                        <p className="text"
                                           style={{margin: '0 0 0.75rem 0', fontSize: '0.85rem', opacity: 0.6}}>
                                            {new Date(c.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </p>
                                        <div style={{
                                            background: 'rgba(0,0,0,0.2)',
                                            padding: '10px 12px',
                                            borderRadius: 8,
                                            fontSize: '0.9rem',
                                            color: 'rgba(255,255,255,0.85)',
                                            lineHeight: 1.6
                                        }}>
                                            {c.message}
                                        </div>
                                    </div>
                                    {c.status === 'pending' && (
                                        <div style={{display: 'flex', gap: '0.75rem', justifyContent: 'flex-end'}}>
                                            <button className="btn" onClick={() => deleteCom(c._id)} style={{
                                                maxWidth: 100,
                                                margin: 0,
                                                background: 'rgba(239,68,68,0.3)',
                                                borderColor: 'rgba(239,68,68,0.4)',
                                                color: '#ef4444'
                                            }}>Delete
                                            </button>
                                            <button className="btn" onClick={() => resolve(c._id)} style={{
                                                maxWidth: 120,
                                                margin: 0,
                                                background: 'rgba(76,222,128,0.3)',
                                                borderColor: 'rgba(76,222,128,0.4)',
                                                color: '#4ade80'
                                            }}>Resolve
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {tab === 'resources' && (
                <div>
                    <h3 className="text">Resource Management</h3>

                    <div className="panel" style={{marginBottom: '1.5rem'}}>
                        <h4 className="text" style={{margin: '0 0 1rem 0'}}>Add New Resource</h4>
                        <form onSubmit={addResource} style={{display: 'grid', gap: '0.5rem'}}>
                            <input type="text" placeholder="Resource Name" value={newResource.name}
                                   onChange={e => setNewResource(p => ({...p, name: e.target.value}))} required
                                   style={{margin: '0 0 0.5rem 0'}}/>
                            <input type="text" placeholder="Description" value={newResource.description}
                                   onChange={e => setNewResource(p => ({...p, description: e.target.value}))} required
                                   style={{margin: '0 0 0.5rem 0'}}/>
                            <input type="number" placeholder="Price (Rs.)" value={newResource.price}
                                   onChange={e => setNewResource(p => ({...p, price: e.target.value}))} required min="0"
                                   step="0.01" style={{margin: '0 0 0.5rem 0'}}/>
                            <select value={newResource.category}
                                    onChange={e => setNewResource(p => ({...p, category: e.target.value}))}
                                    style={{margin: '0 0 0.5rem 0'}}>
                                <option>Ingredients</option>
                                <option>Packaging</option>
                                <option>Equipment</option>
                                <option>Supplies</option>
                            </select>
                            <button type="submit" className="btn" style={{maxWidth: 200, margin: '0.5rem auto 0'}}>Add
                                Resource
                            </button>
                        </form>
                    </div>

                    <h4 className="text">Existing Resources ({resources.length})</h4>
                    {resources.length === 0 ? (
                        <p className="text">No resources found.</p>
                    ) : (
                        <div style={{display: 'grid', gap: '0.75rem'}}>
                            {resources.map(r => (
                                <div key={r._id} className="panel" style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: 10
                                }}>
                                    <div>
                                        <h5 className="text" style={{margin: '0 0 0.3rem 0'}}>{r.name}</h5>
                                        <p className="text" style={{
                                            margin: '0 0 0.3rem 0',
                                            fontSize: '0.85rem',
                                            opacity: 0.7
                                        }}>{r.description}</p>
                                        <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
                                            <span style={{fontWeight: 700, color: '#4ade80'}}>Rs. {r.price}</span>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--text-secondary)',
                                                padding: '2px 8px',
                                                background: 'rgba(255,255,255,0.07)',
                                                borderRadius: 4
                                            }}>{r.category}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div style={{
                marginTop: '2rem',
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                <button className="switch-link" onClick={() => navigate('/payments')}
                        style={{width: 'auto', minHeight: 'auto', padding: '0.5rem 1rem'}}>Payment Processing
                </button>
                <button className="switch-link" onClick={() => navigate('/dashboard')}
                        style={{width: 'auto', minHeight: 'auto', padding: '0.5rem 1rem'}}>Back to Dashboard
                </button>
                <button className="switch-link" onClick={handleLogout}
                        style={{width: 'auto', minHeight: 'auto', padding: '0.5rem 1rem'}}>Logout
                </button>
            </div>
        </div>
    )
}
