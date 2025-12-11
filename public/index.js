const socket = io();

const container = document.body;
const cursors = {};
const myId = null;

socket.on("your_id", (id) => {
  myId = id;
});

socket.on("current_users", (users) => {
  Object.keys(users).forEach((id) => {
    if (id !== myId) {
      createCursor(id, users[id].color);
    }
  });
});

socket.on("user_connected", (data) => {
  createCursor(data.id, data.color);
});

socket.on("user_moved", (data) => {
  const cursorEl = cursors[data.id];
  if (cursorEl) {
    cursorEl.style.transform = `translate(${data.x}px, ${data.y}px)`;
  }
});

socket.on("user_disconnected", (id) => {
  if (cursors[id]) {
    cursors[id].remove();
    delete cursors[id];
  }
});

document.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY;

  socket.emit("mouse_move", { x, y });
});

const createCursor = (id, color) => {
  if (cursors[id]) return;

  const cursorDiv = document.createElement("div");
  cursorDiv.className = "cursor";

  const iconDiv = document.createElement("div");
  iconDiv.className = "cursor-icon";
  iconDiv.style.borderBottomColor = color;

  const labelDiv = document.createElement("div");
  labelDiv.className = "cursor-label";
  labelDiv.innerText = "User";
  labelDiv.style.backgroundColor = color;

  cursorDiv.appendChild(iconDiv);
  cursorDiv.appendChild(labelDiv);

  document.body.appendChild(cursorDiv);
  cursors[id] = cursorDiv;
};
