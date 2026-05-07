import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../AuthContext'
import {complaintAPI, resourceAPI, generateObjectId} from '../api'
import Layout from './Layout'

export default function Admin() {
    const {user} = useAuth()
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
        if (!confirm('Delete this complaint?')) return
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
            notify('Resource added!');
            setNewResource({name: '', description: '', price: '', category: 'Ingredients'});
            fetchResources()
        } catch (e) {
            notify('Failed: ' + e.message)
        }
    }

    if (loading) return <Layout title="Admin Dashboard">
        <div style={{textAlign: 'center', padding: 60}}><span className="spinner"/></div>
    </Layout>

    const pending = complaints.filter(c => c.status === 'pending')

    return (
        <Layout title="Admin Dashboard" subtitle={`Platform management · ${user.fullName}`}>
            {msg && <div className="alert alert-success">{msg}</div>}

            <div className="tab-bar">
                <button className={`tab ${tab === 'complaints' ? 'active' : ''}`} onClick={() => setTab('complaints')}>
                    Complaints
                    {pending.length > 0 && <span style={{
                        background: 'var(--red)',
                        color: '#fff',
                        borderRadius: 100,
                        padding: '1px 7px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        marginLeft: 4
                    }}>{pending.length}</span>}
                </button>
                <button className={`tab ${tab === 'resources' ? 'active' : ''}`} onClick={() => setTab('resources')}>
                    Resources ({resources.length})
                </button>
            </div>

            {tab === 'complaints' && (
                <div>
                    {complaints.length === 0 ? (
                        <div style={{textAlign: 'center', padding: 48, color: 'var(--text-3)'}}>No complaints
                            found.</div>
                    ) : (
                        <div style={{display: 'grid', gap: 12}}>
                            {complaints.map(c => (
                                <div key={c._id} className="card" style={{padding: '20px 24px'}}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        flexWrap: 'wrap',
                                        gap: 10,
                                        marginBottom: 12
                                    }}>
                                        <div>
                                            <div style={{
                                                fontFamily: 'var(--font-display)',
                                                fontWeight: 700,
                                                marginBottom: 4
                                            }}>
                                                {c.category} Complaint
                                            </div>
                                            <div style={{
                                                fontSize: '0.8125rem',
                                                color: 'var(--text-3)',
                                                marginBottom: 2
                                            }}>
                                                From: <span style={{color: 'var(--text-2)'}}>{c.partyName}</span>
                                            </div>
                                            <div style={{fontSize: '0.75rem', color: 'var(--text-3)'}}>
                                                {new Date(c.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                        <span
                                            className={`badge ${c.status === 'pending' ? 'badge-pending' : 'badge-settled'}`}>{c.status}</span>
                                    </div>
                                    <div style={{
                                        padding: '12px 14px',
                                        background: 'rgba(0,0,0,0.2)',
                                        borderRadius: 8,
                                        fontSize: '0.875rem',
                                        color: 'var(--text-2)',
                                        lineHeight: 1.6,
                                        marginBottom: 14
                                    }}>
                                        {c.message}
                                    </div>
                                    {c.status === 'pending' && (
                                        <div style={{display: 'flex', gap: 10, justifyContent: 'flex-end'}}>
                                            <button className="btn-danger" onClick={() => deleteCom(c._id)}>Delete
                                            </button>
                                            <button className="btn-success" onClick={() => resolve(c._id)}>✓ Resolve
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
                    {/* Add new */}
                    <div className="card" style={{padding: '24px', marginBottom: 24}}>
                        <h3 style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            marginBottom: 20,
                            fontSize: '1rem'
                        }}>
                            Add New Resource
                        </h3>
                        <form onSubmit={addResource} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14}}>
                            <div className="field" style={{marginBottom: 0}}>
                                <label className="label">Resource Name</label>
                                <input className="input" placeholder="e.g. Cooking Oil" value={newResource.name}
                                       onChange={e => setNewResource(p => ({...p, name: e.target.value}))}/>
                            </div>
                            <div className="field" style={{marginBottom: 0}}>
                                <label className="label">Category</label>
                                <select className="input" value={newResource.category}
                                        onChange={e => setNewResource(p => ({...p, category: e.target.value}))}>
                                    <option>Ingredients</option>
                                    <option>Packaging</option>
                                    <option>Equipment</option>
                                    <option>Supplies</option>
                                </select>
                            </div>
                            <div className="field" style={{marginBottom: 0, gridColumn: '1/-1'}}>
                                <label className="label">Description</label>
                                <input className="input" placeholder="Brief description" value={newResource.description}
                                       onChange={e => setNewResource(p => ({...p, description: e.target.value}))}/>
                            </div>
                            <div className="field" style={{marginBottom: 0}}>
                                <label className="label">Price (₹)</label>
                                <input className="input" type="number" min="0" step="0.01" placeholder="0.00"
                                       value={newResource.price}
                                       onChange={e => setNewResource(p => ({...p, price: e.target.value}))}/>
                            </div>
                            <div style={{display: 'flex', alignItems: 'flex-end'}}>
                                <button type="submit" className="btn-primary" style={{width: '100%'}}>+ Add Resource
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* List */}
                    <div style={{display: 'grid', gap: 10}}>
                        {resources.map(r => (
                            <div key={r._id} className="card" style={{
                                padding: '16px 20px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: 16,
                                flexWrap: 'wrap'
                            }}>
                                <div style={{flex: 1}}>
                                    <div style={{fontWeight: 600, marginBottom: 3}}>{r.name}</div>
                                    <div style={{
                                        fontSize: '0.8125rem',
                                        color: 'var(--text-3)',
                                        marginBottom: 4
                                    }}>{r.description}</div>
                                    <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
                                        <span style={{color: 'var(--accent)', fontWeight: 700}}>₹{r.price}</span>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-3)',
                                            padding: '2px 8px',
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: 4
                                        }}>{r.category}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap'}}>
                <button className="btn-ghost" onClick={() => navigate('/payments')} style={{fontSize: '0.875rem'}}>💳
                    Payments
                </button>
                <button className="btn-ghost" onClick={() => navigate('/dashboard')} style={{fontSize: '0.875rem'}}>←
                    Dashboard
                </button>
            </div>
        </Layout>
    )
}
