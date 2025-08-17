<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Career Guidance - Unified Mentor</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f0f4f8;
        }
        .page {
            display: none;
        }
        .page.active {
            display: block;
        }
        /* Custom styles for progress bar and quiz */
        .progress-bar-container {
            width: 100%;
            background-color: #e0e0e0;
            border-radius: 9999px;
            overflow: hidden;
        }
        .progress-bar {
            height: 10px;
            background-color: #3b82f6;
            width: 0%;
            transition: width 0.3s ease-in-out;
        }
    </style>
</head>
<body class="text-gray-800">

    <div id="app" class="max-w-4xl mx-auto p-4 md:p-6">

        <!-- Header -->
        <header class="bg-white shadow-md rounded-xl p-4 mb-6 flex justify-between items-center sticky top-4 z-50">
            <div class="flex items-center space-x-3">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v11.494m-5.22-6.222h10.44m-10.44 0l-1.78-1.78a2.25 2.25 0 010-3.182l5.22-5.22a2.25 2.25 0 013.182 0l5.22 5.22a2.25 2.25 0 010 3.182l-1.78 1.78m-10.44 0z"></path></svg>
                <h1 class="text-xl md:text-2xl font-bold text-gray-800">Unified Mentor</h1>
            </div>
            <div id="user-info" class="hidden items-center">
                <span id="user-email" class="mr-4 text-sm text-gray-600 hidden md:block"></span>
                <button id="logout-btn" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-sm">Logout</button>
            </div>
        </header>

        <!-- Dynamic Page Content -->
        <main id="page-container">
            <!-- Login/Sign Up Page -->
            <div id="auth-page" class="page active"></div>

            <!-- Career Selection Page -->
            <div id="career-selection-page" class="page"></div>

            <!-- Location Selection Page -->
            <div id="location-selection-page" class="page"></div>

            <!-- College List Page -->
            <div id="college-list-page" class="page"></div>
            
            <!-- College Detail/Registration Page -->
            <div id="college-detail-page" class="page"></div>

            <!-- Aptitude Test Page -->
            <div id="aptitude-test-page" class="page"></div>

            <!-- Test Completion Page -->
            <div id="test-completion-page" class="page"></div>
            
            <!-- Admin Dashboard -->
            <div id="admin-dashboard-page" class="page"></div>
        </main>
    </div>

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
        import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
        import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        console.log("Firebase initialized.");

        // --- App State & Config ---
        let currentUser = null;
        let userSelections = {};
        const ADMIN_EMAIL = "admin@unifiedmentor.com"; // Admin email

        // --- Page Rendering Engine ---
        const pageContainer = document.getElementById('page-container');

        const renderPage = (pageId, props = {}) => {
            console.log(Rendering page: ${pageId});
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            const targetPage = document.getElementById(pageId);
            targetPage.innerHTML = window.templates[pageId](props);
            targetPage.classList.add('active');
            window.attachEventListeners(pageId);
        };
        
        // --- Templates (HTML for each page) ---
        window.templates = {
            'auth-page': ({ isLogin = true }) => 
                <div class="bg-white p-8 rounded-xl shadow-md max-w-md mx-auto animate-fade-in">
                    <h2 class="text-3xl font-bold text-center mb-6">${isLogin ? 'Student Login' : 'Student Sign Up'}</h2>
                    <form id="auth-form">
                        ${!isLogin ? 
                        <div class="mb-4">
                            <label for="name" class="block text-gray-700 font-medium">Full Name</label>
                            <input type="text" id="name" class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
                        </div> : ''}
                        <div class="mb-4">
                            <label for="email" class="block text-gray-700 font-medium">Email</label>
                            <input type="email" id="email" class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
                        </div>
                        <div class="mb-6">
                            <label for="password" class="block text-gray-700 font-medium">Password</label>
                            <input type="password" id="password" class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
                        </div>
                        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">${isLogin ? 'Login' : 'Sign Up'}</button>
                    </form>
                    <p class="text-center mt-4">
                        <a href="#" id="auth-toggle" class="text-blue-600 hover:underline">${isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}</a>
                    </p>
                </div>
            ,
            'career-selection-page': () => 
                <div class="bg-white p-8 rounded-xl shadow-md text-center">
                    <h2 class="text-3xl font-bold mb-6">Choose Your Career Path</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button data-career="Engineering" class="career-btn bg-gray-100 hover:bg-blue-100 p-6 rounded-lg transition">
                            <h3 class="text-xl font-semibold">Engineering</h3>
                        </button>
                        <button data-career="Management" class="career-btn bg-gray-100 hover:bg-blue-100 p-6 rounded-lg transition">
                            <h3 class="text-xl font-semibold">Management</h3>
                        </button>
                    </div>
                </div>
            ,
            'location-selection-page': () => `
                <div class="bg-white p-8 rounded-xl shadow-md text-center">
<h2 class="text-3xl font-bold mb-6">Select Location</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button data-location="India" class="location-btn bg-gray-100 hover:bg-green-100 p-6 rounded-lg transition">
                            <h3 class="text-xl font-semibold">India</h3>
                        </button>
                        <button data-location="Abroad" class="location-btn bg-gray-100 hover:bg-yellow-100 p-6 rounded-lg transition">
                            <h3 class="text-xl font-semibold">Abroad</h3>
                        </button>
                    </div>
                </div>
            ,
            'college-list-page': ({ colleges }) => 
                <div class="bg-white p-8 rounded-xl shadow-md">
                    <h2 class="text-3xl font-bold mb-6">Recommended Colleges</h2>
                    <div id="college-list-container" class="space-y-4">
                        ${colleges.length > 0 ? colleges.map(c => 
                            <div class="border p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <h3 class="font-bold text-lg">${c.name}</h3>
                                    <p class="text-sm text-gray-600">${c.location} | Rank: ${c.rank}</p>
                                </div>
                                <button data-college-id="${c.id}" class="select-college-btn bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">View Details</button>
                            </div>
                        ).join('') : '<p>No colleges found for your criteria.</p>'}
                    </div>
                </div>
            ,
            'college-detail-page': ({ college }) => 
                 <div class="bg-white p-8 rounded-xl shadow-md">
                    <h2 class="text-3xl font-bold mb-2">${college.name}</h2>
                    <p class="text-gray-600 mb-6">${college.location} | Rank: ${college.rank}</p>
                    <div class="space-y-4">
                        <p><strong>Fees:</strong> ${college.fees}</p>
                        <p><strong>Eligibility:</strong> ${college.eligibility}</p>
                        <p>${college.description}</p>
                    </div>
                    <div class="mt-8 text-center">
                        <h3 class="text-xl font-semibold mb-4">Next Step: Aptitude Test</h3>
                        <p class="mb-4">To proceed with the registration, you must complete a short aptitude test.</p>
                        <button id="start-test-btn" data-college-id="${college.id}" class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition">Start Test</button>
                    </div>
                </div>
            ,
            'aptitude-test-page': ({ questions }) => 
                <div class="bg-white p-8 rounded-xl shadow-md">
                    <h2 class="text-3xl font-bold mb-2">Aptitude Test</h2>
                    <div class="progress-bar-container my-4"><div id="progress-bar" class="progress-bar"></div></div>
                    <div id="quiz-container">
                        <!-- Questions will be injected here -->
                    </div>
                    <div class="flex justify-between mt-6">
                        <button id="prev-btn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg">Previous</button>
                        <button id="next-btn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Next</button>
                        <button id="submit-test-btn" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg hidden">Submit</button>
</div>
                </div>
            ,
            'test-completion-page': ({ score, total }) => 
                 <div class="bg-white p-8 rounded-xl shadow-md text-center">
                    <h2 class="text-3xl font-bold mb-4">Test Completed!</h2>
                    <p class="text-lg mb-6">Your Score:</p>
                    <p class="text-5xl font-bold text-blue-600 mb-8">${score} / ${total}</p>
                    <p>Your application and score have been submitted to the college.</p>
                    <button id="back-to-dash-btn" class="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg">Back to Dashboard</button>
                </div>
            ,
             'admin-dashboard-page': ({ colleges }) => 
                <div class="bg-white p-8 rounded-xl shadow-md">
                    <h2 class="text-3xl font-bold mb-6">Admin Dashboard - Manage Colleges</h2>
                    <form id="add-college-form" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 border-b pb-8">
                        <input type="text" id="college-name" placeholder="College Name" class="p-2 border rounded" required>
                        <input type="text" id="college-location" placeholder="Location (India/Abroad)" class="p-2 border rounded" required>
                        <input type="text" id="college-career" placeholder="Career (Engineering/Management)" class="p-2 border rounded" required>
                        <input type="number" id="college-rank" placeholder="Rank" class="p-2 border rounded" required>
                        <input type="text" id="college-fees" placeholder="Fees" class="p-2 border rounded" required>
                        <textarea id="college-eligibility" placeholder="Eligibility" class="p-2 border rounded md:col-span-2" required></textarea>
                        <textarea id="college-description" placeholder="Description" class="p-2 border rounded md:col-span-2" required></textarea>
                        <button type="submit" class="bg-green-500 text-white p-2 rounded md:col-span-2">Add College</button>
                    </form>
                    <div id="admin-college-list">
                        ${colleges.map(c => 
                            <div class="border p-3 rounded-lg flex justify-between items-center mb-2">
                                <span>${c.name}</span>
                                <button data-id="${c.id}" class="delete-college-btn text-red-500 hover:text-red-700">Delete</button>
                            </div>
                        ).join('')}
                    </div>
                </div>
            `,
        };

        // --- Event Listeners ---
        window.attachEventListeners = (pageId) => {
            if (pageId === 'auth-page') {
                document.getElementById('auth-toggle').addEventListener('click', (e) => {
                    e.preventDefault();
                    const isLogin = e.target.textContent.includes('Sign Up');
                    renderPage('auth-page', { isLogin });
                });
                document.getElementById('auth-form').addEventListener('submit', handleAuthFormSubmit);
            }
            if (pageId === 'career-selection-page') {
                document.querySelectorAll('.career-btn').forEach(btn => btn.addEventListener('click', handleCareerSelection));
            }
            if (pageId === 'location-selection-page') {
                document.querySelectorAll('.location-btn').forEach(btn => btn.addEventListener('click', handleLocationSelection));
            }
            if (pageId === 'college-list-page') {
                document.querySelectorAll('.select-college-btn').forEach(btn => btn.addEventListener('click', handleCollegeSelection));
            }
            if (pageId === 'college-detail-page') {
document.getElementById('start-test-btn').addEventListener('click', startAptitudeTest);
            }
            if (pageId === 'aptitude-test-page') {
                initializeQuiz();
            }
             if (pageId === 'test-completion-page') {
                document.getElementById('back-to-dash-btn').addEventListener('click', () => renderPage('career-selection-page'));
            }
            if (pageId === 'admin-dashboard-page') {
                document.getElementById('add-college-form').addEventListener('submit', handleAddCollege);
                document.querySelectorAll('.delete-college-btn').forEach(btn => btn.addEventListener('click', handleDeleteCollege));
            }
        };
        
        // --- Auth Logic ---
        onAuthStateChanged(auth, async (user) => {
            const userInfoDiv = document.getElementById('user-info');
            if (user) {
                currentUser = user;
                console.log("User logged in:", user.uid);
                document.getElementById('user-email').textContent = user.email;
                userInfoDiv.classList.remove('hidden');
                document.getElementById('logout-btn').addEventListener('click', () => signOut(auth));
                
                if (user.email === ADMIN_EMAIL) {
                    const colleges = await fetchColleges();
                    renderPage('admin-dashboard-page', { colleges });
                } else {
                    renderPage('career-selection-page');
                }
            } else {
                currentUser = null;
                userInfoDiv.classList.add('hidden');
                renderPage('auth-page');
            }
        });

        async function handleAuthFormSubmit(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const isRegister = !!document.getElementById('name');
            try {
                if (isRegister) {
                    const name = document.getElementById('name').value;
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    await setDoc(doc(db, "users", userCredential.user.uid), { name, email, role: 'student' });
                } else {
                    await signInWithEmailAndPassword(auth, email, password);
                }
            } catch (error) {
                console.error("Auth error:", error);
                alert(error.message);
            }
        }
        
        // --- Data Fetching ---
        async function fetchColleges(filters = {}) {
            try {
                let q = collection(db, "colleges");
                if (filters.career) q = query(q, where("career", "==", filters.career));
                if (filters.location) q = query(q, where("location", "==", filters.location));
                
                const snapshot = await getDocs(q);
                const colleges = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log("Fetched colleges:", colleges);
                return colleges;
            } catch (error) {
                console.error("Error fetching colleges:", error);
                return [];
            }
        }

        // --- App Flow Handlers ---
        function handleCareerSelection(e) {
            userSelections.career = e.currentTarget.dataset.career;
            console.log("Career selected:", userSelections.career);
            renderPage('location-selection-page');
        }

        async function handleLocationSelection(e) {
            userSelections.location = e.currentTarget.dataset.location;
            console.log("Location selected:", userSelections.location);
const colleges = await fetchColleges(userSelections);
            renderPage('college-list-page', { colleges });
        }
        
        async function handleCollegeSelection(e) {
            const collegeId = e.currentTarget.dataset.collegeId;
            console.log("College selected:", collegeId);
            const collegeDoc = await getDoc(doc(db, "colleges", collegeId));
            if (collegeDoc.exists()) {
                renderPage('college-detail-page', { college: { id: collegeDoc.id, ...collegeDoc.data() } });
            }
        }

        // --- Aptitude Test Logic ---
        const aptitudeQuestions = [
            { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "4" },
            { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars" },
            { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: "Paris" },
        ];
        let currentQuestionIndex = 0;
        let userAnswers = [];

        function startAptitudeTest() {
            currentQuestionIndex = 0;
            userAnswers = new Array(aptitudeQuestions.length).fill(null);
            renderPage('aptitude-test-page', { questions: aptitudeQuestions });
        }

        function initializeQuiz() {
            document.getElementById('next-btn').addEventListener('click', () => changeQuestion(1));
            document.getElementById('prev-btn').addEventListener('click', () => changeQuestion(-1));
            document.getElementById('submit-test-btn').addEventListener('click', submitTest);
            displayQuestion();
        }

        function displayQuestion() {
            const quizContainer = document.getElementById('quiz-container');
            const question = aptitudeQuestions[currentQuestionIndex];
            quizContainer.innerHTML = 
                <h3 class="text-xl font-semibold mb-4">${currentQuestionIndex + 1}. ${question.question}</h3>
                <div class="space-y-2">
                    ${question.options.map((opt, index) => 
                        <div>
                            <input type="radio" id="option${index}" name="option" value="${opt}" ${userAnswers[currentQuestionIndex] === opt ? 'checked' : ''}>
                            <label for="option${index}" class="ml-2">${opt}</label>
                        </div>
                    ).join('')}
                </div>
            ;
            document.querySelectorAll('input[name="option"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    userAnswers[currentQuestionIndex] = e.target.value;
                });
            });
            updateQuizControls();
        }
        
        function changeQuestion(direction) {
            currentQuestionIndex += direction;
            displayQuestion();
        }
        
        function updateQuizControls() {
            document.getElementById('prev-btn').disabled = currentQuestionIndex === 0;
            document.getElementById('next-btn').classList.toggle('hidden', currentQuestionIndex === aptitudeQuestions.length - 1);
            document.getElementById('submit-test-btn').classList.toggle('hidden', currentQuestionIndex !== aptitudeQuestions.length - 1);
            const progress = ((currentQuestionIndex + 1) / aptitudeQuestions.length) * 100;
            document.getElementById('progress-bar').style.width = ${progress}%;
        }

        function submitTest() {
            let score = 0;
            userAnswers.forEach((answer, index) => {
                if (answer === aptitudeQuestions[index].answer) {
                    score++;
                }
            });
            console.log("Test submitted. Score:", score);
renderPage('test-completion-page', { score, total: aptitudeQuestions.length });
        }
        
        // --- Admin Logic ---
        async function handleAddCollege(e) {
            e.preventDefault();
            const newCollege = {
                name: document.getElementById('college-name').value,
                location: document.getElementById('college-location').value,
                career: document.getElementById('college-career').value,
                rank: parseInt(document.getElementById('college-rank').value),
                fees: document.getElementById('college-fees').value,
                eligibility: document.getElementById('college-eligibility').value,
                description: document.getElementById('college-description').value,
            };
            try {
                await addDoc(collection(db, "colleges"), newCollege);
                console.log("College added successfully.");
                e.target.reset();
                const colleges = await fetchColleges(); // Refresh list
                renderPage('admin-dashboard-page', { colleges });
            } catch (error) {
                console.error("Error adding college:", error);
            }
        }

        async function handleDeleteCollege(e) {
            const collegeId = e.target.dataset.id;
            if (confirm("Are you sure you want to delete this college?")) {
                try {
                    await deleteDoc(doc(db, "colleges", collegeId));
                    console.log("College deleted.");
                    const colleges = await fetchColleges(); // Refresh list
                    renderPage('admin-dashboard-page', { colleges });
                } catch (error) {
                    console.error("Error deleting college:", error);
                }
            }
        }

    </script>
</body>
</html>
