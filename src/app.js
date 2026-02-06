// DOM elements
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const addNoteBtn = document.getElementById("addNote");
const notesList = document.getElementById("notesList");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

// --- Auth --- //
loginBtn.addEventListener("click", () => {
  const email = prompt("Email:");
  const password = prompt("Password:");
  auth.signInWithEmailAndPassword(email, password)
    .catch(err => alert(err.message));
});

logoutBtn.addEventListener("click", () => auth.signOut());

// --- Listen for auth changes --- //
auth.onAuthStateChanged(user => {
  if (user) {
    addNoteBtn.disabled = false;
    listenNotes(user.uid);
  } else {
    notesList.innerHTML = "<p>Please log in to see your notes.</p>";
    addNoteBtn.disabled = true;
  }
});

// --- Add note --- //
addNoteBtn.addEventListener("click", () => {
  const user = auth.currentUser;
  if (!user) return alert("Log in first!");

  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();
  if (!title || !content) return alert("Both fields required!");

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

// --- Listen to notes in real-time --- //
function listenNotes(uid) {
  db.collection("notes")
    .where("userId", "==", uid)
    .orderBy("timestamp", "desc")
    .onSnapshot(snapshot => {
      notesList.innerHTML = "";
      snapshot.forEach(doc => {
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

// --- Delete note --- //
function deleteNote(id) {
  const user = auth.currentUser;
  if (!user) return alert("Log in first!");
  db.collection("notes").doc(id).delete();
}
