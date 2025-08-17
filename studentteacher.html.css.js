<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student-Teacher Appointment Booking</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f7fafc;
        }
        .page {
            display: none;
        }
        .page.active {
            display: block;
        }
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.5);
            justify-content: center;
            align-items: center;
        }
        .modal.flex {
            display: flex;
        }
    </style>
</head>
<body class="bg-gray-100">

    <div id="app" class="max-w-6xl mx-auto p-4">

        <!-- Header -->
        <header class="bg-white shadow rounded-lg p-4 mb-6 flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-800">Appointment System</h1>
            <div id="user-info" class="hidden items-center">
                <span id="user-email" class="mr-4 text-gray-600"></span>
                <button id="logout-btn" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300">Logout</button>
            </div>
        </header>

        <!-- Loading Spinner -->
        <div id="loader" class="hidden text-center p-8">
            <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p class="mt-4 text-gray-600">Loading...</p>
        </div>

        <!-- Login/Register Page -->
        <div id="auth-page" class="page active bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
            <h2 id="auth-title" class="text-2xl font-bold text-center mb-6">Login</h2>
            <form id="auth-form">
                <div class="mb-4">
                    <label for="email" class="block text-gray-700">Email</label>
                    <input type="email" id="email" class="w-full px-3 py-2 border rounded-lg" required>
                </div>
                <div class="mb-4">
                    <label for="password" class="block text-gray-700">Password</label>
                    <input type="password" id="password" class="w-full px-3 py-2 border rounded-lg" required>
                </div>
                <div id="name-field" class="mb-4 hidden">
                    <label for="name" class="block text-gray-700">Full Name</label>
                    <input type="text" id="name" class="w-full px-3 py-2 border rounded-lg">
                </div>
                <button type="submit" id="auth-btn" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">Login</button>
            </form>
            <p class="text-center mt-4">
                <a href="#" id="auth-toggle" class="text-blue-500 hover:underline">Don't have an account? Register</a>
            </p>
        </div>

        <!-- Student Dashboard -->
        <div id="student-dashboard" class="page">
            <h2 class="text-3xl font-bold mb-6">Student Dashboard</h2>
            <div class="grid md:grid-cols-3 gap-6">
                <!-- Search and Teacher List -->
                <div class="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-xl font-semibold mb-4">Find a Teacher</h3>
                    <input type="text" id="search-teacher" placeholder="Search by name, subject, or department..." class="w-full px-4 py-2 border rounded-lg mb-4">
<div id="teacher-list" class="space-y-4 max-h-96 overflow-y-auto"></div>
                </div>
                <!-- My Appointments -->
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-xl font-semibold mb-4">My Appointments</h3>
                    <div id="student-appointments" class="space-y-3"></div>
                </div>
            </div>
        </div>

        <!-- Teacher Dashboard -->
        <div id="teacher-dashboard" class="page">
            <h2 class="text-3xl font-bold mb-6">Teacher Dashboard</h2>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-4">Your Appointments</h3>
                <div id="teacher-appointments" class="space-y-4"></div>
            </div>
        </div>

        <!-- Admin Dashboard -->
        <div id="admin-dashboard" class="page">
            <h2 class="text-3xl font-bold mb-6">Admin Dashboard</h2>
            <div class="grid md:grid-cols-2 gap-6">
                <!-- Manage Teachers -->
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-xl font-semibold mb-4">Manage Teachers</h3>
                    <button id="add-teacher-btn" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4">Add Teacher</button>
                    <div id="admin-teacher-list" class="space-y-3"></div>
                </div>
                <!-- Manage Students -->
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-xl font-semibold mb-4">Manage Students</h3>
                    <div id="admin-student-list" class="space-y-3"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modals -->
    <div id="booking-modal" class="modal"></div>
    <div id="message-modal" class="modal"></div>
    <div id="teacher-modal" class="modal"></div>

    <!-- Firebase SDKs -->
    <script type="module">
        // IMPORTANT: Replace with your own Firebase project configuration
        const firebaseConfig = {
            apiKey: "YOUR_API_KEY",
            authDomain: "YOUR_AUTH_DOMAIN",
            projectId: "YOUR_PROJECT_ID",
            storageBucket: "YOUR_STORAGE_BUCKET",
            messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
            appId: "YOUR_APP_ID"
        };

        // Import Firebase modules
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
        import { 
            getAuth, 
            createUserWithEmailAndPassword, 
            signInWithEmailAndPassword, 
            onAuthStateChanged, 
            signOut 
        } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
        import { 
            getFirestore, 
            collection, 
            addDoc, 
            getDocs, 
            doc, 
            setDoc, 
            getDoc,
            query,
            where,
            updateDoc,
            deleteDoc,
            onSnapshot
        } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        
        console.log("Firebase initialized and services loaded.");

        // --- DOM Elements ---
        const pages = document.querySelectorAll('.page');
        const loader = document.getElementById('loader');
        const userInfo = document.getElementById('user-info');
        const userEmailDisplay = document.getElementById('user-email');

        // --- App State ---
        let currentUser = null;
        let currentUserRole = null;
        const ADMIN_EMAIL = "admin@example.com"; // Define your admin email here
// --- Routing ---
        function showPage(pageId) {
            console.log(Navigating to page: ${pageId});
            loader.classList.add('hidden');
            pages.forEach(page => {
                page.classList.toggle('active', page.id === pageId);
            });
        }

        // --- Auth State Change Listener ---
        onAuthStateChanged(auth, async (user) => {
            loader.classList.remove('hidden');
            if (user) {
                currentUser = user;
                console.log("User is signed in:", user.uid);
                
                // Fetch user role
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                
                if (userDoc.exists()) {
                    currentUserRole = userDoc.data().role;
                    console.log("User role:", currentUserRole);
                    userEmailDisplay.textContent = user.email;
                    userInfo.classList.remove('hidden');
                    
                    if (user.email === ADMIN_EMAIL) {
                        currentUserRole = 'admin';
                        showPage('admin-dashboard');
                        loadAdminData();
                    } else if (currentUserRole === 'teacher') {
                        showPage('teacher-dashboard');
                        loadTeacherAppointments(user.uid);
                    } else {
                        showPage('student-dashboard');
                        loadStudentData(user.uid);
                    }
                } else {
                    // Handle case where user exists in Auth but not Firestore
                    console.log("User document not found in Firestore. Logging out.");
                    await signOut(auth);
                }
            } else {
                currentUser = null;
                currentUserRole = null;
                console.log("User is signed out.");
                userInfo.classList.add('hidden');
                showPage('auth-page');
            }
        });

        // --- Student Dashboard Logic ---
        async function loadStudentData(studentId) {
            // Load teachers
            const teachersCol = collection(db, "users");
            const q = query(teachersCol, where("role", "==", "teacher"));
            const teacherSnapshot = await getDocs(q);
            const teacherList = document.getElementById('teacher-list');
            teacherList.innerHTML = '';
            teacherSnapshot.forEach(doc => {
                const teacher = doc.data();
                const teacherDiv = document.createElement('div');
                teacherDiv.className = 'p-4 border rounded-lg flex justify-between items-center';
                teacherDiv.innerHTML = 
                    <div>
                        <p class="font-bold">${teacher.name}</p>
                        <p class="text-sm text-gray-600">${teacher.subject} - ${teacher.department}</p>
                    </div>
                    <button data-id="${doc.id}" data-name="${teacher.name}" class="book-btn bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Book</button>
                ;
                teacherList.appendChild(teacherDiv);
            });

            // Load student's appointments
            const appointmentsCol = collection(db, "appointments");
            const studentAppointmentsQuery = query(appointmentsCol, where("studentId", "==", studentId));
            onSnapshot(studentAppointmentsQuery, (snapshot) => {
                const studentAppointmentsDiv = document.getElementById('student-appointments');
                studentAppointmentsDiv.innerHTML = '';
                if(snapshot.empty) {
                    studentAppointmentsDiv.innerHTML = '<p class="text-gray-500">No appointments yet.</p>';
return;
                }
                snapshot.forEach(doc => {
                    const appt = doc.data();
                    const statusColor = appt.status === 'approved' ? 'text-green-600' : appt.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600';
                    const apptDiv = document.createElement('div');
                    apptDiv.className = 'p-3 border rounded-lg';
                    apptDiv.innerHTML = 
                        <p class="font-semibold">With: ${appt.teacherName}</p>
                        <p class="text-sm">${new Date(appt.date).toDateString()}</p>
                        <p class="text-sm font-bold ${statusColor}">${appt.status}</p>
                    ;
                    studentAppointmentsDiv.appendChild(apptDiv);
                });
            });
        }
        
        // --- Teacher Dashboard Logic ---
        function loadTeacherAppointments(teacherId) {
            const appointmentsCol = collection(db, "appointments");
            const q = query(appointmentsCol, where("teacherId", "==", teacherId));
            onSnapshot(q, (snapshot) => {
                const teacherAppointmentsDiv = document.getElementById('teacher-appointments');
                teacherAppointmentsDiv.innerHTML = '';
                if(snapshot.empty) {
                    teacherAppointmentsDiv.innerHTML = '<p class="text-gray-500">You have no appointments.</p>';
                    return;
                }
                snapshot.forEach(doc => {
                    const appt = doc.data();
                    const apptDiv = document.createElement('div');
                    apptDiv.className = 'p-4 border rounded-lg';
                    apptDiv.innerHTML = 
                        <p><span class="font-bold">Student:</span> ${appt.studentName}</p>
                        <p><span class="font-bold">Date:</span> ${new Date(appt.date).toLocaleString()}</p>
                        <p><span class="font-bold">Purpose:</span> ${appt.message}</p>
                        <p><span class="font-bold">Status:</span> ${appt.status}</p>
                        ${appt.status === 'pending' ? 
                        <div class="mt-2 space-x-2">
                            <button data-id="${doc.id}" class="approve-btn bg-green-500 text-white px-3 py-1 rounded">Approve</button>
                            <button data-id="${doc.id}" class="cancel-btn bg-red-500 text-white px-3 py-1 rounded">Cancel</button>
                        </div>
                         : ''}
                    ;
                    teacherAppointmentsDiv.appendChild(apptDiv);
                });
            });
        }
        
        // --- Admin Dashboard Logic ---
        async function loadAdminData() {
            // Load teachers for admin view
            const usersCol = collection(db, "users");
            const teachersQuery = query(usersCol, where("role", "==", "teacher"));
            onSnapshot(teachersQuery, (snapshot) => {
                const adminTeacherList = document.getElementById('admin-teacher-list');
                adminTeacherList.innerHTML = '';
                snapshot.forEach(doc => {
                    const teacher = doc.data();
                    const div = document.createElement('div');
                    div.className = 'p-3 border rounded flex justify-between items-center';
                    div.innerHTML = 
                        <span>${teacher.name} (${teacher.subject})</span>
                        <button data-id="${doc.id}" class="delete-teacher-btn text-red-500">Delete</button>
                    ;
                    adminTeacherList.appendChild(div);
                });
            });

            // Load students for admin view
            const studentsQuery = query(usersCol, where("role", "==", "student"));
onSnapshot(studentsQuery, (snapshot) => {
                const adminStudentList = document.getElementById('admin-student-list');
                adminStudentList.innerHTML = '';
                snapshot.forEach(doc => {
                    const student = doc.data();
                    const div = document.createElement('div');
                    div.className = 'p-3 border rounded';
                    div.innerHTML = <span>${student.name} (${student.email})</span>;
                    adminStudentList.appendChild(div);
                });
            });
        }

        // --- Event Listeners ---
        document.getElementById('auth-toggle').addEventListener('click', (e) => {
            e.preventDefault();
            const isLogin = e.target.textContent.includes('Login');
            document.getElementById('auth-title').textContent = isLogin ? 'Login' : 'Register';
            document.getElementById('auth-btn').textContent = isLogin ? 'Login' : 'Register';
            e.target.textContent = isLogin ? "Don't have an account? Register" : "Have an account? Login";
            document.getElementById('name-field').classList.toggle('hidden', isLogin);
        });

        document.getElementById('auth-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const name = document.getElementById('name').value;
            const isRegister = document.getElementById('auth-title').textContent === 'Register';

            try {
                if (isRegister) {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    await setDoc(doc(db, "users", userCredential.user.uid), {
                        name: name,
                        email: email,
                        role: 'student' // Default role
                    });
                    console.log("Student registered:", userCredential.user.uid);
                } else {
                    await signInWithEmailAndPassword(auth, email, password);
                    console.log("User logged in.");
                }
            } catch (error) {
                console.error("Authentication error:", error);
                alert(error.message);
            }
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            signOut(auth);
        });

        // Event delegation for dynamic content
        document.body.addEventListener('click', async (e) => {
            if (e.target.classList.contains('book-btn')) {
                // Handle booking
            }
            if (e.target.classList.contains('approve-btn')) {
                const appointmentId = e.target.dataset.id;
                await updateDoc(doc(db, "appointments", appointmentId), { status: 'approved' });
                console.log(Appointment ${appointmentId} approved.);
            }
            if (e.target.classList.contains('cancel-btn')) {
                const appointmentId = e.target.dataset.id;
                await updateDoc(doc(db, "appointments", appointmentId), { status: 'cancelled' });
                console.log(Appointment ${appointmentId} cancelled.);
            }
            if (e.target.id === 'add-teacher-btn') {
                // Handle adding a teacher
            }
            if (e.target.classList.contains('delete-teacher-btn')) {
                const teacherId = e.target.dataset.id;
                if(confirm('Are you sure you want to delete this teacher?')) {
                    await deleteDoc(doc(db, "users", teacherId));
                    console.log(Teacher ${teacherId} deleted.);
                }
            }
        });

    </script>
</body>
</html>