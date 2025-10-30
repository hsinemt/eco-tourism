import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const router = useRouter();

    const menuItems = [
        { icon: '📊', label: 'Dashboard', path: '/dashboard' },
        { icon: '🏠', label: 'Accommodations', path: '/dashboard/accommodations' },
        { icon: '🎯', label: 'Activities', path: '/dashboard/activites' },
        { icon: '📍', label: 'Locations', path: '/dashboard/locations' },
        { icon: '🌸', label: 'Seasons', path: '/dashboard/seasons' },
        { icon: '🏨', label: 'Booking', path: '/dashboard/booking' },
        { icon: '⭐', label: 'Review & Feedback', path: '/dashboard/feedback' },
        { icon: '👥', label: 'Users', path: '/dashboard/users' },
        { icon: '🚗', label: 'Transport Ecologic', path: '/dashboard/transports' },
        { icon: '♻️', label: 'Products', path: '/dashboard/products' },
        { icon: '♻️', label: 'sustainability', path: '/dashboard/sustainability' },
        { icon: '📈', label: 'Analytics & Reporting', path: '/dashboard/analytics' },
        { icon: '🤖', label: 'NLP/IA', path: '/dashboard/nlp' },
        { icon: '🤖', label: 'IA Search', path: '/dashboard/ai' },
        { icon: '📍', label: 'Itineraries', path: '/dashboard/itineraries' },
        { icon: '🚗', label: 'Carbon Optimizer', path: '/dashboard/carbon-optimizer' },
    ];

    return (
        <div className={styles.dashboardContainer}>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logo}>
                        <span className={styles.logoIcon}>🌿</span>
                        {sidebarOpen && <span className={styles.logoText}>EcoTourism</span>}
                    </div>
                    <button className={styles.toggleBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
                        ☰
                    </button>
                </div>

                <nav className={styles.sidebarNav}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`${styles.navItem} ${router.pathname === item.path ? styles.active : ''}`}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            {sidebarOpen && (
                                <>
                                    <span className={styles.navLabel}>{item.label}</span>
                                    {item.badge && <span className={styles.badge}>{item.badge}</span>}
                                </>
                            )}
                        </Link>
                    ))}
                </nav>

                {sidebarOpen && (
                    <div className={styles.sidebarFooter}>
                        <div className={styles.userProfile}>
                            <div className={styles.avatar}>AD</div>
                            <div className={styles.userInfo}>
                                <div className={styles.userName}>Admin D.</div>
                                <div className={styles.userRole}>SITE MANAGER</div>
                            </div>
                        </div>
                        <div className={styles.progressIndicator}>
                            <span>Progress</span>
                            <span className={styles.progressValue}>60%</span>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>{children}</main>
        </div>
    );
}
