// DOM elements
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const addNoteBtn = document.getElementById("addNote");
const notesList = document.getElementById("notesList");
const openAuthModalBtn = document.getElementById("openAuthModal");
const logoutBtn = document.getElementById("logoutBtn");

const authModal = document.getElementById("authModal");
const closeModal = document.querySelector(".close");
const modalTitle = document.getElementById("modalTitle");
const authForm = document.getElementById("authForm");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const toggleLink = document.getElementById("toggleLink");

let isLogin = true; // toggle state

// --- Open modal ---
openAuthModalBtn.addEventListener("click", () => authModal.style.display = "block");
closeModal.addEventListener("click", () => authModal.style.display = "none");
window.addEventListener("click", e => { if(e.target == authModal) authModal.style.display = "none"; });

// --- Toggle login/signup ---
toggleLink.addEventListener("click", e => {
  e.preventDefault();
  isLogin = !isLogin;
  if(isLogin){
    modalTitle.textContent = "Login";
    authSubmitBtn.textContent = "Login";
    toggleLink.textContent = "Sign Up";
  } else {
    modalTitle.textContent = "Sign Up";
    authSubmitBtn.textContent = "Sign Up";
    toggleLink.textContent = "Login";
  }
});

// --- Auth submit ---
authForm.addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();

  try {
    if(isLogin){
      await auth.signInWithEmailAndPassword(email,password);
      alert("Logged in successfully!");
    } else {
      await auth.createUserWithEmailAndPassword(email,password);
      alert("Account created and logged in!");
    }
    authModal.style.display = "none";
    authForm.reset();
  } catch(err){
    alert(err.message);
  }
});

// --- Logout ---
logoutBtn.addEventListener("click", () => auth.signOut());

// --- Listen auth state ---
auth.onAuthStateChanged(user => {
  if(user){
    addNoteBtn.disabled = false;
    logoutBtn.style.display = "inline-block";
    openAuthModalBtn.style.display = "none";
    listenNotes(user.uid);
  } else {
    addNoteBtn.disabled = true;
    logoutBtn.style.display = "none";
    openAuthModalBtn.style.display = "inline-block";
    notesList.innerHTML = "<p>Please log in to see your notes.</p>";
  }
});

// --- Notes functionality ---
addNoteBtn.addEventListener("click", () => {
  const user = auth.currentUser;
  if(!user) return alert("Log in first!");

  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();
  if(!title || !content) return alert("Both fields required!");

  db.collection("notes").add({
    title,
    content,
    timestamp: Date.now(),
    userId: user.uid
  }).then(() => {
    noteTitle.value = "";
    noteContent.value = "";
  });
});

function listenNotes(uid){
  db.collection("notes")
    .where("userId","==",uid)
    .orderBy("timestamp","desc")
    .onSnapshot(snapshot=>{
      notesList.innerHTML = "";
      snapshot.forEach(doc=>{
        const note = doc.data();
        const div = document.createElement("div");
        div.className = "note-card";
        div.innerHTML = `
          <h3>${note.title}</h3>
          <p>${note.content}</p>
          <button onclick="deleteNote('${doc.id}')">Delete</button>
        `;
        notesList.appendChild(div);
      });
    });
}

function deleteNote(id){
  const user = auth.currentUser;
  if(!user) return alert("Log in first!");
  db.collection("notes").doc(id).delete();
}
