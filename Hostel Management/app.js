/* ==========================================================================
   DORMIQ OS: Smart Campus Living - Main System Application Script
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. DYNAMIC SYSTEM DATABASE SETUP (LOCALSTORAGE BASED)
// --------------------------------------------------------------------------
const DEFAULT_DATABASE = {
    currentUser: null,
    lockdownActive: false,
    users: [
        { email: 'aarav.mehta@dormiq.edu', name: 'Aarav Mehta', role: 'student', room: '304', block: 'Alpha', phone: '+91 98765 43210' },
        { email: 'sarah.jenkins@dormiq.edu', name: 'Warden Sarah Jenkins', role: 'warden', block: 'Alpha', phone: '+91 98765 00001' },
        { email: 'chief.admin@dormiq.edu', name: 'Admin Dev Shah', role: 'admin', phone: '+91 98765 00002' },
        { email: 'security.desk@dormiq.edu', name: 'Officer Vikram Singh', role: 'security', phone: '+91 98765 00003' },
        { email: 'vikram.mehta@dormiq.edu', name: 'Vikram Mehta', role: 'parent', studentEmail: 'aarav.mehta@dormiq.edu', phone: '+91 98765 00004' },
        // Pre-loaded unassigned students
        { email: 'priya.sharma@dormiq.edu', name: 'Priya Sharma', role: 'student', room: null, block: null, phone: '+91 88888 11111' },
        { email: 'kabir.malhotra@dormiq.edu', name: 'Kabir Malhotra', role: 'student', room: null, block: null, phone: '+91 88888 22222' },
        { email: 'ananya.iyer@dormiq.edu', name: 'Ananya Iyer', role: 'student', room: null, block: null, phone: '+91 88888 33333' }
    ],
    rooms: [
        // Floor 1
        { number: '101', floor: 1, block: 'Alpha', capacity: 2, occupants: ['priya.sharma@dormiq.edu'], status: 'occupied' },
        { number: '102', floor: 1, block: 'Alpha', capacity: 2, occupants: [], status: 'vacant' },
        { number: '103', floor: 1, block: 'Alpha', capacity: 2, occupants: [], status: 'maintenance' },
        { number: '104', floor: 1, block: 'Alpha', capacity: 2, occupants: ['kabir.malhotra@dormiq.edu'], status: 'occupied' },
        { number: '105', floor: 1, block: 'Alpha', capacity: 1, occupants: [], status: 'vacant' },
        // Floor 2
        { number: '201', floor: 2, block: 'Alpha', capacity: 2, occupants: [], status: 'vacant' },
        { number: '202', floor: 2, block: 'Alpha', capacity: 2, occupants: [], status: 'vacant' },
        { number: '203', floor: 2, block: 'Alpha', capacity: 2, occupants: [], status: 'vacant' },
        { number: '204', floor: 2, block: 'Alpha', capacity: 2, occupants: [], status: 'vacant' },
        { number: '205', floor: 2, block: 'Alpha', capacity: 1, occupants: [], status: 'vacant' },
        // Floor 3
        { number: '301', floor: 3, block: 'Alpha', capacity: 2, occupants: [], status: 'vacant' },
        { number: '302', floor: 3, block: 'Alpha', capacity: 2, occupants: [], status: 'vacant' },
        { number: '303', floor: 3, block: 'Alpha', capacity: 2, occupants: [], status: 'vacant' },
        { number: '304', floor: 3, block: 'Alpha', capacity: 2, occupants: ['aarav.mehta@dormiq.edu'], status: 'occupied' },
        { number: '305', floor: 3, block: 'Alpha', capacity: 1, occupants: [], status: 'vacant' }
    ],
    complaints: [
        { id: 'CMP-4091', resident: 'aarav.mehta@dormiq.edu', title: 'Slow Wi-Fi connection', desc: 'Wi-Fi speeds are dropping below 1Mbps in Alpha 304 in the evenings.', category: 'IT Network', priority: 'Medium', status: 'Pending', time: '2026-06-13T10:30:00Z' },
        { id: 'CMP-4090', resident: 'priya.sharma@dormiq.edu', title: 'Leaking water tap', desc: 'Washroom tap in Room 101 is dripping water continuously.', category: 'Plumbing Maintenance', priority: 'High', status: 'In Progress', time: '2026-06-13T09:15:00Z' },
        { id: 'CMP-4089', resident: 'kabir.malhotra@dormiq.edu', title: 'Tube light flickering', desc: 'The study light in Room 104 is flickering intermittently.', category: 'Electrical Maintenance', priority: 'Low', status: 'Resolved', time: '2026-06-12T14:20:00Z' }
    ],
    leaves: [
        { id: 'LVE-9021', resident: 'aarav.mehta@dormiq.edu', dest: 'Mumbai, home town address', start: '2026-06-20T10:00', end: '2026-06-22T18:00', parentApproval: 'Approved', wardenApproval: 'Approved', status: 'Approved', time: '2026-06-12T11:00:00Z' },
        { id: 'LVE-9022', resident: 'priya.sharma@dormiq.edu', dest: 'Delhi, wedding event', start: '2026-06-15T08:00', end: '2026-06-18T20:00', parentApproval: 'Pending', wardenApproval: 'Pending', status: 'Pending', time: '2026-06-13T08:30:00Z' }
    ],
    visitors: [
        { id: 'VST-1102', guestName: 'Vikram Mehta', relation: 'Parent', phone: '9988776655', date: '2026-06-13', host: 'aarav.mehta@dormiq.edu', status: 'Approved', checkIn: '12:15 PM', checkOut: '--' },
        { id: 'VST-1103', guestName: 'Aryan Shah', relation: 'Friend', phone: '9888877777', date: '2026-06-14', host: 'kabir.malhotra@dormiq.edu', status: 'Pending', checkIn: '--', checkOut: '--' }
    ],
    gatepassLogs: [
        { timestamp: '2026-06-13T12:15:00Z', residentName: 'Aarav Mehta', direction: 'Exit', gatekeeper: 'Gate Scanner #1', status: 'Verified' },
        { timestamp: '2026-06-13T14:30:00Z', residentName: 'Aarav Mehta', direction: 'Entry', gatekeeper: 'Gate Scanner #1', status: 'Verified' }
    ],
    notifications: [
        { title: 'Welcome to DormIQ OS', desc: 'SaaS monitoring layers are operational. Press Ctrl+K to explore command palettes.', time: '2026-06-13T10:00:00Z', read: false }
    ]
};

let db = null;
let currentActiveScreen = 'student-dash';
let currentActiveAllocFloor = 1;
let currentSelectedRoom = null;
let gatePassTimerInterval = null;
let qrRotationSecs = 15;
let charts = {};

// Initialize state
function initDatabase() {
    const data = localStorage.getItem('dormiq_data');
    if (!data) {
        localStorage.setItem('dormiq_data', JSON.stringify(DEFAULT_DATABASE));
        db = JSON.parse(JSON.stringify(DEFAULT_DATABASE));
    } else {
        db = JSON.parse(data);
    }
}

function saveDatabase() {
    localStorage.setItem('dormiq_data', JSON.stringify(db));
}

// --------------------------------------------------------------------------
// 2. SYSTEM SCREEN NAVIGATION & ROUTER
// --------------------------------------------------------------------------
function navigateTo(viewId) {
    document.getElementById('landing-view').style.display = 'none';
    document.getElementById('auth-view').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'none';
    
    if (viewId === 'landing') {
        document.getElementById('landing-view').style.display = 'block';
    } else if (viewId === 'auth') {
        document.getElementById('auth-view').style.display = 'flex';
    } else if (viewId === 'dashboard') {
        document.getElementById('dashboard-view').style.display = 'flex';
        renderRoleSidebar();
        renderDashboardData();
        startGatePassTimer();
    }
}

function navigateToScreen(screenId) {
    // Show skeleton loaders during transitions to feel like an enterprise SaaS
    const contentPanel = document.getElementById(`screen-${screenId}`);
    const skeleton = document.getElementById('dashboard-skeleton');
    
    // Deactivate screens
    const screens = document.querySelectorAll('.dashboard-screen');
    screens.forEach(s => s.classList.remove('active'));
    
    if (skeleton && contentPanel) {
        skeleton.style.display = 'block';
        setTimeout(() => {
            skeleton.style.display = 'none';
            contentPanel.classList.add('active');
        }, 300);
    } else if (contentPanel) {
        contentPanel.classList.add('active');
    }

    currentActiveScreen = screenId;
    
    // Highlight sidebar links
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        if (item.getAttribute('onclick').includes(screenId)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Re-setup specific view variables
    const breadcrumb = document.getElementById('breadcrumb-current-view');
    if (breadcrumb) {
        const formattedTitle = screenId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        breadcrumb.textContent = formattedTitle;
    }

    if (screenId === 'allocation') {
        renderRoomAllocationGrid();
    } else if (screenId === 'ai-intelligence') {
        initAIAnalyticsDashboard();
    }
    
    window.scrollTo(0,0);
}

// --------------------------------------------------------------------------
// 3. ROLE PERMISSION SIMULATION HANDLER
// --------------------------------------------------------------------------
function simulateRoleSwitch(role) {
    const roleLoader = document.getElementById('role-loader');
    const roleText = document.getElementById('role-loader-text');
    const roleBadgeLabel = document.getElementById('role-status-lbl');
    
    roleText.textContent = `Configuring ${role.toUpperCase()} Environment...`;
    roleLoader.style.display = 'flex';
    
    setTimeout(() => {
        const testUser = db.users.find(u => u.role === role);
        db.currentUser = testUser ? testUser : { name: `Guest ${role}`, role: role };
        saveDatabase();

        // Sync visual role buttons
        const buttons = document.querySelectorAll('.role-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-role') === role);
        });

        roleBadgeLabel.textContent = `Active Mode: ${role.toUpperCase()} SIMULATOR`;
        document.getElementById('role-nav-badge').textContent = role.charAt(0).toUpperCase() + role.slice(1);
        
        document.getElementById('user-display-name').textContent = db.currentUser.name;
        if (role === 'student' && db.currentUser.room) {
            document.getElementById('user-display-meta').textContent = `Room ${db.currentUser.room}, ${db.currentUser.block} Block`;
        } else if (role === 'warden') {
            document.getElementById('user-display-meta').textContent = `Block Alpha Warden`;
        } else {
            document.getElementById('user-display-meta').textContent = `${role.toUpperCase()} SYSTEM VIEW`;
        }

        // Emergency banner checks
        toggleEmergencyBannerDisplay();
        checkNotificationCount();
        renderRoleSidebar();
        
        // Routes targets
        if (role === 'student') navigateToScreen('student-dash');
        else if (role === 'warden' || role === 'admin') navigateToScreen('admin-dash');
        else if (role === 'security') navigateToScreen('soc-dash');
        else if (role === 'parent') navigateToScreen('parent-portal');

        renderDashboardData();
        lucide.createIcons();
        roleLoader.style.display = 'none';
    }, 600);
}

function renderRoleSidebar() {
    const container = document.getElementById('sidebar-links-container');
    container.innerHTML = '';
    const role = db.currentUser ? db.currentUser.role : 'student';
    
    const linksMap = {
        student: [
            { label: 'Experience Hub', icon: 'home', screen: 'student-dash' },
            { label: 'Smart Complaint Center', icon: 'tool', screen: 'complaints' },
            { label: 'Smart Leave Workflow', icon: 'calendar', screen: 'leaves' },
            { label: 'Digital Access QR', icon: 'qr-code', screen: 'gatepass' },
            { label: 'Visitor Register', icon: 'user-plus', screen: 'visitors' },
            { label: 'Mobile Device Preview', icon: 'smartphone', screen: 'mobile-view' }
        ],
        warden: [
            { label: 'Admin Command Center', icon: 'layout-grid', screen: 'admin-dash' },
            { label: 'Room Intelligence Map', icon: 'map', screen: 'allocation' },
            { label: 'AI Intelligence Layer', icon: 'brain', screen: 'ai-intelligence' },
            { label: 'Smart Complaint Center', icon: 'tool', screen: 'complaints' },
            { label: 'Smart Leave approvals', icon: 'check-square', screen: 'leaves' },
            { label: 'Visitor Pre-approvals', icon: 'users', screen: 'visitors' },
            { label: 'Security Operations', icon: 'shield-alert', screen: 'soc-dash' }
        ],
        admin: [
            { label: 'Admin Command Center', icon: 'layout-grid', screen: 'admin-dash' },
            { label: 'Room Utilizations Map', icon: 'map', screen: 'allocation' },
            { label: 'AI Intelligence Hub', icon: 'brain', screen: 'ai-intelligence' },
            { label: 'Incident Records Log', icon: 'tool', screen: 'complaints' },
            { label: 'Outings Registry', icon: 'calendar', screen: 'leaves' },
            { label: 'Visitor Logs', icon: 'users', screen: 'visitors' },
            { label: 'Security Control Desk', icon: 'shield', screen: 'soc-dash' }
        ],
        security: [
            { label: 'Security Operations Center', icon: 'shield-alert', screen: 'soc-dash' },
            { label: 'Digital Access Management', icon: 'qr-code', screen: 'gatepass' },
            { label: 'Visitor Intel Center', icon: 'users', screen: 'visitors' }
        ],
        parent: [
            { label: 'Parent Consent Portal', icon: 'shield-check', screen: 'parent-portal' },
            { label: 'Smart Complaint Center', icon: 'tool', screen: 'complaints' }
        ]
    };

    const links = linksMap[role] || linksMap.student;
    links.forEach(l => {
        const div = document.createElement('div');
        div.className = `menu-item ${currentActiveScreen === l.screen ? 'active' : ''}`;
        div.setAttribute('onclick', `navigateToScreen('${l.screen}')`);
        div.innerHTML = `<i data-lucide="${l.icon}"></i> ${l.label}`;
        container.appendChild(div);
    });
}

// --------------------------------------------------------------------------
// 4. MAIN RENDER MECHANICS & STATS BINDINGS
// --------------------------------------------------------------------------
function renderDashboardData() {
    const role = db.currentUser ? db.currentUser.role : 'student';
    
    if (role === 'student') {
        const name = db.currentUser.name.split(' ')[0];
        document.getElementById('student-name-display').textContent = name;
        document.getElementById('student-sh-room').textContent = db.currentUser.room ? `Room ${db.currentUser.room}` : 'Unassigned';
        
        const openIssues = db.complaints.filter(c => c.resident === db.currentUser.email && c.status !== 'Resolved').length;
        document.getElementById('student-sh-complaints').textContent = openIssues;
        
        const approvedLeave = db.leaves.find(l => l.resident === db.currentUser.email && l.status === 'Approved');
        document.getElementById('student-sh-pass').textContent = approvedLeave ? 'Active Outing' : 'Local Pass';
        
        renderStudentHistoryTable();
    }
    
    renderComplaintsTable();
    renderLeavesTable();
    renderVisitorsTable();
    renderGatepassLogsTable();
    renderMobileAppView();
    
    if (role === 'parent') {
        renderParentLeavesApprovalTable();
    }
    
    if (role === 'warden' || role === 'admin') {
        document.getElementById('admin-stat-students').textContent = db.users.filter(u => u.role === 'student').length;
        const total = db.rooms.length;
        const occupied = db.rooms.filter(r => r.occupants.length > 0).length;
        const rate = ((occupied / total) * 100).toFixed(1);
        document.getElementById('admin-stat-occupancy').textContent = `${rate}%`;
        document.getElementById('admin-stat-complaints').textContent = db.complaints.filter(c => c.status !== 'Resolved').length;
        document.getElementById('admin-stat-visitors').textContent = db.visitors.length;
        
        renderAdminActivityFeed();
    }
}

function renderStudentHistoryTable() {
    const tbody = document.getElementById('sh-activity-table').querySelector('tbody');
    tbody.innerHTML = '';
    
    const logs = [
        ...db.complaints.filter(c => c.resident === db.currentUser.email).map(c => ({
            time: c.time, cat: 'Incident Report', desc: c.title, status: c.status
        })),
        ...db.leaves.filter(l => l.resident === db.currentUser.email).map(l => ({
            time: l.time, cat: 'Outing Leave', desc: `Outing destination: ${l.dest}`, status: l.status
        }))
    ];
    
    logs.sort((a,b) => new Date(b.time) - new Date(a.time));
    
    if (logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No experience logs registered.</td></tr>';
        return;
    }

    logs.forEach(l => {
        const tr = document.createElement('tr');
        const stClass = l.status === 'Approved' || l.status === 'Resolved' ? 'badge-success' : (l.status === 'Pending' ? 'badge-warning' : 'badge-danger');
        tr.innerHTML = `
            <td style="color:var(--text-muted); font-size:0.75rem;">${new Date(l.time).toLocaleDateString()}</td>
            <td><strong>${l.cat}</strong></td>
            <td>${l.desc}</td>
            <td><span class="badge ${stClass}">${l.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderComplaintsTable() {
    const tbody = document.getElementById('complaints-list-table').querySelector('tbody');
    tbody.innerHTML = '';
    
    let list = db.complaints;
    if (db.currentUser && db.currentUser.role === 'student') {
        list = db.complaints.filter(c => c.resident === db.currentUser.email);
    }
    
    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-muted);">No active complaints registered.</td></tr>';
        return;
    }

    list.forEach(c => {
        const tr = document.createElement('tr');
        const prioClass = c.priority === 'Critical' ? 'badge-danger' : (c.priority === 'High' ? 'badge-warning' : 'badge-info');
        const stClass = c.status === 'Resolved' ? 'badge-success' : (c.status === 'Pending' ? 'badge-warning' : 'badge-danger');
        
        let actions = '';
        if (db.currentUser && (db.currentUser.role === 'warden' || db.currentUser.role === 'admin') && c.status !== 'Resolved') {
            actions = `<button onclick="resolveComplaint('${c.id}')" class="btn-primary" style="padding:6px 12px; font-size:0.75rem;">Dispatch Complete</button>`;
        } else {
            actions = `<span style="color:var(--text-muted); font-size:0.8rem;">Access cleared</span>`;
        }

        tr.innerHTML = `
            <td><code>${c.id}</code></td>
            <td>${c.resident.split('@')[0]}</td>
            <td><strong>${c.category}</strong></td>
            <td style="max-width: 250px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${c.desc}</td>
            <td><span class="badge ${prioClass}">${c.priority}</span></td>
            <td><span class="badge ${stClass}">${c.status}</span></td>
            <td>${actions}</td>
        `;
        tbody.appendChild(tr);
    });
}

function resolveComplaint(id) {
    const comp = db.complaints.find(c => c.id === id);
    if (comp) {
        comp.status = 'Resolved';
        pushNotification('Dispatch Complete', `Complaint ${id} resolved and closed.`, 'student');
        logTerminalSOC(`Incident Dispatch resolved: ${id}`);
        saveDatabase();
        renderDashboardData();
    }
}

function renderLeavesTable() {
    const tbody = document.getElementById('leaves-list-table').querySelector('tbody');
    tbody.innerHTML = '';
    
    let list = db.leaves;
    if (db.currentUser && db.currentUser.role === 'student') {
        list = db.leaves.filter(l => l.resident === db.currentUser.email);
    } else if (db.currentUser && db.currentUser.role === 'parent') {
        list = db.leaves.filter(l => l.resident === db.currentUser.studentEmail);
    }
    
    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:var(--text-muted);">No outing workflows recorded.</td></tr>';
        return;
    }

    list.forEach(l => {
        const tr = document.createElement('tr');
        const stClass = l.status === 'Approved' ? 'badge-success' : (l.status === 'Pending' ? 'badge-warning' : 'badge-danger');
        
        let actions = '';
        if (db.currentUser && db.currentUser.role === 'warden' && l.wardenApproval === 'Pending') {
            actions = `<button onclick="approveLeave('${l.id}', 'warden')" class="btn-primary" style="padding:6px 12px; font-size:0.75rem;">Grant Warden</button>`;
        } else {
            actions = `<span style="color:var(--text-muted); font-size:0.8rem;">Logs locked</span>`;
        }

        tr.innerHTML = `
            <td><code>${l.id}</code></td>
            <td>${l.resident.split('@')[0]}</td>
            <td>${l.dest}</td>
            <td style="font-size:0.75rem; color:var(--text-muted);">${new Date(l.start).toLocaleDateString()} - ${new Date(l.end).toLocaleDateString()}</td>
            <td><span class="badge ${l.parentApproval === 'Approved' ? 'badge-success' : 'badge-warning'}">${l.parentApproval}</span></td>
            <td><span class="badge ${l.wardenApproval === 'Approved' ? 'badge-success' : 'badge-warning'}">${l.wardenApproval}</span></td>
            <td><span class="badge ${stClass}">${l.status}</span></td>
            <td>${actions}</td>
        `;
        tbody.appendChild(tr);
    });
}

function approveLeave(id, actor) {
    const leave = db.leaves.find(l => l.id === id);
    if (leave) {
        if (actor === 'parent') {
            leave.parentApproval = 'Approved';
            pushNotification('Parent consensus Verified', `Parent approved outing consent for ${leave.resident.split('@')[0]}.`, 'warden');
            logTerminalSOC(`Parent consensus granted: LVE-${id}`);
        } else if (actor === 'warden') {
            leave.wardenApproval = 'Approved';
            logTerminalSOC(`Warden consent granted: LVE-${id}`);
        }
        
        if (leave.parentApproval === 'Approved' && leave.wardenApproval === 'Approved') {
            leave.status = 'Approved';
            pushNotification('Outing Pass Granted', `Leave request LVE-${id} fully approved and active.`, 'student');
        }
        
        saveDatabase();
        renderDashboardData();
    }
}

function renderParentLeavesApprovalTable() {
    const tbody = document.getElementById('parent-leaves-list-table').querySelector('tbody');
    tbody.innerHTML = '';
    
    // Filter leaves of ward
    const wardEmail = db.currentUser.studentEmail;
    const list = db.leaves.filter(l => l.resident === wardEmail && l.parentApproval === 'Pending');
    
    // Set badge count
    document.getElementById('parent-sh-pending-leaves').textContent = `${list.length} request${list.length !== 1 ? 's' : ''} pending`;
    
    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No pending consent dispatches.</td></tr>';
        return;
    }

    list.forEach(l => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><code>${l.id}</code></td>
            <td>${l.dest}</td>
            <td>${new Date(l.start).toLocaleDateString()}</td>
            <td>${new Date(l.end).toLocaleDateString()}</td>
            <td><span class="badge badge-warning">Awaiting Approval</span></td>
            <td>
                <button onclick="approveLeave('${l.id}', 'parent')" class="btn-primary" style="padding:6px 12px; font-size:0.75rem;">
                    Grant Consent <i data-lucide="shield-check" style="width:14px; margin-left:4px;"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderVisitorsTable() {
    const tbody = document.getElementById('visitors-list-table').querySelector('tbody');
    tbody.innerHTML = '';
    
    let list = db.visitors;
    if (db.currentUser && db.currentUser.role === 'student') {
        list = db.visitors.filter(v => v.host === db.currentUser.email);
    }
    
    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-muted);">No pre-registered guests found.</td></tr>';
        return;
    }

    list.forEach(v => {
        const tr = document.createElement('tr');
        const stClass = v.status === 'Approved' ? 'badge-success' : (v.status === 'Pending' ? 'badge-warning' : 'badge-danger');
        
        let actions = '';
        if (db.currentUser && db.currentUser.role === 'security') {
            if (v.checkIn === '--') {
                actions = `<button onclick="toggleVisitorSecurity('${v.id}', 'checkin')" class="btn-primary" style="padding:6px 12px; font-size:0.75rem; background:linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); border:none; box-shadow:none;">Entry Gate</button>`;
            } else if (v.checkOut === '--') {
                actions = `<button onclick="toggleVisitorSecurity('${v.id}', 'checkout')" class="btn-secondary" style="padding:6px 12px; font-size:0.75rem;">Exit Gate</button>`;
            } else {
                actions = `<span style="color:var(--text-muted); font-size:0.8rem;">Checked out</span>`;
            }
        } else if (db.currentUser && db.currentUser.role === 'warden' && v.status === 'Pending') {
            actions = `<button onclick="approveVisitor('${v.id}')" class="btn-primary" style="padding:6px 12px; font-size:0.75rem;">Warden Grant</button>`;
        } else {
            actions = `<span style="color:var(--text-muted); font-size:0.8rem;">Logs saved</span>`;
        }

        tr.innerHTML = `
            <td><code>${v.id}</code></td>
            <td><strong>${v.guestName}</strong></td>
            <td>${v.host.split('@')[0]}</td>
            <td>${v.relation}</td>
            <td style="font-size:0.75rem; color:var(--text-muted);">${v.date}</td>
            <td><span class="badge ${stClass}">${v.status}</span></td>
            <td><span class="badge badge-purple" style="font-size:0.65rem;">IN: ${v.checkIn} | OUT: ${v.checkOut}</span></td>
            <td>${actions}</td>
        `;
        tbody.appendChild(tr);
    });
}

function approveVisitor(id) {
    const v = db.visitors.find(vis => vis.id === id);
    if (v) {
        v.status = 'Approved';
        pushNotification('Guest Approved', `Warden approved pre-registered guest ${v.guestName}.`, 'student');
        logTerminalSOC(`Guest pre-registration approved: ${id}`);
        saveDatabase();
        renderDashboardData();
    }
}

function toggleVisitorSecurity(id, direction) {
    const v = db.visitors.find(vis => vis.id === id);
    if (v) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (direction === 'checkin') {
            v.checkIn = timeStr;
            pushNotification('Guest Arrived', `Your visitor ${v.guestName} checked in at Gate 1.`, 'student');
            logTerminalSOC(`Guest Checkin: VST-${id} (${v.guestName})`);
        } else if (direction === 'checkout') {
            v.checkOut = timeStr;
            pushNotification('Guest Departed', `Your visitor ${v.guestName} checked out of campus.`, 'student');
            logTerminalSOC(`Guest Checkout: VST-${id} (${v.guestName})`);
        }
        saveDatabase();
        renderDashboardData();
    }
}

function renderGatepassLogsTable() {
    const tbody = document.getElementById('gatepass-logs-table').querySelector('tbody');
    tbody.innerHTML = '';
    
    if (db.gatepassLogs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No entries recorded.</td></tr>';
        return;
    }

    const list = [...db.gatepassLogs].reverse();
    list.forEach(l => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="color:var(--text-muted); font-size:0.75rem;">${new Date(l.timestamp).toLocaleTimeString()}</td>
            <td><strong>${l.residentName}</strong></td>
            <td><span class="badge ${l.direction === 'Exit' ? 'badge-danger' : 'badge-success'}">${l.direction}</span></td>
            <td style="color:var(--text-muted);">${l.gatekeeper}</td>
            <td><span class="badge badge-success">${l.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderAdminActivityFeed() {
    const container = document.getElementById('admin-live-activity-feed');
    container.innerHTML = '';
    
    const feeds = [
        ...db.complaints.map(c => ({
            icon: 'tool', color: 'var(--danger)', title: 'Complaint Dispatched',
            desc: `AI routing flagged ${c.priority} issue: "${c.title}" for ${c.resident.split('@')[0]}.`,
            time: c.time
        })),
        ...db.leaves.map(l => ({
            icon: 'calendar', color: 'var(--warning)', title: 'Leave Filed',
            desc: `${l.resident.split('@')[0]} requested outing to ${l.dest}. Parent: ${l.parentApproval}.`,
            time: l.time
        })),
        ...db.gatepassLogs.map(g => ({
            icon: 'shield', color: 'var(--accent)', title: 'Gate Access Scan',
            desc: `Student ${g.residentName} recorded at checkpoint (${g.direction}).`,
            time: g.timestamp
        }))
    ];
    
    feeds.sort((a,b) => new Date(b.time) - new Date(a.time));
    const topFeeds = feeds.slice(0, 6);
    
    topFeeds.forEach(f => {
        const div = document.createElement('div');
        div.className = 'glass-card';
        div.style.padding = '14px';
        div.style.background = 'rgba(255,255,255,0.01)';
        div.style.display = 'flex';
        div.style.gap = '12px';
        div.style.alignItems = 'flex-start';
        
        const ago = getMinutesAgoString(new Date(f.time));
        
        div.innerHTML = `
            <div style="width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.015); color:${f.color}; flex-shrink:0;">
                <i data-lucide="${f.icon}" style="width:14px;"></i>
            </div>
            <div style="flex-grow:1;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h5 style="font-size:0.85rem;">${f.title}</h5>
                    <span style="font-size:0.7rem; color:var(--text-muted);">${ago}</span>
                </div>
                <p style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">${f.desc}</p>
            </div>
        `;
        container.appendChild(div);
    });
}

function getMinutesAgoString(date) {
    const diffMins = Math.floor((new Date() - date) / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 min ago';
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs === 1) return '1 hr ago';
    return `${diffHrs} hrs ago`;
}

// --------------------------------------------------------------------------
// 5. NLP AI TEXT INCIDENT PARSER
// --------------------------------------------------------------------------
function simulateAIAnalysis() {
    const text = document.getElementById('complaint-desc').value.toLowerCase();
    
    const classVal = document.getElementById('ai-predicted-class');
    const urgencyVal = document.getElementById('ai-predicted-urgency');
    const slaVal = document.getElementById('ai-predicted-sla');
    const techVal = document.getElementById('ai-predicted-tech');
    
    if (text.length < 5) {
        classVal.textContent = 'Waiting for input...';
        urgencyVal.textContent = 'Analyzing...';
        slaVal.textContent = 'Calculating...';
        techVal.textContent = 'Assigning...';
        return;
    }
    
    let cat = 'General Maintenance';
    let urgency = 'Medium';
    let sla = '24 Hours SLA';
    let tech = 'Duty Supervisor';
    
    if (text.includes('leak') || text.includes('water') || text.includes('flush') || text.includes('pipe') || text.includes('bathroom') || text.includes('flood')) {
        cat = 'Plumbing Maintenance';
        if (text.includes('flood') || text.includes('burst') || text.includes('overflow')) {
            urgency = 'Critical';
            sla = '15 Mins - Emergency Dispatch';
            tech = 'Kiran Kumar (Senior Plumber)';
        } else {
            urgency = 'High';
            sla = '2 Hours SLA';
            tech = 'Ramesh Lal (Duty Plumber)';
        }
    } else if (text.includes('spark') || text.includes('flicker') || text.includes('wire') || text.includes('bulb') || text.includes('light') || text.includes('fan') || text.includes('power') || text.includes('shock')) {
        cat = 'Electrical Maintenance';
        if (text.includes('spark') || text.includes('shock') || text.includes('smoke') || text.includes('short')) {
            urgency = 'Critical';
            sla = '10 Mins - Immediate Isolator';
            tech = 'Anil Gupta (High Tension Specialist)';
        } else {
            urgency = 'High';
            sla = '3 Hours SLA';
            tech = 'Sanjay Patel (Electrical Tech)';
        }
    } else if (text.includes('wifi') || text.includes('internet') || text.includes('router') || text.includes('network') || text.includes('speed') || text.includes('slow')) {
        cat = 'IT Networks';
        urgency = 'Medium';
        sla = '12 Hours SLA';
        tech = 'NOC Operations Center Desk';
    } else if (text.includes('dust') || text.includes('clean') || text.includes('sweep') || text.includes('trash') || text.includes('smell') || text.includes('garbage')) {
        cat = 'Housekeeping';
        urgency = 'Low';
        sla = '24 Hours SLA';
        tech = 'Sanitation Staff Duty Block';
    }

    classVal.textContent = cat;
    urgencyVal.textContent = urgency;
    slaVal.textContent = sla;
    techVal.textContent = tech;
    
    urgencyVal.className = 'ai-result-val';
    if (urgency === 'Critical') urgencyVal.style.color = 'var(--danger)';
    else if (urgency === 'High') urgencyVal.style.color = 'var(--warning)';
    else urgencyVal.style.color = 'var(--accent)';
}

// --------------------------------------------------------------------------
// 6. COMPLAINT, LEAVE & VISITOR CREATION TRIGGERS
// --------------------------------------------------------------------------
function submitComplaint(event) {
    event.preventDefault();
    const title = document.getElementById('complaint-title').value;
    const desc = document.getElementById('complaint-desc').value;
    
    const cat = document.getElementById('ai-predicted-class').textContent;
    const prio = document.getElementById('ai-predicted-urgency').textContent;
    
    const newId = `CMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newComp = {
        id: newId,
        resident: db.currentUser.email,
        title: title,
        desc: desc,
        category: cat.includes('Determining') ? 'General Maintenance' : cat,
        priority: prio.includes('Analyzing') ? 'Medium' : prio,
        status: 'Pending',
        time: new Date().toISOString()
    };
    
    db.complaints.unshift(newComp);
    pushNotification('Complaint Dispatched', `${db.currentUser.name.split(' ')[0]} logged a ${newComp.priority} issue: "${title}".`, 'warden');
    logTerminalSOC(`AI Dispatch assigned: ${newId} (${newComp.priority})`);
    saveDatabase();
    
    document.getElementById('complaint-title').value = '';
    document.getElementById('complaint-desc').value = '';
    simulateAIAnalysis();
    
    // Timeline animation
    const tl1 = document.getElementById('timeline-step-1');
    const tl2 = document.getElementById('timeline-step-2');
    if (tl1 && tl2) {
        tl1.classList.add('completed');
        tl2.classList.add('active');
    }
    
    renderDashboardData();
}

function submitLeave(event) {
    event.preventDefault();
    const start = document.getElementById('leave-start').value;
    const end = document.getElementById('leave-end').value;
    const dest = document.getElementById('leave-dest').value;
    const reason = document.getElementById('leave-reason').value;
    
    const newId = `LVE-${Math.floor(1000 + Math.random() * 9000)}`;
    const newL = {
        id: newId,
        resident: db.currentUser.email,
        dest: dest,
        start: start,
        end: end,
        parentApproval: 'Pending',
        wardenApproval: 'Pending',
        status: 'Pending',
        time: new Date().toISOString()
    };
    
    db.leaves.unshift(newL);
    pushNotification('Consensus Outing Filed', `Resident ${db.currentUser.name.split(' ')[0]} filed outing to ${dest}.`, 'parent');
    logTerminalSOC(`Outing filed: LVE-${newId}`);
    saveDatabase();
    
    document.getElementById('leave-start').value = '';
    document.getElementById('leave-end').value = '';
    document.getElementById('leave-dest').value = '';
    document.getElementById('leave-reason').value = '';
    
    renderDashboardData();
}

function submitVisitor(event) {
    event.preventDefault();
    const name = document.getElementById('visitor-name').value;
    const relation = document.getElementById('visitor-relation').value;
    const phone = document.getElementById('visitor-phone').value;
    const date = document.getElementById('visitor-date').value;
    
    const newId = `VST-${Math.floor(1000 + Math.random() * 9000)}`;
    const newV = {
        id: newId,
        guestName: name,
        relation: relation,
        phone: phone,
        date: date,
        host: db.currentUser.email,
        status: relation.toLowerCase() === 'parent' ? 'Approved' : 'Pending',
        checkIn: '--',
        checkOut: '--'
    };
    
    db.visitors.unshift(newV);
    if (newV.status === 'Pending') {
        pushNotification('Guest Pre-Registration Request', `${db.currentUser.name.split(' ')[0]} pre-registered guest ${name}.`, 'warden');
    }
    logTerminalSOC(`Guest pre-registered: VST-${newId} (${name})`);
    saveDatabase();
    
    document.getElementById('visitor-name').value = '';
    document.getElementById('visitor-relation').value = '';
    document.getElementById('visitor-phone').value = '';
    document.getElementById('visitor-date').value = '';
    
    renderDashboardData();
    renderActiveVisitorPass(newV);
}

function renderActiveVisitorPass(v) {
    const card = document.getElementById('active-visitor-pass');
    if (!card) return;
    card.innerHTML = `
        <div class="glass-card" style="border-color:var(--accent); background:rgba(0, 242, 254, 0.02); max-width:240px; margin:0 auto; padding:16px;">
            <p style="font-size:0.7rem; color:var(--text-muted); margin-bottom:8px;">GUEST PASS: ${v.id}</p>
            <div style="background:#fff; width:120px; height:120px; margin:0 auto; padding:8px; border-radius:6px;">
                <div style="display:grid; grid-template-columns: repeat(12, 1fr); gap:1px; width:100%; height:100%;">
                    ${Array.from({length: 144}).map(() => `<span style="background:${Math.random() > 0.5 ? '#000' : '#fff'}; display:block;"></span>`).join('')}
                </div>
            </div>
            <h5 style="margin-top:12px; font-size:0.95rem;">${v.guestName}</h5>
            <span class="badge ${v.status === 'Approved' ? 'badge-success' : 'badge-warning'}" style="margin-top:6px; font-size:0.6rem;">${v.status}</span>
        </div>
    `;
}

// --------------------------------------------------------------------------
// 7. TIME COUNTDOWN QR GENERATION PIPELINE
// --------------------------------------------------------------------------
function startGatePassTimer() {
    if (gatePassTimerInterval) clearInterval(gatePassTimerInterval);
    
    let timeRemaining = qrRotationSecs;
    const timerText = document.getElementById('gatepass-timer');
    const timerBar = document.getElementById('gatepass-timer-bar');
    const timerTextMobile = document.getElementById('mobile-timer-val');
    const timerBarMobile = document.getElementById('mobile-timer-bar');
    
    generateMockQRPixels('qr-grid-pixels');
    generateMockQRPixels('mobile-qr-pixels');
    
    gatePassTimerInterval = setInterval(() => {
        if (db.lockdownActive) {
            // Freeze pass countdowns if emergency lockdowns are active
            if (timerText) timerText.textContent = 'FREEZE';
            if (timerTextMobile) timerTextMobile.textContent = 'FREEZE';
            document.getElementById('gatepass-status-badge').className = 'badge badge-danger';
            document.getElementById('gatepass-status-badge').textContent = 'INVALID PASS';
            return;
        }
        
        timeRemaining--;
        if (timeRemaining < 0) {
            timeRemaining = qrRotationSecs;
            generateMockQRPixels('qr-grid-pixels');
            generateMockQRPixels('mobile-qr-pixels');
        }
        
        const text = `00:${timeRemaining < 10 ? '0' : ''}${timeRemaining}`;
        if (timerText) timerText.textContent = text;
        if (timerTextMobile) timerTextMobile.textContent = `${timeRemaining}s`;
        
        const pct = (timeRemaining / qrRotationSecs) * 100;
        if (timerBar) timerBar.style.width = `${pct}%`;
        if (timerBarMobile) timerBarMobile.style.width = `${pct}%`;
    }, 1000);
}

function generateMockQRPixels(containerId) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    
    grid.innerHTML = '';
    for (let i = 0; i < 144; i++) {
        const span = document.createElement('span');
        const isCorner = (
            (Math.floor(i / 12) < 3 && i % 12 < 3) ||
            (Math.floor(i / 12) < 3 && i % 12 >= 9) ||
            (Math.floor(i / 12) >= 9 && i % 12 < 3)
        );
        
        if (isCorner) {
            span.style.backgroundColor = '#0A0E1A';
        } else {
            span.style.backgroundColor = Math.random() > 0.45 ? '#0A0E1A' : '#FFFFFF';
        }
        span.style.display = 'block';
        span.style.width = '100%';
        span.style.height = '100%';
        grid.appendChild(span);
    }
}

// --------------------------------------------------------------------------
// 8. INTERACTIVE OCCUPANCY HEATMAP ENGINE
// --------------------------------------------------------------------------
function renderRoomAllocationGrid() {
    const grid = document.getElementById('alloc-rooms-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const rooms = db.rooms.filter(r => r.floor === currentActiveAllocFloor);
    
    rooms.forEach(r => {
        const cell = document.createElement('div');
        
        // Heatmap saturation density steps
        let heatClass = 'heat-0';
        let lbl = 'VACANT (0%)';
        
        if (r.status === 'maintenance') {
            heatClass = 'heat-maintenance';
            lbl = 'UNDER REPAIR';
        } else if (r.occupants.length > 0) {
            const ratio = r.occupants.length / r.capacity;
            if (ratio === 1) {
                heatClass = 'heat-100';
                lbl = 'FULL (100%)';
            } else {
                heatClass = 'heat-50';
                lbl = 'AVAILABLE (50%)';
            }
        }
        
        cell.className = `heatmap-cell ${heatClass}`;
        cell.setAttribute('onclick', `inspectRoom('${r.number}')`);
        cell.innerHTML = `
            <span class="heatmap-cell-num">Room ${r.number}</span>
            <span class="heatmap-cell-lbl">${lbl}</span>
        `;
        grid.appendChild(cell);
    });

    // Populate allocations selects
    const select = document.getElementById('alloc-student-select');
    if (select) {
        select.innerHTML = '<option value="">-- Choose unassigned resident --</option>';
        const unassigned = db.users.filter(u => u.role === 'student' && !u.room);
        unassigned.forEach(u => {
            select.innerHTML += `<option value="${u.email}">${u.name} (${u.email.split('@')[0]})</option>`;
        });
    }
}

function switchAllocFloor(fNum) {
    currentActiveAllocFloor = parseInt(fNum);
    const btns = document.querySelectorAll('.floor-btn');
    btns.forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.getAttribute('data-floor')) === fNum);
    });
    renderRoomAllocationGrid();
    closeRoomInspector();
}

function inspectRoom(roomNum) {
    currentSelectedRoom = roomNum;
    const r = db.rooms.find(room => room.number === roomNum);
    if (!r) return;
    
    const panel = document.getElementById('room-inspector-card');
    panel.style.display = 'block';
    
    document.getElementById('inspect-room-number').textContent = `Room ${r.number} Inspector`;
    
    const badge = document.getElementById('inspect-room-badge');
    badge.textContent = r.status.toUpperCase();
    badge.className = `badge ${r.status === 'vacant' ? 'badge-success' : (r.status === 'occupied' ? 'badge-info' : (r.status === 'full' ? 'badge-danger' : 'badge-warning'))}`;
    
    const list = document.getElementById('inspect-occupants-list');
    list.innerHTML = '';
    
    if (r.occupants.length === 0) {
        list.innerHTML = '<p style="font-size:0.8rem; color:var(--text-muted); font-style:italic;">No active allocations.</p>';
    } else {
        r.occupants.forEach(email => {
            const u = db.users.find(usr => usr.email === email);
            const name = u ? u.name : email;
            list.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.015); padding:10px 14px; border:1px solid var(--border-color); border-radius:6px;">
                    <span style="font-size:0.85rem; font-weight:600;">${name}</span>
                    <i data-lucide="user-x" onclick="evictStudent('${email}')" style="color:var(--danger); cursor:pointer; width:16px;" title="Evict Space"></i>
                </div>
            `;
        });
    }
    lucide.createIcons();
}

function closeRoomInspector() {
    document.getElementById('room-inspector-card').style.display = 'none';
    currentSelectedRoom = null;
}

function assignStudentToRoom() {
    if (!currentSelectedRoom) return;
    const r = db.rooms.find(room => room.number === currentSelectedRoom);
    const select = document.getElementById('alloc-student-select');
    const email = select.value;
    
    if (!email) {
        alert('Choose an unassigned resident first!');
        return;
    }
    
    if (r.occupants.length >= r.capacity) {
        alert('Room density is already at maximum capacity!');
        return;
    }
    
    r.occupants.push(email);
    r.status = r.occupants.length === r.capacity ? 'full' : 'occupied';
    
    const student = db.users.find(u => u.email === email);
    if (student) {
        student.room = r.number;
        student.block = r.block;
    }
    
    pushNotification('Room Space Allocated', `Resident ${student.name.split(' ')[0]} assigned to Room ${r.number}.`, 'student');
    logTerminalSOC(`Space allocation registered: Room ${r.number} assigned to ${email}`);
    
    saveDatabase();
    renderRoomAllocationGrid();
    inspectRoom(r.number);
    renderDashboardData();
}

function evictStudent(email) {
    if (!currentSelectedRoom) return;
    const r = db.rooms.find(room => room.number === currentSelectedRoom);
    
    r.occupants = r.occupants.filter(o => o !== email);
    r.status = r.occupants.length === 0 ? 'vacant' : 'occupied';
    
    const student = db.users.find(u => u.email === email);
    if (student) {
        student.room = null;
        student.block = null;
    }
    
    pushNotification('Room Allocation Reset', `Student ${student.name.split(' ')[0]} deallocated space.`, 'student');
    logTerminalSOC(`Space deallocation registered: Room ${r.number} evicted ${email}`);
    
    saveDatabase();
    renderRoomAllocationGrid();
    inspectRoom(r.number);
    renderDashboardData();
}

// --------------------------------------------------------------------------
// 9. NEURAL CHARTS LAYER (CHART.JS BINDINGS)
// --------------------------------------------------------------------------
function initAIAnalyticsDashboard() {
    Object.keys(charts).forEach(key => {
        if (charts[key]) charts[key].destroy();
    });

    const ctxForecast = document.getElementById('chart-occupancy-forecast');
    const ctxPatterns = document.getElementById('chart-visitor-patterns');
    const ctxCategories = document.getElementById('chart-complaint-categories');
    
    if (!ctxForecast || !ctxPatterns || !ctxCategories) return;

    Chart.defaults.color = '#64748B';
    Chart.defaults.font.family = 'Inter';

    // Occupancy Line with glowing gradients
    const grad1 = ctxForecast.getContext('2d').createLinearGradient(0, 0, 0, 240);
    grad1.addColorStop(0, 'rgba(0, 242, 254, 0.15)');
    grad1.addColorStop(1, 'rgba(0, 242, 254, 0)');

    charts.forecast = new Chart(ctxForecast, {
        type: 'line',
        data: {
            labels: ['July', 'Aug', 'Sept', 'Oct', 'Nov (AI)', 'Dec (AI)'],
            datasets: [{
                label: 'Actual Occupancy',
                data: [82, 85, 91, 91, null, null],
                borderColor: '#14B8A6',
                borderWidth: 2,
                tension: 0.35,
                spanGaps: true
            }, {
                label: 'AI Predictive Bound',
                data: [null, null, 91, 92, 95, 98],
                borderColor: '#00F2FE',
                backgroundColor: grad1,
                borderDash: [5, 5],
                borderWidth: 2,
                fill: true,
                tension: 0.35,
                spanGaps: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top', labels: { boxWidth: 10 } } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.03)' }, min: 70, max: 100 },
                x: { grid: { display: false } }
            }
        }
    });

    // Visitor Bar
    charts.patterns = new Chart(ctxPatterns, {
        type: 'bar',
        data: {
            labels: ['08:00', '11:00', '14:00', '17:00', '20:00', '22:00'],
            datasets: [{
                data: [14, 28, 45, 92, 115, 12],
                backgroundColor: 'rgba(0, 242, 254, 0.6)',
                borderColor: '#00F2FE',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.03)' } },
                x: { grid: { display: false } }
            }
        }
    });

    // Categories Doughnut
    charts.categories = new Chart(ctxCategories, {
        type: 'doughnut',
        data: {
            labels: ['Electrical', 'Plumbing', 'IT Network', 'Sanitation'],
            datasets: [{
                data: [25, 40, 20, 15],
                backgroundColor: ['#EF4444', '#FBBF24', '#00F2FE', '#8B5CF6'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right', labels: { boxWidth: 12 } } }
        }
    });
}

// --------------------------------------------------------------------------
// 10. SECURITY SCANS & LOCKDOWNS (SOC LOGIC)
// --------------------------------------------------------------------------
function logTerminalSOC(text) {
    const box = document.getElementById('soc-terminal-logs');
    if (!box) return;
    
    const now = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    line.className = 'terminal-line';
    
    if (text.includes('LOCKDOWN') || text.includes('WARN')) {
        line.innerHTML = `<span class="time">[${now}]</span> <span class="warn">${text}</span>`;
    } else {
        line.innerHTML = `<span class="time">[${now}]</span> ${text}`;
    }
    
    box.appendChild(line);
    box.scrollTop = box.scrollHeight;
}

function toggleEmergencyBroadcast() {
    db.lockdownActive = !db.lockdownActive;
    saveDatabase();
    
    toggleEmergencyBannerDisplay();
    
    const btn = document.getElementById('btn-emergency-broadcast');
    const statusText = document.getElementById('soc-lockdown-status');
    
    if (db.lockdownActive) {
        if (btn) btn.textContent = 'Revoke Lockdown';
        if (statusText) {
            statusText.textContent = 'ACTIVE';
            statusText.style.color = 'var(--danger)';
        }
        logTerminalSOC('[WARN] Emergency Lockdown Protocol Broadcasting!');
        pushNotification('EMERGENCY LOCKDOWN', 'Lockdown protocol active. Return to rooms.', 'student');
        pushNotification('EMERGENCY LOCKDOWN', 'Safety protocol initialized.', 'parent');
    } else {
        if (btn) btn.textContent = 'Broadcast Lockdown';
        if (statusText) {
            statusText.textContent = 'Inactive';
            statusText.style.color = 'var(--text-muted)';
        }
        logTerminalSOC('Lockdown protocols revoked. Resuming normal operations.');
        pushNotification('Lockdown Revoked', 'Hostel access points restored to nominal operations.', 'student');
        saveDatabase();
    }
    
    startGatePassTimer();
}

function toggleEmergencyBannerDisplay() {
    const banner = document.getElementById('active-emergency-banner');
    if (banner) {
        banner.style.display = db.lockdownActive ? 'flex' : 'none';
    }
}

function triggerSecurityScan() {
    const residentName = 'Aarav Mehta';
    const lastLog = db.gatepassLogs.filter(l => l.residentName === residentName)[0];
    const direction = lastLog && lastLog.direction === 'Exit' ? 'Entry' : 'Exit';
    
    if (db.lockdownActive) {
        alert('QR Validation Denied: Access points are frozen under emergency lockdown!');
        logTerminalSOC(`[WARN] RFID scan denied: Resident ${residentName} trying to bypass locked gate.`);
        return;
    }
    
    const newLog = {
        timestamp: new Date().toISOString(),
        residentName: residentName,
        direction: direction,
        gatekeeper: 'Gate Scanner #1',
        status: 'Verified'
    };
    
    db.gatepassLogs.push(newLog);
    
    pushNotification('Checkpoint scan logged', `Security gate pass scanned: logged ${direction} access.`, 'student');
    pushNotification('Resident gate cross', `Resident Aarav Mehta checked at checkpoint (${direction}).`, 'warden');
    logTerminalSOC(`Access verification success: ${residentName} logged direction ${direction.toUpperCase()}`);
    
    saveDatabase();
    renderDashboardData();
    
    alert(`QR Token validation success! Guard terminal scanned gate authorization: logged ${direction.toUpperCase()} logging.`);
}

function triggerGuestRFIDScan() {
    const guest = db.visitors.find(v => v.guestName === 'Vikram Mehta');
    if (!guest) return;
    
    if (db.lockdownActive) {
        alert('Access Denied: RFID readers frozen during emergency lockdown!');
        logTerminalSOC('[WARN] RFID guest validation denied: Main gate locked.');
        return;
    }
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (guest.checkIn === '--') {
        guest.checkIn = timeStr;
        pushNotification('Guest Check-in', `Your parent Vikram Mehta checked in at Gate 1.`, 'student');
        logTerminalSOC(`RFID Guest Check-in: VST-${guest.id} (${guest.guestName})`);
    } else if (guest.checkOut === '--') {
        guest.checkOut = timeStr;
        pushNotification('Guest Check-out', `Your parent Vikram Mehta checked out of campus.`, 'student');
        logTerminalSOC(`RFID Guest Check-out: VST-${guest.id} (${guest.guestName})`);
    } else {
        alert('Guest card has already completed entry/exit bounds!');
        return;
    }
    
    saveDatabase();
    renderDashboardData();
    alert(`RFID Scan Success: Vikram Mehta logged gate pass.`);
}

// --------------------------------------------------------------------------
// 11. DYNAMIC KEYBOARD COMMAND PALETTE (CTRL+K SEARCH INDEX)
// --------------------------------------------------------------------------
const COMMAND_INDEX = [
    { name: 'Student Experience Overview', meta: 'Navigate to Student Dashboard', action: () => navigateToScreen('student-dash') },
    { name: 'AI Incident Reports Desk', meta: 'Log complaints, categorized using Natural Language dispatches', action: () => navigateToScreen('complaints') },
    { name: 'Digital QR Pass Ticket', meta: 'Display outbound self-rotating gate code', action: () => navigateToScreen('gatepass') },
    { name: 'Pre-Register Guest Pass', meta: 'Register parent or visitor expected times', action: () => navigateToScreen('visitors') },
    { name: 'Warden Room Blueprint Allocator', meta: 'Interactive room occupancy density heatmap grid', action: () => navigateToScreen('allocation') },
    { name: 'AI Operational Intelligence Hub', meta: 'Check occupancy forecasts and maintenance risk matrices', action: () => navigateToScreen('ai-intelligence') },
    { name: 'Simulation: Scan Resident QR', meta: 'Log gate checkpoint check-ins / check-outs', action: () => triggerSecurityScan() },
    { name: 'Simulation: Scan Guest RFID Card', meta: 'Log security gate check-in for pre-registered guests', action: () => triggerGuestRFIDScan() },
    { name: 'Security Operations Center (SOC)', meta: 'Checkpoint consoles, logs and lockdowns panel', action: () => navigateToScreen('soc-dash') },
    { name: 'Parent Consensus Portal', meta: 'Review ward logs and approve leaves', action: () => navigateToScreen('parent-portal') },
    { name: 'Trigger Emergency Broadcast', meta: 'Toggle lockdown alert for all signed in campus clients', action: () => toggleEmergencyBroadcast() }
];

let selectedCommandIndex = 0;

function openCommandPalette() {
    const palette = document.getElementById('command-palette');
    palette.style.display = 'flex';
    document.getElementById('command-input').value = '';
    document.getElementById('command-input').focus();
    selectedCommandIndex = 0;
    filterCommandPalette();
}

function closeCommandPalette(event) {
    if (event) event.stopPropagation();
    document.getElementById('command-palette').style.display = 'none';
}

function filterCommandPalette() {
    const q = document.getElementById('command-input').value.toLowerCase();
    const resultsContainer = document.getElementById('command-results');
    resultsContainer.innerHTML = '';
    
    const filtered = COMMAND_INDEX.filter(c => 
        c.name.toLowerCase().includes(q) || c.meta.toLowerCase().includes(q)
    );
    
    if (filtered.length === 0) {
        resultsContainer.innerHTML = '<div style="padding:14px; text-align:center; color:var(--text-muted); font-size:0.85rem;">No matching actions found.</div>';
        return;
    }
    
    filtered.forEach((cmd, idx) => {
        const item = document.createElement('div');
        item.className = `command-option ${idx === selectedCommandIndex ? 'selected' : ''}`;
        item.innerHTML = `
            <div>
                <strong>${cmd.name}</strong>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">${cmd.meta}</div>
            </div>
            <span class="command-option-meta">Action</span>
        `;
        
        item.addEventListener('click', () => {
            cmd.action();
            closeCommandPalette();
        });
        
        resultsContainer.appendChild(item);
    });
}

// --------------------------------------------------------------------------
// 12. MOBILE VIEW SUB-SCREENS INTERACTION
// --------------------------------------------------------------------------
function switchMobileSubScreen(subId) {
    const screens = document.querySelectorAll('.mobile-sub-screen');
    screens.forEach(s => s.classList.remove('active'));
    document.getElementById(`mobile-sub-${subId}`).classList.add('active');
    
    const tabs = document.querySelectorAll('.phone-nav-btn');
    tabs.forEach(tab => {
        tab.classList.toggle('active', tab.id === `mobile-tab-${subId}`);
    });
}

function renderMobileAppView() {
    const openIssues = db.complaints.filter(c => c.resident === 'aarav.mehta@dormiq.edu' && c.status !== 'Resolved').length;
    document.getElementById('mobile-dash-complaints').textContent = openIssues;
    
    const approvedLeave = db.leaves.find(l => l.resident === 'aarav.mehta@dormiq.edu' && l.status === 'Approved');
    document.getElementById('mobile-dash-pass').textContent = approvedLeave ? 'Approved' : 'Local';
    
    const list = document.getElementById('mobile-notification-list');
    list.innerHTML = '';
    
    const unread = db.notifications.slice(0, 4);
    if (unread.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-size:0.7rem;">No active alerts</p>';
    } else {
        unread.forEach(n => {
            list.innerHTML += `
                <div class="glass-card" style="padding:10px; background:rgba(255,255,255,0.01);">
                    <h6 style="font-size:0.75rem; color:var(--accent);">${n.title}</h6>
                    <p style="font-size:0.65rem; color:var(--text-muted); margin-top:2px;">${n.desc}</p>
                </div>
            `;
        });
    }
}

function submitMobileComplaint(event) {
    event.preventDefault();
    const title = document.getElementById('mobile-complaint-title').value;
    const desc = document.getElementById('mobile-complaint-desc').value;
    
    const newId = `CMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newComp = {
        id: newId,
        resident: 'aarav.mehta@dormiq.edu',
        title: title,
        desc: desc,
        category: 'Facility Operations',
        priority: 'High',
        status: 'Pending',
        time: new Date().toISOString()
    };
    
    db.complaints.unshift(newComp);
    pushNotification('Complaint Dispatched', `Resident Aarav Mehta logged critical mobile issue: "${title}".`, 'warden');
    logTerminalSOC(`Mobile complaint logged: ${newId}`);
    saveDatabase();
    
    document.getElementById('mobile-complaint-title').value = '';
    document.getElementById('mobile-complaint-desc').value = '';
    
    switchMobileSubScreen('dash');
    renderDashboardData();
}

// --------------------------------------------------------------------------
// 13. NOTIFICATIONS SYSTEM
// --------------------------------------------------------------------------
function pushNotification(title, desc, targetRole) {
    const notification = {
        title: title,
        desc: desc,
        time: new Date().toISOString(),
        read: false,
        targetRole: targetRole
    };
    
    db.notifications.unshift(notification);
    saveDatabase();
    checkNotificationCount();
}

function checkNotificationCount() {
    const role = db.currentUser ? db.currentUser.role : 'student';
    const unread = db.notifications.filter(n => !n.read && n.targetRole === role).length;
    
    const dot = document.getElementById('alert-dot');
    const mDot = document.getElementById('mobile-alert-dot');
    
    if (dot) dot.style.display = unread > 0 ? 'block' : 'none';
    if (mDot) mDot.style.display = unread > 0 ? 'block' : 'none';
}

function toggleNotificationPanel() {
    const box = document.getElementById('notification-box');
    const isHidden = box.style.display === 'none';
    
    if (isHidden) {
        renderNotificationsDropdown();
        box.style.display = 'block';
        
        const role = db.currentUser ? db.currentUser.role : 'student';
        db.notifications.forEach(n => {
            if (n.targetRole === role) n.read = true;
        });
        saveDatabase();
        checkNotificationCount();
    } else {
        box.style.display = 'none';
    }
}

function renderNotificationsDropdown() {
    const list = document.getElementById('notification-list');
    if (!list) return;
    list.innerHTML = '';
    
    const role = db.currentUser ? db.currentUser.role : 'student';
    const listItems = db.notifications.filter(n => n.targetRole === role || !n.targetRole);
    
    if (listItems.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-size:0.8rem; padding: 10px 0;">No active alerts.</p>';
        return;
    }
    
    listItems.forEach(n => {
        const div = document.createElement('div');
        div.className = 'glass-card';
        div.style.padding = '10px';
        div.style.background = 'rgba(255,255,255,0.01)';
        div.style.border = '1px solid var(--border-color)';
        
        const ago = getMinutesAgoString(new Date(n.time));
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <h6 style="font-size:0.8rem; color:var(--accent); font-weight:600;">${n.title}</h6>
                <span style="font-size:0.65rem; color:var(--text-muted);">${ago}</span>
            </div>
            <p style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">${n.desc}</p>
        `;
        list.appendChild(div);
    });
}

// --------------------------------------------------------------------------
// 14. SESSION INITIALIZATION / LOGIN
// --------------------------------------------------------------------------
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('auth-email').value;
    
    const user = db.users.find(u => u.email === email);
    if (user) {
        db.currentUser = user;
        saveDatabase();
        navigateTo('dashboard');
        simulateRoleSwitch(user.role);
    } else {
        alert('Credential check failed. Check judge test emails.');
    }
}

function logOut() {
    db.currentUser = null;
    saveDatabase();
    navigateTo('auth');
}

// --------------------------------------------------------------------------
// 15. KEYBOARD GLOBAL SHORTCUT LISTENERS (CTRL+K HOOK)
// --------------------------------------------------------------------------
window.addEventListener('keydown', (e) => {
    // Ctrl + K or Command + K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const palette = document.getElementById('command-palette');
        if (palette.style.display === 'flex') {
            closeCommandPalette();
        } else {
            openCommandPalette();
        }
    }
    
    const palette = document.getElementById('command-palette');
    if (palette && palette.style.display === 'flex') {
        const resultsContainer = document.getElementById('command-results');
        const q = document.getElementById('command-input').value.toLowerCase();
        const filtered = COMMAND_INDEX.filter(c => 
            c.name.toLowerCase().includes(q) || c.meta.toLowerCase().includes(q)
        );
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedCommandIndex = (selectedCommandIndex + 1) % filtered.length;
            filterCommandPalette();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedCommandIndex = (selectedCommandIndex - 1 + filtered.length) % filtered.length;
            filterCommandPalette();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filtered[selectedCommandIndex]) {
                filtered[selectedCommandIndex].action();
                closeCommandPalette();
            }
        } else if (e.key === 'Escape') {
            closeCommandPalette();
        }
    }
});

// Start-up triggers
window.onload = function() {
    initDatabase();
    navigateTo('landing');
    lucide.createIcons();
};
