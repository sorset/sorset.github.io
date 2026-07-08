"use strict";

; (function (window, document, undefined) {


	const testStatus = Object.freeze({
		Deferred: 'Deferred',
		Fixed: 'Fixed',
		Duplicate: 'Duplicate',
		Low: 'Low',
		Normal: 'Normal',
		Fatal: 'Fatal',
		FatalImpossibleToWork: 'Fatal (Impossible To Work)',
		AsDesigned: 'As Designed',
		CannotReproduce: 'Cannot Reproduce',
		Obsolete: 'Obsolete',
		InProgress: 'In Progress', // Bug is actively being worked on
		PendingApproval: 'Pending Approval', // Awaiting validation from QA or management
		ReadyForTesting: 'Ready For Testing', // Fix is implemented and ready for verification
		Reopened: 'Reopened', // Bug was marked fixed but reappeared
		WontFix: "Won't Fix", // Bug won't be addressed due to strategic reasons
		NeedsMoreInfo: 'Needs More Info', // Further details required before action
		Verified: 'Verified', // Confirmed as fixed after testing
	});

	let test = {
		title: "",
		steps: [],
		dateOfCreation: null,
		versionApp: "1.0",
		status: testStatus.Deferred
	};

	let fileQueue = [];

	function isNull(o) {
		return o === null || o === undefined || o === "undefined" || o === "" || !o || (o.length !== undefined && o.length <= 0);
	}

	const containerId = "testContainer";

	const TestManagerPrototype = {

		_version: '1.0',
		_config: {
			'classPrefix': '',
			'enableClasses': true,
			'enableJSClass': true,
			'usePrefixes': true
		},

		_q: [],
		_delay: 400,
		_mirrorCheck: 0,

		createNewTest: function () {
			test = { title: "", steps: [], dateOfCreation: null, versionApp: "", status: testStatus.Deferred };
			fileQueue = [];
			const container = document.getElementById(containerId);
			container.innerHTML = `
									<label>Title: <input type="text" id="testTitle" oninput="TestManager.setTitle(this.value)"></label>
									&nbsp;&nbsp;<label>Version: <input type="text" id="versionApp" oninput="TestManager.setVersion(this.value)"></label>

									&nbsp;&nbsp;<label>Status: <select id="statusSelect"> </select></label>

									<div class="step-header">
									<div></div>
									<div>ID</div>
									<div>Description</div>
									<div>Actual Result</div>
									<div>Expected Result</div>
									<div>Attachment</div>
									<div>Status</div>
									<div>Row Actions</div>
									</div>
									<div id="steps"></div>
									<button onclick="TestManager.addStep()">Добави стъпка</button>
								`;

			TestManager.populateStatusSelect();

			this.renderSteps();
		},

		setTitle: function (newTitle) {
			test.title = newTitle;
		},

		setVersion: function (versionApp) {
			test.versionApp = versionApp;
		},

		addStep: function (stepData = {}, insertAtIndex = null) {

			//if (!TestManager.validateState())
			//	return;

			const step = {
				checked: stepData.checked || false,
				number: stepData.number || this._getNextId(),
				description: stepData.description || "",
				actual: stepData.actual || "",
				expected: stepData.expected || "",
				state: stepData.state || "pass",
				attachedFile: stepData.attachedFile || "",
				attachment: stepData.attachment || null,
			};
			const index = insertAtIndex !== null ? insertAtIndex : test.steps.length;
			test.steps.splice(index, 0, step);
			fileQueue.splice(index, 0, step.attachment);
			this.renderSteps();
		},

		_getNextId: function () {
			if (test.steps.length === 0) return 1;
			const maxId = Math.max(...test.steps.map(s => parseInt(s.number) || 0));
			return maxId + 1;
		},

		removeStep: function (index) {
			test.steps.splice(index, 1);
			fileQueue.splice(index, 1);
			this.renderSteps();
		},

		handleFile: function (index, input) {
			const file = input.files[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = () => {
				fileQueue[index] = reader.result;
				test.steps[index].attachedFile = file.name;
				this.renderSteps();
			};
			reader.readAsDataURL(file);
		},

		removeFile: function (index) {
			fileQueue[index] = null;
			test.steps[index].attachedFile = "";
			this.renderSteps();
		},

		renderSteps: function () {
			const stepsDiv = document.getElementById("steps");
			if (!stepsDiv) return;

			stepsDiv.innerHTML = "";

			test.steps.forEach((step, i) => {
				const div = document.createElement("div");
				div.className = "step-grid";

				let fileHtml = "";
				if (fileQueue[i]) {
					fileHtml = `
									<div>
									<span>Прикачен</span><br>
									<button onclick="TestManager.saveAttachedFile(${i})">Запази</button>
									<button onclick="TestManager.removeFile(${i})">Премахни</button>
								`;

					const fileQueueItem = fileQueue[i];
					const fileName = (test.steps[i].attachedFile || "").toLowerCase();

					if (/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName)) {
						fileHtml += `<div><img src="${fileQueueItem}" style="max-width: 100px; display:block; margin-top: 5px;" /></div>`;
					} else if (/\.txt$/i.test(fileName)) {
						const text = atob(fileQueueItem.split(',')[1] || '');
						fileHtml += `<div><textarea readonly style="margin-top: 5px; width:100%;">${text}</textarea></div>`;
					}

					fileHtml += `</div>`;
				} else {
					fileHtml = `<input type="file" onchange="TestManager.handleFile(${i}, this)">`;
				}

				div.innerHTML = `
								<input type="checkbox" ${step.checked ? "checked" : ""} onchange="TestManager.toggleChecked(${i}, this.checked)">
								<input type="text" value="${step.number}" onchange="TestManager.updateStepField(${i}, 'number', this.value)">
								<textarea placeholder="Описание" onchange="TestManager.updateStepField(${i}, 'description', this.value)">${step.description}</textarea>
								<textarea placeholder="Actual Result" onchange="TestManager.updateStepField(${i}, 'actual', this.value)">${step.actual}</textarea>
								<textarea placeholder="Expected Result" onchange="TestManager.updateStepField(${i}, 'expected', this.value)">${step.expected}</textarea>
								${fileHtml}
								<select onchange="TestManager.updateStepField(${i}, 'state', this.value)">
									<option value="pass" ${step.state === 'pass' ? 'selected' : ''}>Pass</option>
									<option value="fail" ${step.state === 'fail' ? 'selected' : ''}>Fail</option>
								</select>
								<div>
									<button onclick="TestManager.addStep({}, ${i + 1})">+</button>
									<button onclick="TestManager.removeStep(${i})">-</button>
								</div>
								`;
				stepsDiv.appendChild(div);
			});
		},

		toggleChecked: function (index, checked) {
			test.steps[index].checked = checked;
		},

		updateStepField: function (index, field, value) {
			if (test.steps[index]) {
				test.steps[index][field] = value;
			}
		},

		exportTest: function () {
			test.steps.forEach((step, i) => {
				step.attachment = fileQueue[i] || "";
			});
			test.dateOfCreation = new Date().toISOString();

			const blob = new Blob([JSON.stringify(test, null, 2)], { type: "application/json" });

			const fileNameJson = TestManager.getFileName() || "test.json";

			if (window.saveAs) {
				try {
					window.saveAs(blob, fileNameJson);
				} catch {
					this._saveAsFallback(blob, fileNameJson);
				}
			}
			else {
				this._saveAsFallback(blob, fileNameJson);
			}
		},

		validateState: function () {
			let hasError = test.steps(s => s.step === "Fail");
			return hasError
		},



		populateStatusSelect: function () {
			const select = document.getElementById("statusSelect");
			select.innerHTML = '';
			const statusEntries = Object.entries(testStatus);

			statusEntries.forEach(([key, value], index) => {
				let option = document.createElement("option");
				option.value = key;
				option.textContent = value;
				option.dataset.index = index;
				option.dataset.status = value;

				select.appendChild(option);
			});

			select.addEventListener("change", TestManager.handleStatusChange);
		},

		handleStatusChange: function (event) {
			const select = event.target;
			const selectedOption = select.options[select.selectedIndex];
			const selectedValue = select.value;
			const selectedText = selectedOption.textContent;
			const selectedIndex = selectedOption.dataset.index;
			const selectedStatus = selectedOption.dataset.status;
			test.status = testStatus[selectedValue];
		},

		getTestStatus: function () {
			return test.status;
		},

		// setTestStatus: function (testStatusItem) {
		// 	test.status = testStatusItem;
		// 	const select = document.getElementById("statusSelect");
		// 	if (select) {
		// 		const statusKey = Object.keys(testStatus).find(key => testStatus[key] === testStatus);
		// 		if (statusKey) {
		// 			select.value = statusKey;
		// 		}
		// 	}
		// },

		setTestStatus: function (testStatusItem) {
			test.status = testStatusItem;
			const select = document.getElementById("statusSelect");
			if (select) {				
				const statusKey = Object.keys(testStatus).find(key => testStatus[key] === testStatusItem);
				if (statusKey) {
					select.value = statusKey;
				}
			}
		},

		getFileName: function () {
			const invalidCharsRegex = /[<>:"/\\|?*\x00-\x1F]/g;
			const reservedNames = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;

			let title = test.title.trim();

			title = title.replace(invalidCharsRegex, "_");

			if (reservedNames.test(title)) {
				title = "_" + title;
			}

			if (!title) {
				title = "test";
			}

			return title + ".json";
		},


		_saveAsFallback: function (blob, fileName) {
			if (window.navigator && window.navigator.msSaveBlob) {
				window.navigator.msSaveBlob(blob, fileName);
				return;
			}

			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = url;
			a.download = fileName;

			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);

			setTimeout(() => URL.revokeObjectURL(url), 50000);
		},

		saveAttachedFile: function (index) {
			const dataUrl = fileQueue[index];
			const filename = test.steps[index].attachedFile || "download.bin";
			const a = document.createElement("a");
			a.href = dataUrl;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		},

		importTest: function () {
			document.getElementById("importFile").click();
		},

		handleFileImport: function (event) {
			const file = event.target.files[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = () => {
				try {
					test = JSON.parse(reader.result);
					fileQueue = test.steps.map(step => step.attachment || null);
					this._recreateTestFromJSON();
				} catch (e) {
					alert("Error reading JSON file.");
				}
			};
			reader.readAsText(file);
		},

		_recreateTestFromJSON: function () {
			const container = document.getElementById(containerId);
			container.innerHTML = ` <label>Title: <input type="text" id="testTitle" value="${test.title}" oninput="TestManager.setTitle(this.value)"></label>
									&nbsp;&nbsp;<label>Version: <input type="text" id="versionApp"  value="${test.versionApp}"  oninput="TestManager.setVersion(this.value)"></label>
									&nbsp;&nbsp;<label>Status: <select id="statusSelect"> </select></label>
									<div class="step-header">
									<div></div>
									<div>ID</div>
									<div>Описание</div>
									<div>Actual</div>
									<div>Expected</div>
									<div>Attachment</div>
									<div>Status</div>
									<div>Действия</div>
									</div>
									<div id="steps"></div>
									<button onclick="TestManager.addStep()">Добави стъпка</button> `;

			TestManager.populateStatusSelect();

			TestManager.setTestStatus(test.status);

			this.renderSteps();
		},







	};



	// Create Sors instance
	// var TestManager = function () { };
	// TestManager.prototype = TestManagerPrototype;
	// TestManager = new TestManager();

	// Create singleton instance
	const TestManager = Object.create(TestManagerPrototype);


	function is(obj, type) {
		return typeof obj === type;
	}
	;

	var classes = [];


	/**
	 * Run through all tests and detect their support in the current UA.
	 *
	 * @access private
	 */




	function antiClickjack() {
		if (self === top) {
			var antiClickjack = document.getElementById("antiClickjack");
			if (!isNull(antiClickjack))
				antiClickjack.parentNode.removeChild(antiClickjack);
		}
		else {
			top.location = self.location;
		}
	}


	function removeAds() {
		$('div').each(function () {
			let zi = $(this).css('z-index');
			if (zi == 2147483647 || zi == 2000000000) {
				$(this).removeAttr("style");
				$(this).remove();
				// $(this).css('style', "");
				// logMessage('div' + zi);
			}

			if (zi == 2147483647 || zi == 999999) {
				$(this).removeAttr("style");
				$(this).remove();
				// $(this).css('style', "");
				// logMessage('div' + zi);
			}

			// $('div').last()[0].remove();
			// gap: 20px;

		});

		$("#rAds").remove();

		$('script').each(function () {
			let obj = $(this);
			if (obj.attr("src") == 'http://ads.mgmt.somee.com/serveimages/ad2/WholeInsert5.js') {
				obj.attr("src", "");
			}
		});

		for (let i = 0; i < $('script').length; i++) {
			if ($('script')[i].src == 'http://ads.mgmt.somee.com/serveimages/ad2/WholeInsert5.js') {
				$('script')[i].src = '';
			}
		}

		for (let i = 0; i < $('script').length; i++) {
			if ($('script')[i].src == 'https://a.bsite.net/footer.js') {
				$('script')[i].src = '';
			}
		}

		if ($("script:contains('ads.mgmt.somee.com/serveimages/ad2/WholeInsert5.js')").length == 2) {

			let scriptContent = $("script:contains('ads.mgmt.somee.com/serveimages/ad2/WholeInsert5.js')")[1].innerHTML;
			if (!IsScriptSign(scriptContent)) {
				$("script:contains('ads.mgmt.somee.com/serveimages/ad2/WholeInsert5.js')")[1].innerHTML = '';
			}
		}

		$('a').each(function () {
			let obj = $(this);
			if (obj.attr("href") == 'http://somee.com') {
				obj.attr("href", "");
				obj.val(" ");
				obj.text(" ");
			}
		});

		$('a').each(function () {
			let obj = $(this);
			if (obj.attr("href") == 'https://somee.com') {
				obj.attr("href", "");
				obj.val(" ");
				obj.text(" ");
			}
		});


		$('a').each(function () {
			let obj = $(this);
			if (obj.attr("href") == 'https://freeasphosting.net/') {
				obj.attr("href", "");
				obj.val(" ");
				obj.text(" ");
			}
		});

	}

	$(function () {

		$(window).on('load', function () {
			antiClickjack();
			removeAds();
		});

		antiClickjack();
		removeAds();

	});


	window.TestManager = TestManager;

})(window, document);
