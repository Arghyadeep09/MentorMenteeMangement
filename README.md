<!DOCTYPE html> 
<html lang="en"> 
<head> 
<meta charset="UTF-8"> 
<meta name="viewport" content="width=device-width, initial-scale=1.0"> 

</head> 
<body> 
<h1>Mentor Mentee Scheduling App</h1> 
<p>This application facilitates scheduling between mentors and mentees, allowing mentors 
to set their availability and mentees to book slots accordingly. It is built using the MERN 
stack (MongoDB, Express.js, React.js, Node.js) and integrates with Firebase for 
authentication.</p> 
<h2>
 🚀
 Setup and Run Locally</h2> 
<h3>1. Clone the Repository</h3> 
<pre> 
<code> 
git clone https://github.com/your-username/mentor-mentee-scheduling-app.git 
cd mentor-mentee-scheduling-app 
</code> 
</pre> 
<h2>
 📌
 Backend Setup</h2> 
<h3>Step 1: Navigate to the Backend Folder</h3> 
<pre> 
<code>cd Backend</code> 
</pre> 
<h3>Step 2: Install Dependencies</h3> 
<pre> 
<code>npm install</code> 
</pre> 
<h3>Step 3: Configure Environment Variables</h3> 
<p>Create a <code>.env</code> file in the <code>backend</code> directory and add:</p> 
<pre> 
<code> 
PORT=5000 
MONGODB_URI=your_mongodb_connection_string 
FIREBASE_ADMIN_SDK_JSON=path_to_your_firebase_admin_sdk_json_file 
</code> 
</pre> 
<h3>Step 4: Start the Backend Server</h3> 
<pre> 
<code>npm start</code> 
</pre> 
<p>The backend server will run on <strong>https://mentormenteemangement.onrender.com/</strong></p> 
<h2>
 🎨
 Frontend Setup</h2> 
<h3>Step 1: Navigate to the Frontend Folder</h3> 
<pre> 
<code>cd ../Frontend</code> 
</pre> 
<h3>Step 2: Install Dependencies</h3> 
<pre> 
<code>npm install</code> 
</pre> 
<h3>Step 3: Configure Environment Variables</h3> 
<p>Create a <code>.env</code> file in the <code>Frontend</code> directory and add:</p> 
<pre> 
<code> 
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key 
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain 
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id 
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket 
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_i
 d 
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id 
</code> 
</pre> 
<h3>Step 4: Start the Frontend Application</h3> 
<pre> 
<code>npm start</code> 
</pre> 
<p>The frontend will run on <strong>https://mentormenteemangement-1.onrender.com</strong></p> 
<h2>
 🔗
 Access the Application</h2> 
<p>Open your browser and go to <strong><a 
href="https://mentormenteemangement-1.onrender.com">https://mentormenteemangement-1.onrender.com</a></strong></p> 
<ul> 
<li>Sign up or log in using Firebase Authentication.</li> 
<li>Use the dashboard to manage mentor slots and bookings.</li> 
</ul> 
<h2>
 ✨
 Features</h2> 
<ul> 
    <li>
 🔐
 Secure Authentication via Firebase.</li> 
    <li>
 󰞹
 Mentors can create and manage available time slots.</li> 
    <li>
 📅
 Mentees can view and book available mentor slots.</li> 
    <li>
 🔄
 Real-time slot availability updates.</li> 
    <li>
 📧
 Email notifications for booking confirmations.</li> 
    <li>
 📊
 Mentor dashboard to track bookings and schedules.</li> 
</ul> 
 
<h2>
 🛠
 Usage</h2> 
 
<h3>For Mentors:</h3> 
<ul> 
    <li>Sign up as a mentor and log in.</li> 
    <li>Navigate to the <strong>Dashboard</strong>.</li> 
    <li>Create available slots by selecting a date and time.</li> 
    <li>Manage and update your availability.</li> 
</ul> 
 
<h3>For Mentees:</h3> 
<ul> 
    <li>Sign up as a mentee and log in.</li> 
    <li>Browse the list of available mentor slots.</li> 
    <li>Select a preferred slot and book it.</li> 
    <li>Receive a confirmation email.</li> 
</ul> 
  <h2>
 ✨
 Prerequisites</h2>  
  <p>Before you begin, ensure you have the following installed:</p> 
<ul> 
    <li>
 🔐
 Node.js (v14 or later)</li> 
    <li>
 󰞹
 npm (v6 or later)</li> 
    <li>
 📅
 MongoDB (Ensure it's running on your local machine or provide a connection 
string)</li> 
  
    
 📧
 Firebase Project (for authentication)</li> 
</ul> 
 
<h2>
 ⚠
 Troubleshooting</h2> 
<ul> 
    <li>Ensure MongoDB is running and <code>MONGODB_URI</code> is correctly set.</li> 
    <li>Verify Firebase credentials in <code>.env</code>.</li> 
    <li>If ports 5000 or 3000 are in use, update them in <code>.env</code> or 
<code>package.json</code>.</li> 
</ul> 
 
 
</body> 
</html> 
 
