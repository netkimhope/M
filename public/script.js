document.getElementById('agreeCheckbox').addEventListener('change', function() {
    document.getElementById('submitButton').disabled = !this.checked;
});

let Commands = [{
    'commands': []
}, {
    'handleEvent': []
}];

function measurePing() {
    var xhr = new XMLHttpRequest();
    var startTime, endTime;
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            endTime = Date.now();
            var pingTime = endTime - startTime;
            document.getElementById("ping").textContent = pingTime + " ms";
        }
    };
    xhr.open("GET", location.href + "?t=" + new Date().getTime());
    startTime = Date.now();
    xhr.send();
}
setInterval(measurePing, 1000);

function updateTime() {
    const now = new Date();
    const options = {
        timeZone: 'Asia/Manila',
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    const formattedTime = now.toLocaleString('en-US', options);
    document.getElementById('time').textContent = formattedTime;
}
updateTime();
setInterval(updateTime, 1000);

async function State() {
    const jsonInput = document.getElementById('json-data');
    const button = document.getElementById('submitButton');
    if (!Commands[0].commands.length) {
        return showResult('Please provide at least one valid command for execution.');
    }
    try {
        button.style.display = 'none';
        const State = JSON.parse(jsonInput.value);
        if (State && typeof State === 'object') {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    state: State,
                    commands: Commands,
                    prefix: document.getElementById('inputOfPrefix').value,
                    admin: document.getElementById('inputOfAdmin').value,
                }),
            });
            const data = await response.json();
            if (data.success) {
                jsonInput.value = '';
                showResult(data.message);
            } else {
                jsonInput.value = '';
                showResult(data.message);
            }
        } else {
            jsonInput.value = '';
            showResult('Invalid JSON data. Please check your input.');
        }
    } catch (parseError) {
        jsonInput.value = '';
        showResult('Invalid JSON data. Please check your input.');
    } finally {
        button.style.display = 'block';
    }
}

function showResult(message) {
    const result = document.getElementById('result');
    result.textContent = message;
    result.style.display = 'block';
}

function selectAllCommands() {
    const box = [{
		input: '.form-check-input.commands',
		array: Commands[0].commands
	}];
	box.forEach(({
		input,
		array
	}) => {
		const checkboxes = document.querySelectorAll(input);
		const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
		checkboxes.forEach((checkbox) => {
			if (allChecked) {
				checkbox.checked = false;
				const labelText = checkbox.nextElementSibling;
				labelText.classList.remove('disable');
				const command = labelText.textContent.replace(/^\d+\.\s/, '').split(" ")[0];
				const removeCommand = array.indexOf(command);
				if (removeCommand !== -1) {
					array.splice(removeCommand, 1);
				}
			} else {
				checkbox.checked = true;
				const labelText = checkbox.nextElementSibling;
				labelText.classList.add('disable');
				const command = labelText.textContent.replace(/^\d+\.\s/, '').split(" ")[0];
				if (!array.includes(command)) {
					array.push(command);
				}
			}
		});
	});
}
}

function selectAllEvents() {

    
const box = [{
		input: '.form-check-input.handleEvent',
		array: Commands[1].handleEvent
	}];
	box.forEach(({
		input,
		array
	}) => {
		const checkboxes = document.querySelectorAll(input);
		const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
		checkboxes.forEach((checkbox) => {
			if (allChecked) {
				checkbox.checked = false;
				const labelText = checkbox.nextElementSibling;
				labelText.classList.remove('disable');
				const event = labelText.textContent.replace(/^\d+\.\s/, '').split(" ")[0];
				const removeEvent = array.indexOf(event);
				if (removeEvent !== -1) {
					array.splice(removeEvent, 1);
				}
			} else {
				checkbox.checked = true;
				const labelText = checkbox.nextElementSibling;
				labelText.classList.add('disable');
				const event = labelText.textContent.replace(/^\d+\.\s/, '').split(" ")[0];
				if (!array.includes(event)) {
					array.push(event);
				}
			}
		});
	});
}

commandList();
