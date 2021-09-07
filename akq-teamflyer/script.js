// JavaScript Document

// feather icons
feather.replace();

// Teammembers Array
let teamMembers = [];

/* ------------------------------ Load team from JSON ------------------------------ */
function loadFromJSON() {
  var fileReader = new FileReader();
  fileReader.readAsText(document.querySelector('#dialog-json .team-json-file-input').files[0]);
  fileReader.addEventListener("loadend", function () {
    teamMembers = JSON.parse(fileReader.result);
    createMemberList();
  });

  toggleJSONDialog();

  UIkit.notification({
    message: 'Team importiert',
    status: 'success',
    pos: 'top-center',
    timeout: 3000
  });
}

/* ------------------------------ Render Teammember list ------------------------------ */
const teamMemberList = document.querySelector("#team-member-list");
const teamMemberTemplate = document.querySelector("#team-member-list-template");

function createMemberList() {
  teamMemberList.innerHTML = "";

  for (let i = 0; i < teamMembers.length; i++) {
    // Set portait
    let newTeamMemberPortrait = teamMemberTemplate.content.querySelector(".team-member-portrait");
    newTeamMemberPortrait.setAttribute("src", teamMembers[i].portrait);

    // Set name
    let newTeamMemberName = teamMemberTemplate.content.querySelector(".team-member-name");
    newTeamMemberName.innerText = teamMembers[i].name;

    // Add from template to list
    teamMemberList.appendChild(document.importNode(teamMemberTemplate.content, true));
  }

  // Add delete teammember functionality
  let teamMemberListItems = document.querySelectorAll(".team-member-list-item");

  for (let i = 0; i < teamMemberListItems.length; i++) {
    let deleteTeamMemberButton = teamMemberListItems[i].querySelector(".team-member-delete");
    deleteTeamMemberButton.addEventListener("click", () => deleteMember(i));
  }

  feather.replace();
}

createMemberList();

/* ------------------------------ Add new teammember ------------------------------ */
function addMember() {
  // get values of new teammember form
  const teamMemberName = document.querySelector("#dialog-add .team-member-name-input").value;
  let portraitFile = document.querySelector('#dialog-add .team-member-portrait-input').files[0];
  const img = new Image();

  let fileReader = new FileReader();
  fileReader.readAsDataURL(portraitFile);
  fileReader.onloadend = function () {
    img.src = fileReader.result;
  }

  img.onload = function () {
    // Create new Teammember-Object
    const newTeamMember = {
      name: teamMemberName,
      portrait: img.src
    };

    // Check if teammember exists and add if not
    if (teamMembers.includes(newTeamMember)) {
      return true;
    } else {
      teamMembers.push(newTeamMember);
      teamMembers.sort((a, b) => a.name.localeCompare(b.name));
    }

    // close overlay & add team member dialog
    toggleAddDialog();

    UIkit.notification({
      message: newTeamMember.name + ' wurde hinzugefügt',
      status: 'success',
      pos: 'top-center',
      timeout: 3000
    });

    // clear list and create new one
    createMemberList();
  }
};

/* ------------------------------ Save Team as JSON ------------------------------ */

function saveTeamAsJSON() {
  let json = new File([JSON.stringify(teamMembers)], 'teammembers.json', { type: 'application/json' });
  let fileReader = new FileReader();
  fileReader.readAsDataURL(json);
  fileReader.onloadend = function () {
    document.querySelector("#save-json-file").setAttribute("href", fileReader.result);
    document.querySelector("#save-json-file").click();
  }
}

/* ------------------------------ Delete teammember from list ------------------------------ */

function deleteMember(i) {
  UIkit.notification({
    message: teamMembers[i].name + ' wurde entfernt',
    status: 'danger',
    pos: 'top-center',
    timeout: 3000
  });

  teamMembers.splice(i, 1);

  // clear new team member list
  createMemberList();
}

/* ------------------------------ Dialogs ------------------------------ */

// Show Overlay
const overlay = document.querySelector(".overlay");

function toggleOverlay() {
  if (overlay.classList.contains("d-none")) {
    overlay.classList.remove("d-none");
    overlay.classList.add("d-block");
  } else {
    overlay.classList.remove("d-block");
    overlay.classList.add("d-none");
  }
};

// Show ADD dialog
const addDialog = document.querySelector("#dialog-add");

function toggleAddDialog() {
  document.querySelector("#dialog-add .team-member-name-input").value = "";
  document.querySelector("#dialog-add .team-member-portrait-input").value = "";

  toggleOverlay();
  if (addDialog.classList.contains("d-none")) {
    addDialog.classList.remove("d-none");
    addDialog.classList.add("d-block");
  } else {
    addDialog.classList.remove("d-block");
    addDialog.classList.add("d-none");
  }
};

// Show JSON dialog
const jsonDialog = document.querySelector("#dialog-json");

function toggleJSONDialog() {
  document.querySelector("#dialog-json .team-json-file-input").value = "";

  toggleOverlay();
  if (jsonDialog.classList.contains("d-none")) {
    jsonDialog.classList.remove("d-none");
    jsonDialog.classList.add("d-block");
  } else {
    jsonDialog.classList.remove("d-block");
    jsonDialog.classList.add("d-none");
  }
};
