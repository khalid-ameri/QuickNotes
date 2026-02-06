const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const addNoteBtn = document.getElementById("addNote");
const notesList = document.getElementById("notesList");

// Add note
addNoteBtn.addEventListener("click", () => {
  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();
  if (!title || !content) return alert("Both fields required!");

  db.collection("notes").add({ title, content, timestamp: Date.now() })
    .then(() => {
      noteTitle.value = "";
      noteContent.value = "";
    });
});

// Real-time listener
db.collection("notes").orderBy("timestamp", "desc")
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

// Delete note
function deleteNote(id) {
  db.collection("notes").doc(id).delete();
}
