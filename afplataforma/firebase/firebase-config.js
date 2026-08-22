<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyC7Vb3v2KKnMTlaRENGLpZOqrzqFAD1zc4",
    authDomain: "akashahubaf.firebaseapp.com",
    projectId: "akashahubaf",
    storageBucket: "akashahubaf.firebasestorage.app",
    messagingSenderId: "825764077352",
    appId: "1:825764077352:web:406555563a380829b2fa1d",
    measurementId: "G-LWBLGM2545"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
