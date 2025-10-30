import DashboardLayout from '../../src/components/dashboard/DashboardLayout';

export default function Dashboard() {
    return (
        <DashboardLayout>
            <div style={{ padding: '1rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Dashboard Overview</h1>
                <p>Welcome to the EcoTourism Dashboard</p>
            </div>
        </DashboardLayout>
    );
}
