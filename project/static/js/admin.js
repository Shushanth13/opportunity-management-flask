const captchas = { login:'', signup:'', forgot:'' };
function generateCaptcha(type) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let code = '';
    for (let i = 0; i < 5; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    captchas[type] = code;
    const el = document.getElementById(type + 'CaptchaText');
    if (el) el.textContent = code;
}
generateCaptcha('login');
generateCaptcha('signup');
generateCaptcha('forgot');

// ===== PAGE NAVIGATION =====
function showPage(pageId) {
    document.querySelectorAll('.form-page').forEach(p => p.classList.remove('active'));
    setTimeout(() => { const el = document.getElementById(pageId); if (el) el.classList.add('active'); }, 50);
    document.querySelectorAll('.error-msg').forEach(e => e.classList.remove('show'));
    document.querySelectorAll('input').forEach(i => i.classList.remove('error'));
}

function togglePass(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';
    btn.innerHTML = isPass
        ? '<svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
        : '<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
}

// ===== HELPERS =====
function showError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    if (msg) { const sp = el.querySelector('span'); if (sp) sp.textContent = msg; }
    el.classList.add('show');
}
function clearAllErrors(formId) {
    document.querySelectorAll('#' + formId + ' .error-msg').forEach(e => e.classList.remove('show'));
    document.querySelectorAll('#' + formId + ' input').forEach(i => i.classList.remove('error'));
}
function shakeForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.classList.add('shake');
    setTimeout(() => form.classList.remove('shake'), 400);
}
function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function showToast(msg) {
    const toastMsg = document.getElementById('toastMsg');
    const toast = document.getElementById('toast');
    if (toastMsg) toastMsg.textContent = msg;
    if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

function checkStrength(val) {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    const labels = ['','Weak','Medium','Strong','Very Strong'];
    const classes = ['','weak','medium','strong','very-strong'];
    for (let i = 1; i <= 4; i++) {
        const bar = document.getElementById('str' + i);
        if (bar) { bar.className = 'strength-bar'; if (i <= score) bar.classList.add(classes[score]); }
    }
    const lbl = document.getElementById('strengthLabel');
    if (lbl) lbl.textContent = val.length > 0 ? labels[score] : '';
}

// ===== SHOW DASHBOARD =====
function showDashboard(email) {
    const authWrapper = document.getElementById('authWrapper');
    const dashboardWrapper = document.getElementById('dashboardWrapper');
    if (authWrapper) authWrapper.style.display = 'none';
    if (dashboardWrapper) dashboardWrapper.classList.add('active');
    document.body.style.alignItems = 'stretch';

    const name = email.split('@')[0];
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    const dashName = document.getElementById('dashName');
    const dashAvatar = document.getElementById('dashAvatar');
    if (dashName) dashName.textContent = displayName;
    if (dashAvatar) dashAvatar.textContent = displayName.substring(0, 2).toUpperCase();

    if (window.innerWidth <= 768) {
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) menuToggle.style.display = 'flex';
    }
}

function handleLogout() {
    const dashboardWrapper = document.getElementById('dashboardWrapper');
    const authWrapper = document.getElementById('authWrapper');
    if (dashboardWrapper) dashboardWrapper.classList.remove('active');
    if (authWrapper) authWrapper.style.display = 'flex';
    document.body.style.alignItems = '';
    showToast('Signed out successfully');
    showPage('loginPage');
}

// ===== NAV ITEMS =====
document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', function() {
        const page = this.getAttribute('data-page');
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
        const sectionMap = {
            dashboard: ['dashboardSection', 'Dashboard'],
            learner: ['learnerSection', 'Learner Management'],
            verifier: ['verifierSection', 'Verifier Management'],
            collaborator: ['collaboratorSection', 'Collaborator Management'],
            opportunity: ['opportunitySection', 'Opportunity Management'],
            reports: ['reportsSection', 'Reports and Analytics']
        };
        if (sectionMap[page]) {
            const sec = document.getElementById(sectionMap[page][0]);
            const title = document.getElementById('pageTitle');
            if (sec) sec.classList.add('active');
            if (title) title.textContent = sectionMap[page][1];
        }
    });
});

// ===== TABS =====
function changeChartPeriod(period) {
    document.querySelectorAll('.tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === period) btn.classList.add('active');
    });
    const chartData = {
        daily: 'M0,120 Q50,110 100,90 T200,70 T300,50 T400,40',
        weekly: 'M0,110 Q50,95 100,85 T200,65 T300,45 T400,35',
        monthly: 'M0,100 Q50,85 100,75 T200,55 T300,40 T400,30',
        quarterly: 'M0,90 Q50,75 100,65 T200,50 T300,35 T400,25',
        yearly: 'M0,80 Q50,65 100,55 T200,40 T300,30 T400,20'
    };
    const linePath = document.getElementById('linePath');
    const lineArea = document.getElementById('lineArea');
    const path = chartData[period];
    if (linePath) linePath.setAttribute('d', path);
    if (lineArea) lineArea.setAttribute('d', path + ' L400,150 L0,150 Z');
}

// ===== NOTIFICATIONS =====
function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown) dropdown.classList.toggle('active');
}

function markAllRead() {
    document.querySelectorAll('.notif-item.unread').forEach(item => item.classList.remove('unread'));
    showToast('All notifications marked as read');
}

document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('notificationDropdown');
    const btn = document.getElementById('notifBtn');
    if (dropdown && btn && !dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

// ===== THEME TOGGLE =====
function toggleTheme() {
    const html = document.documentElement;
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.innerHTML = newTheme === 'dark'
            ? '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
            : '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
    }
}

// ===== SEARCH =====
function openSearch() {
    const el = document.getElementById('searchContainer');
    if (el) { el.classList.add('active'); }
    const inp = document.getElementById('searchInput');
    if (inp) inp.focus();
}
function closeSearch() {
    const el = document.getElementById('searchContainer');
    if (el) el.classList.remove('active');
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSearch();
        closeCourseModal();
        closeOpportunityModal();
        closeOpportunityDetailsModal();
        closeCollaboratorCoursesModal();
        closeQuickAddModal();
        closeBulkUploadModal();
        closeQuickAddVerifierModal();
        closeBulkUploadVerifierModal();
        closeVerifierDetailsModal();
    }
});

const _searchContainer = document.getElementById('searchContainer');
if (_searchContainer) _searchContainer.addEventListener('click', function(e) {
    if (e.target === this) closeSearch();
});

// ===== COURSE MODAL =====
function openCourseDetails(courseName, stats) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('modalCourseTitle', courseName);
    set('modalEnrolled', stats.enrolled);
    set('modalCompleted', stats.completed);
    set('modalInProgress', stats.inProgress);
    set('modalHalfDone', stats.halfDone);
    const modal = document.getElementById('courseModal');
    if (modal) modal.classList.add('active');
}
function closeCourseModal() {
    const modal = document.getElementById('courseModal');
    if (modal) modal.classList.remove('active');
}
const _courseModal = document.getElementById('courseModal');
if (_courseModal) _courseModal.addEventListener('click', function(e) {
    if (e.target === this) closeCourseModal();
});

// ===== OPPORTUNITY DETAILS MODAL =====
function openOpportunityDetails(title, details) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('opportunityDetailTitle', title);
    set('opportunityDetailDuration', details.duration);
    set('opportunityDetailStartDate', details.startDate);
    set('opportunityDetailApplicants', details.applicants);
    set('opportunityDetailDescription', details.description);
    set('opportunityDetailFuture', details.futureOpportunities);
    set('opportunityDetailPrereqs', details.prerequisites);
    const skillsContainer = document.getElementById('opportunityDetailSkills');
    if (skillsContainer) {
        skillsContainer.innerHTML = '';
        details.skills.forEach(skill => {
            const tag = document.createElement('span');
            tag.className = 'skill-tag';
            tag.textContent = skill;
            skillsContainer.appendChild(tag);
        });
    }
    const modal = document.getElementById('opportunityDetailsModal');
    if (modal) modal.classList.add('active');
}
function closeOpportunityDetailsModal() {
    const modal = document.getElementById('opportunityDetailsModal');
    if (modal) modal.classList.remove('active');
}
function applyToOpportunity() {
    showToast('Application submitted successfully!');
    closeOpportunityDetailsModal();
}
const _oppDetailsModal = document.getElementById('opportunityDetailsModal');
if (_oppDetailsModal) _oppDetailsModal.addEventListener('click', function(e) {
    if (e.target === this) closeOpportunityDetailsModal();
});

// ===== COLLABORATOR COURSES MODAL =====
function openCollaboratorCourses(name, role) {
    const n = document.getElementById('collaboratorName');
    const r = document.getElementById('collaboratorRole');
    if (n) n.textContent = name + "'s Submitted Courses";
    if (r) r.textContent = 'Role: ' + role;
    const modal = document.getElementById('collaboratorCoursesModal');
    if (modal) modal.classList.add('active');
}
function closeCollaboratorCoursesModal() {
    const modal = document.getElementById('collaboratorCoursesModal');
    if (modal) modal.classList.remove('active');
}
function approveCourse(courseName) { showToast(courseName + ' has been approved!'); }
function rejectCourse(courseName) { showToast(courseName + ' has been rejected.'); }
function viewCourseDetails(courseName) { showToast('Viewing details for ' + courseName); }

const _collabModal = document.getElementById('collaboratorCoursesModal');
if (_collabModal) _collabModal.addEventListener('click', function(e) {
    if (e.target === this) closeCollaboratorCoursesModal();
});

// ===== OPPORTUNITY MODAL =====
function openOpportunityModal() {
    const modal = document.getElementById('opportunityModal');
    if (modal) modal.classList.add('active');
}
function closeOpportunityModal() {
    const modal = document.getElementById('opportunityModal');
    if (modal) modal.classList.remove('active');
}
const _oppModal = document.getElementById('opportunityModal');
if (_oppModal) _oppModal.addEventListener('click', function(e) {
    if (e.target === this) closeOpportunityModal();
});

// small helper to avoid HTML injection
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Handle opportunity form submission
const _oppForm = document.getElementById('opportunityForm');
if (_oppForm) _oppForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('oppName').value.trim();
    const duration = document.getElementById('oppDuration').value.trim();
    const startDate = document.getElementById('oppStartDate').value;
    const description = document.getElementById('oppDescription').value.trim();
    const skillsRaw = document.getElementById('oppSkills').value.trim();
    const category = document.getElementById('oppCategory').value;
    const futureOpportunities = document.getElementById('oppFuture').value.trim();
    const maxApplicants = document.getElementById('oppMaxApplicants').value.trim();

    if (!name || !duration || !startDate || !description || !skillsRaw || !category || !futureOpportunities) {
        showToast('Please fill all required fields');
        return;
    }

    const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

    // Save to backend
    fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name, duration, start_date: startDate, description,
            skills: skillsRaw, category,
            future_opportunities: futureOpportunities,
            max_applicants: maxApplicants ? parseInt(maxApplicants) : null
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) { showToast('Error: ' + data.error); return; }
        // Build card
        const card = document.createElement('div');
        card.className = 'opportunity-card';
        const applicantsCount = maxApplicants ? `${parseInt(maxApplicants,10)} applicants` : '0 applicants';
        card.innerHTML = `
            <div class="opportunity-card-header">
                <h5>${escapeHtml(name)}</h5>
                <div class="opportunity-meta">
                    <span>${escapeHtml(duration)}</span>
                    <span>${escapeHtml(startDate)}</span>
                </div>
            </div>
            <p class="opportunity-description">${escapeHtml(description)}</p>
            <div class="opportunity-skills"><div class="opportunity-skills-label">Skills You'll Gain</div>
                <div class="skills-tags">${skills.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')}</div>
            </div>
            <div class="opportunity-footer">
                <span class="applicants-count">${escapeHtml(applicantsCount)}</span>
                <button class="view-course-btn" style="width:auto;padding:8px 16px;">View Details</button>
                <button onclick="deleteOpportunity(${data.data.id}, this)" style="background:#c0392b;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;margin-left:8px;">Delete</button>
            </div>
        `;
        const viewBtn = card.querySelector('.view-course-btn');
        if (viewBtn) viewBtn.addEventListener('click', function() {
            openOpportunityDetails(name, { duration, startDate, description, skills,
                applicants: maxApplicants ? parseInt(maxApplicants,10) : 0,
                futureOpportunities, prerequisites: '' });
        });
        const grid = document.querySelector('.opportunities-grid');
        if (grid) grid.appendChild(card);
        showToast('Opportunity created successfully!');
        closeOpportunityModal();
        this.reset();
    })
    .catch(() => showToast('Could not save to server.'));
});

// ===== QUICK ADD STUDENT MODAL =====
function openQuickAddModal() { const m = document.getElementById('quickAddModal'); if (m) m.classList.add('active'); }
function closeQuickAddModal() { const m = document.getElementById('quickAddModal'); if (m) m.classList.remove('active'); }
const _quickAddModal = document.getElementById('quickAddModal');
if (_quickAddModal) _quickAddModal.addEventListener('click', function(e) { if (e.target === this) closeQuickAddModal(); });
const _quickAddForm = document.getElementById('quickAddForm');
if (_quickAddForm) _quickAddForm.addEventListener('submit', function(e) {
    e.preventDefault();
    showToast('Student added successfully! Email invitation sent.');
    closeQuickAddModal(); this.reset();
});

// ===== BULK UPLOAD MODAL =====
function openBulkUploadModal() { const m = document.getElementById('bulkUploadModal'); if (m) m.classList.add('active'); }
function closeBulkUploadModal() { const m = document.getElementById('bulkUploadModal'); if (m) m.classList.remove('active'); }
const _bulkModal = document.getElementById('bulkUploadModal');
if (_bulkModal) _bulkModal.addEventListener('click', function(e) { if (e.target === this) closeBulkUploadModal(); });
const _bulkForm = document.getElementById('bulkUploadForm');
if (_bulkForm) _bulkForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('csvFileInput');
    if (!fileInput || fileInput.files.length === 0) { showToast('Please select a CSV file'); return; }
    showToast('Students uploaded successfully! Email invitations sent.');
    closeBulkUploadModal(); this.reset();
    const fn = document.getElementById('fileName'); if (fn) fn.textContent = '';
});

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) { const fn = document.getElementById('fileName'); if (fn) fn.textContent = '✓ Selected: ' + file.name; }
}
function downloadSampleCSV() {
    const csvContent = 'First Name,Last Name,Email\nJohn,Doe,john.doe@example.com\nJane,Smith,jane.smith@example.com';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'sample_students.csv'; a.click();
    window.URL.revokeObjectURL(url);
}

// ===== QUICK ADD VERIFIER MODAL =====
function openQuickAddVerifierModal() { const m = document.getElementById('quickAddVerifierModal'); if (m) m.classList.add('active'); }
function closeQuickAddVerifierModal() { const m = document.getElementById('quickAddVerifierModal'); if (m) m.classList.remove('active'); }
const _qaVerifierModal = document.getElementById('quickAddVerifierModal');
if (_qaVerifierModal) _qaVerifierModal.addEventListener('click', function(e) { if (e.target === this) closeQuickAddVerifierModal(); });
const _qaVerifierForm = document.getElementById('quickAddVerifierForm');
if (_qaVerifierForm) _qaVerifierForm.addEventListener('submit', function(e) {
    e.preventDefault();
    showToast('Verifier added successfully! Email invitation sent.');
    closeQuickAddVerifierModal(); this.reset();
});

// ===== BULK UPLOAD VERIFIER MODAL =====
function openBulkUploadVerifierModal() { const m = document.getElementById('bulkUploadVerifierModal'); if (m) m.classList.add('active'); }
function closeBulkUploadVerifierModal() { const m = document.getElementById('bulkUploadVerifierModal'); if (m) m.classList.remove('active'); }
const _bulkVerifierModal = document.getElementById('bulkUploadVerifierModal');
if (_bulkVerifierModal) _bulkVerifierModal.addEventListener('click', function(e) { if (e.target === this) closeBulkUploadVerifierModal(); });
const _bulkVerifierForm = document.getElementById('bulkUploadVerifierForm');
if (_bulkVerifierForm) _bulkVerifierForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('csvVerifierFileInput');
    if (!fileInput || fileInput.files.length === 0) { showToast('Please select a CSV file'); return; }
    showToast('Verifiers uploaded successfully! Email invitations sent.');
    closeBulkUploadVerifierModal(); this.reset();
    const vfn = document.getElementById('verifierFileName'); if (vfn) vfn.textContent = '';
});

function handleVerifierFileSelect(event) {
    const file = event.target.files[0];
    if (file) { const vfn = document.getElementById('verifierFileName'); if (vfn) vfn.textContent = '✓ Selected: ' + file.name; }
}
function downloadSampleVerifierCSV() {
    const csvContent = 'First Name,Last Name,Email,Subject\nDr. John,Doe,john.doe@qf.edu.qa,Mathematics\nProf. Jane,Smith,jane.smith@qf.edu.qa,Physics';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'sample_verifiers.csv'; a.click();
    window.URL.revokeObjectURL(url);
}

// ===== VERIFIER DETAILS MODAL =====
function openVerifierDetails(name, stats) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('verifierName', name);
    set('verifierTotalStudents', stats.totalStudents);
    set('verifierCertified', stats.certified);
    set('verifierInProgress', stats.inProgress);
    const container = document.getElementById('subjectsContainer');
    if (container) {
        container.innerHTML = '';
        stats.subjects.forEach(subject => {
            const div = document.createElement('div');
            div.className = 'subject-item';
            div.innerHTML = `<span class="subject-name">${subject.name}</span><span class="subject-students">${subject.students} students</span>`;
            container.appendChild(div);
        });
    }
    const modal = document.getElementById('verifierDetailsModal');
    if (modal) modal.classList.add('active');
}
function closeVerifierDetailsModal() {
    const modal = document.getElementById('verifierDetailsModal');
    if (modal) modal.classList.remove('active');
}
const _verifierDetailsModal = document.getElementById('verifierDetailsModal');
if (_verifierDetailsModal) _verifierDetailsModal.addEventListener('click', function(e) {
    if (e.target === this) closeVerifierDetailsModal();
});

// ===== STUDENT FILTERS =====
function filterStudents() {
    const statusFilter = document.getElementById('statusFilter');
    if (!statusFilter) return;
    const val = statusFilter.value;
    document.querySelectorAll('#studentsTableBody tr').forEach(row => {
        row.style.display = (val === 'all' || row.getAttribute('data-status') === val) ? '' : 'none';
    });
}

// ===== VERIFIER FILTERS =====
function filterVerifiers() {
    const statusFilter = document.getElementById('verifierStatusFilter');
    if (!statusFilter) return;
    const val = statusFilter.value;
    document.querySelectorAll('#verifiersTableBody tr').forEach(row => {
        row.style.display = (val === 'all' || row.getAttribute('data-status') === val) ? '' : 'none';
    });
}

// ===== LOGIN =====
const _loginForm = document.getElementById('loginForm');
if (_loginForm) _loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    clearAllErrors('loginForm');
    let valid = true;
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const captchaInput = document.getElementById('loginCaptchaInput').value.trim();

    if (!email || !isValidEmail(email)) { showError('loginEmailErr'); document.getElementById('loginEmail').classList.add('error'); valid = false; }
    if (!password) { showError('loginPasswordErr','Please enter your password'); document.getElementById('loginPassword').classList.add('error'); valid = false; }
    if (!captchaInput) { showError('loginCaptchaErr','Please enter the captcha code'); valid = false; }
    else if (captchaInput !== captchas.login) { showError('loginCaptchaErr','Captcha does not match. Please try again.'); valid = false; generateCaptcha('login'); }
    if (!valid) { shakeForm('loginForm'); return; }

    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, remember: document.getElementById('loginRemember')?.checked || false })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            showError('loginPasswordErr', data.error);
            shakeForm('loginForm');
            generateCaptcha('login');
        } else {
            showToast('Login successful! Redirecting...');
            setTimeout(() => { showDashboard(email); loadOpportunities(); }, 1200);
            generateCaptcha('login');
        }
    })
    .catch(() => showToast('Server error. Please try again.'));
});

// ===== SIGNUP =====
const _signupForm = document.getElementById('signupForm');
if (_signupForm) _signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    clearAllErrors('signupForm');
    let valid = true;
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const confirmPassword = document.getElementById('signupConfirmPassword').value.trim();
    const captchaInput = document.getElementById('signupCaptchaInput').value.trim();

    if (!name) { showError('signupNameErr'); document.getElementById('signupName').classList.add('error'); valid = false; }
    if (!email || !isValidEmail(email)) { showError('signupEmailErr'); document.getElementById('signupEmail').classList.add('error'); valid = false; }
    if (!password || password.length < 8) { showError('signupPasswordErr'); document.getElementById('signupPassword').classList.add('error'); valid = false; }
    if (!confirmPassword || password !== confirmPassword) { showError('signupConfirmPasswordErr'); document.getElementById('signupConfirmPassword').classList.add('error'); valid = false; }
    if (!captchaInput) { showError('signupCaptchaErr','Please enter the captcha code'); valid = false; }
    else if (captchaInput !== captchas.signup) { showError('signupCaptchaErr','Captcha does not match.'); valid = false; generateCaptcha('signup'); }
    if (!valid) { shakeForm('signupForm'); return; }

    fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: name, email, password, confirm_password: confirmPassword })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            showError('signupEmailErr', data.error);
            shakeForm('signupForm');
            generateCaptcha('signup');
        } else {
            showToast('Account created successfully!');
            generateCaptcha('signup');
            document.getElementById('signupForm').reset();
            checkStrength('');
            setTimeout(() => showPage('loginPage'), 1500);
        }
    })
    .catch(() => showToast('Server error. Please try again.'));
});

// ===== FORGOT =====
const _forgotForm = document.getElementById('forgotForm');
if (_forgotForm) _forgotForm.addEventListener('submit', function(e) {
    e.preventDefault();
    clearAllErrors('forgotForm');
    let valid = true;
    const email = document.getElementById('forgotEmail').value.trim();
    const captchaInput = document.getElementById('forgotCaptchaInput').value.trim();

    if (!email || !isValidEmail(email)) { showError('forgotEmailErr'); document.getElementById('forgotEmail').classList.add('error'); valid = false; }
    if (!captchaInput) { showError('forgotCaptchaErr','Please enter the captcha code'); valid = false; }
    else if (captchaInput !== captchas.forgot) { showError('forgotCaptchaErr','Captcha does not match.'); valid = false; generateCaptcha('forgot'); }
    if (!valid) { shakeForm('forgotForm'); return; }

    fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    })
    .then(res => res.json())
    .then(() => {
        showToast('Reset link sent to your email!');
        generateCaptcha('forgot');
        document.getElementById('forgotForm').reset();
    })
    .catch(() => showToast('Server error. Please try again.'));
});

// Clear errors on input
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        this.classList.remove('error');
        const err = this.closest('.form-group')?.querySelector('.error-msg');
        if (err) err.classList.remove('show');
    });
});

// Responsive sidebar
window.addEventListener('resize', () => {
    const toggle = document.getElementById('menuToggle');
    if (toggle) toggle.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
});

// ===== LOAD OPPORTUNITIES FROM DB =====
function loadOpportunities() {
    fetch('/api/opportunities')
    .then(res => res.json())
    .then(data => {
        if (!data.data) return;
        const grid = document.querySelector('.opportunities-grid');
        if (!grid) return;
        grid.innerHTML = '';
        data.data.forEach(opp => {
            const skills = opp.skills ? opp.skills.split(',').map(s => s.trim()) : [];
            const card = document.createElement('div');
            card.className = 'opportunity-card';
            card.innerHTML = `
                <div class="opportunity-card-header">
                    <h5>${escapeHtml(opp.name)}</h5>
                    <div class="opportunity-meta">
                        <span>${escapeHtml(opp.duration || '')}</span>
                        <span>${escapeHtml(opp.start_date || '')}</span>
                    </div>
                </div>
                <p class="opportunity-description">${escapeHtml(opp.description || '')}</p>
                <div class="opportunity-skills"><div class="skills-tags">
                    ${skills.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')}
                </div></div>
                <div class="opportunity-footer">
                    <span class="applicants-count">${opp.max_applicants || 0} applicants</span>
                    <button class="view-course-btn" style="width:auto;padding:8px 16px;">View Details</button>
                    <button onclick="deleteOpportunity(${opp.id}, this)" style="background:#c0392b;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;margin-left:8px;">Delete</button>
                </div>
            `;
            grid.appendChild(card);
        });
    })
    .catch(() => console.log('Could not load opportunities'));
}

function deleteOpportunity(id, btn) {
    fetch('/api/opportunities/' + id, { method: 'DELETE' })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            btn.closest('.opportunity-card').remove();
            showToast('Opportunity deleted.');
        }
    });
}
// ===== AUTO LOGIN CHECK ON PAGE LOAD =====
fetch('/api/check-auth')
.then(res => res.json())
.then(data => {
    if (data.authenticated) {
        const dashboard = document.getElementById('dashboardWrapper');
        // Only show dashboard if it's not already active
        if (dashboard && !dashboard.classList.contains('active')) {
            showDashboard(data.email);
            loadOpportunities();
        }
    }
})
.catch(() => console.log('Auth check failed'));

