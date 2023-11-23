const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
let isDrawing = false;
let x = 0;
let y = 0;
let offsetX;
let offsetY;
const ongoingTouches = [];


function initiateCanvas() {

    canvas.addEventListener('touchstart', drawStart);
    canvas.addEventListener('touchend', drawEnd);
    canvas.addEventListener('touchcancel', drawCancel);
    canvas.addEventListener('touchmove', drawMove);
    canvas.addEventListener('mousedown', e => {
        console.log('click');
        x = e.offsetX;
        y = e.offsetY;
        isDrawing = true;
    });

    canvas.addEventListener('mousemove', e => {
        if(!isDrawing) return;
        
        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
        
    });

    canvas.addEventListener('mouseup', (e) => {
        if(!isDrawing) return;

        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
    });

}

function drawStart(evt) {
    evt.preventDefault();
    const touches = evt.changedTouches;
    offsetX = canvas.getBoundingClientRect().left;
    offsetY = canvas.getBoundingClientRect().top;
    for (let i = 0; i < touches.length; i++) {
        ongoingTouches.push(copyTouch(touches[i]));
    }
}

function drawMove(evt) {
    evt.preventDefault();
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        const color = document.getElementById('selColor').value;
        const idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0) {
            context.beginPath();
            context.moveTo(ongoingTouches[idx].clientX - offsetX, ongoingTouches[idx].clientY - offsetY);
            context.lineTo(touches[i].clientX - offsetX, touches[i].clientY - offsetY);
            context.lineWidth = document.getElementById('selWidth').value;
            context.strokeStyle = color;
            context.lineJoin = "round";
            context.closePath();
            context.stroke();
            ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
        }
    }
}

function drawEnd(evt) {
    evt.preventDefault();
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        const color = document.getElementById('selColor').value;
        let idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0) {
            context.lineWidth = document.getElementById('selWidth').value;
            context.fillStyle = color;
            ongoingTouches.splice(idx, 1);  // remove it; we're done
        }
    }
}

function drawCancel(evt) {
    evt.preventDefault();
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier);
        ongoingTouches.splice(idx, 1);  // remove it; we're done
    }
}

function copyTouch({ identifier, clientX, clientY }) {
    return { identifier, clientX, clientY };
}

function ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
        const id = ongoingTouches[i].identifier;
        if (id === idToFind) {
            return i;
        }
    }
    return -1;    // not found
}

function drawLine(context, x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = document.getElementById('selColor').value;
    context.lineWidth = document.getElementById('selWidth').value;
    context.lineJoin = "round";
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.stroke();
}

function clearCanvas() {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

// Resize the canvas
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
// Load drawing events
document.querySelector('#canvas-button-clear').addEventListener('click', evt => clearCanvas());
initiateCanvas();