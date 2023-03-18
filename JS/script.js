// ---------------------------------------------------- \\
// ! Selecting Elements section
// ---------------------------------------------------- \\
let containers = document.getElementsByClassName("container");
const masterList = document.getElementsByTagName("ul");
let masterListItems = document.getElementsByTagName("li");
const addBTNs = document.getElementsByTagName("button");
console.log(addBTNs);
let draggedItem;
let randomeNumber = Math.floor(Math.random() * 100) + 1;
let readyCollection = [];
let readCollectionOGLength;
// ^ ---------------------------------------------------- \\
// ^ ---------------------------------------------------- \\
// ---------------------------------------------------- \\
// ! FUNCTIONS SECTIONS
// ---------------------------------------------------- \\

// TODO --> CREATING // ADDING NEW TASKS FUNCTION

// this function is responsible for addin evevnt listneters to all BTNS on the project
[...addBTNs].forEach((list) => {
  list.addEventListener("click", (event) => {
    // here iam choosing the closest div to the BTN that being clicked
    const listContainer = event.target.closest("div");
    if (listContainer) {
      // then iam traversing the DOM by using element level selctor
      const thisList = listContainer.querySelector("#master-list");
      // create new list element and specfiy the contents
      const masterListChild = document.createElement("li");
      masterListChild.setAttribute("draggable", "true");
      masterListChild.setAttribute("class", "list-item");
      masterListChild.setAttribute(
        "item-id",
        `${(randomeNumber = Math.floor(Math.random() * 100) + 1)}`
      );
      masterListChild.setAttribute(
        "list-number",
        thisList.getAttribute("list-number")
      );
      masterListChild.innerHTML = `
          <div class="tasks-container">
            <input
              type="text"
              placeholder="Enter Your Task"
              class= "input-field"
              readonly="readonly"
              value = ""
            />
            <label
              for="none"
              class="fa fa-solid fa-lock icon1 icon-edit icon-open"
            ></label>
            <label
              for="none"
              class="fa fa-solid fa-lock-open icon1 icon-edit icon-close"
            ></label>
            <label
              for="none"
              class="fa-solid fa-trash icon2 icon-delete"
            ></label>
          </div>
    `;
      // finally appending the new list item to the correct list
      thisList.appendChild(masterListChild);
      // -------------------------------- \\
      // Addtional Code Section // calling functions while creating elements
      // !updating selection range every time a new task is added
      // this function is responsible to update list items, every time new one is created
      masterListItems = document.getElementsByTagName("li");
      containers = document.getElementsByClassName("container");
      updatingAndAddingEventlistners(masterListItems);
      writeToLocalStorage(containers);
      gettingThingsReady();
    }
  });
});
// ! ------------------------------------------------------------------------------ \\
//  TODO --> DELETING TASK FROM TASKS LIST
// ! ------------------------------------------------------------------------------ \\
function deleteTasks() {
  [...masterList].forEach((list) => {
    list.addEventListener("click", (event) => {
      // then it will check if user clicked on icon with class of "icon-delete"
      if (event.target.classList.contains("icon-delete")) {
        // then delete the parent <li> element of the clicked trash icon, by traversing the DOM using parentElement twice because of HTML file structure
        // updateAfterDelete(event.target.parentElement.parentElement);
        event.target.parentElement.parentElement.remove();
        // selecting containers again, to get a fresh copy
        containers = document.getElementsByClassName("container");
        // write new data to local storage
        writeToLocalStorage(containers);
      }
    });
  });
}

// ! ------------------------------------------------------------------------------ \\
//  TODO --> ENABLE / DISABLE EDITING FUNCTIONALITY
// ! ------------------------------------------------------------------------------ \\
function editTasks(event) {
  // selecting all needed elemtns
  let inputField = event.target.parentElement.querySelector(".input-field");
  let openEdit = event.target.parentElement.querySelector(".icon-edit");
  let closeEdit = event.target.parentElement.querySelector(".icon-close");
  // check if user clicked on open edit icon
  if (event.target.classList.contains("icon-edit")) {
    closeEdit.classList.toggle("clicked");
    openEdit.classList.add("hidden");
    inputField.removeAttribute("readonly");
    inputField.addEventListener("input", () => {
      inputField.setAttribute("value", inputField.value);
    });
  }
  // check if user clicked on close edit icon
  if (event.target.classList.contains("icon-close")) {
    closeEdit.classList.remove("clicked");
    openEdit.classList.remove("hidden");
    inputField.setAttribute("readonly", "readonly");
  }
  containers = document.getElementsByClassName("container");
  // write new data to local storage
  writeToLocalStorage(containers);
}
// ! ------------------------------------------------------------------------------ \\
// ! DRAG && DROP CONTENTS
// ! ------------------------------------------------------------------------------ \\

// this function is responsible to take new input of the new added Li items
function updatingAndAddingEventlistners(masterListItems) {
  masterListItems = document.getElementsByTagName("li");
  [...masterListItems].forEach((list) => {
    // adding if to decide whether to run drag || toch
    let flag = false;
    if ("ontouchstart" in document.documentElement) {
      list.addEventListener("touchstart", touchStart);
      list.addEventListener("touchend", touchEnd);
      dragFunctions(flag);
    } else {
      list.addEventListener("dragstart", dragStart);
      list.addEventListener("dragend", dragEnd);
      flag = true;
      dragFunctions(flag);
    }
    // had to add these because of the latency happend when the app loads, basically it will require user to click 2 times to apply editing,
    // so now iam adding evevnts to evevry button when ever it pressed
    if (list.querySelector(".icon-edit")) {
      list.querySelector(".icon-edit").addEventListener("click", editTasks);
      list.querySelector(".icon-close").addEventListener("click", editTasks);
      list.querySelector(".icon-delete").addEventListener("click", deleteTasks);
    }
  });
}

// TODO --> THIS SECTION CONTAINS DRAGSTART && DRAGEND
function dragStart() {
  // here i need to select the list item iam at due to HTML structre
  draggedItem = this.parentElement.querySelector(".list-item");
  this.querySelector(".input-field").className += " hold";
  setTimeout(() => (this.className += " hide"), 0);
}

function dragEnd() {
  // drag end is responsible to set back default classes to the items user moved
  this.className = "list-item";
  // selecting containers again, to get a fresh copy
  containers = document.getElementsByClassName("container");
  // write new data to local storage
  writeToLocalStorage(containers);
}

// TODO --> THIS SECTION CONTROLS WHAT IS HAPENIING DURING DRAGGING

// NOTE: i added draging functionality to the containers, WHY ? to have better traversing accebitly also it works better.
function dragFunctions(boolean) {
  if (boolean) {
    [...containers].forEach((list) => {
      list.addEventListener("dragover", dragOver);
      list.addEventListener("dragenter", dragEnter);
      list.addEventListener("dragleave", dragLeave);
      list.addEventListener("drop", dragDrop);
    });
  } else {
    list.addEventListener("touchmove", touchMove);
    list.addEventListener("touchenter", touchEnter);
    list.addEventListener("touchleave", touchLeave);
    list.addEventListener("touchend", touchDrop);
  }
}
// mouse DRAG
function dragOver(event) {
  event.preventDefault();
}
function dragEnter(event) {
  // adding holding effect to the item we select
  event.preventDefault();
  const inputField = event.target.querySelector("input");
  if (inputField && inputField.nodeName === "INPUT") {
    inputField.className += " hover";
  }
}
function dragLeave(event) {
  // added check conditions to prevent null exception in the console
  const inputField = event.target.querySelector("input");
  if (inputField && inputField.nodeName === "INPUT") {
    // here i used nodeName, and note how INPUT in allCaps becasue nodeName returns CAPS
    // remove hover class "border-top-effect" from items hoverd on
    inputField.className = "input-field";
  }
}
function dragDrop() {
  // change draggedItem list number to the new appened list
  draggedItem.setAttribute(
    "list-number",
    this.querySelector("ul").getAttribute("list-number")
  );
  // append the new item
  this.querySelector("ul").appendChild(draggedItem);

  // Solving that some items will keep holding "hover" class after appending new element
  let allInputsFieldsHere = this.querySelectorAll("input");
  [...allInputsFieldsHere].forEach((element) => {
    element.className = "input-field";
  });
  // select containers again to write them to local storage
}
// ! Touch DRAG
function touchMove(event) {
  event.preventDefault();
}
function touchEnter(event) {
  // adding holding effect to the item we select
  event.preventDefault();
  const inputField = event.target.querySelector("input");
  if (inputField && inputField.nodeName === "INPUT") {
    inputField.className += " hover";
  }
}
function touchLeave(event) {
  // added check conditions to prevent null exception in the console
  const inputField = event.target.querySelector("input");
  if (inputField && inputField.nodeName === "INPUT") {
    // here i used nodeName, and note how INPUT in allCaps becasue nodeName returns CAPS
    // remove hover class "border-top-effect" from items hoverd on
    inputField.className = "input-field";
  }
}
function touchDrop() {
  // change draggedItem list number to the new appened list
  draggedItem.setAttribute(
    "list-number",
    this.querySelector("ul").getAttribute("list-number")
  );
  // append the new item
  this.querySelector("ul").appendChild(draggedItem);

  // Solving that some items will keep holding "hover" class after appending new element
  let allInputsFieldsHere = this.querySelectorAll("input");
  [...allInputsFieldsHere].forEach((element) => {
    element.className = "input-field";
  });
  // select containers again to write them to local storage
}

// ! ------------------------------------------------------------------------------ \\
// ! LOCAL STROAGE SECTION
// ! ------------------------------------------------------------------------------ \\

// this function need to be called when evevr a new element is created
function writeToLocalStorage(listofitems) {
  // reset old data
  localStorage.clear();
  // Store each <ul> element content separately in local storage
  [...listofitems].forEach((item, i) => {
    let list = item.querySelector(`.master-list`);
    let listItems = list.querySelectorAll("li");
    let listData = [];
    listItems.forEach((li) => {
      li.setAttribute("listNumber", `${i}`);
      listData.push(li.outerHTML);
    });
    localStorage.setItem(`listData-${i}`, JSON.stringify(listData));
  });
}

// FIRST GET THE DATA READY TO BE USED
function gettingThingsReady() {
  // reset collection / delete old entries
  readyCollection = [];
  for (let i = 0; i < 3; i++) {
    let rawLocalData = JSON.parse(localStorage.getItem(`listData-${i}`));
    // check if collection contain data --> truthy value
    if (rawLocalData) {
      let tempElement = document.createElement("div");
      let tempElement2;
      for (let j = 0; j < rawLocalData.length; j++) {
        tempElement.innerHTML = rawLocalData[j];
        tempElement2 = tempElement.querySelector(".list-item");
        readyCollection.push(tempElement2);
      }
    }
  }
  // console.log(readyCollection);
  return readyCollection;
}

function populateUI() {
  // get data from local storage
  gettingThingsReady();
  // loop on all 3 lists
  [...masterList].forEach((list) => {
    // loop on the data collection
    for (let j = 0; j < readyCollection.length; j++) {
      // check if list-numeber is matched
      if (
        list.getAttribute("list-number") ===
        readyCollection[j].getAttribute("list-number")
      ) {
        console.log(readyCollection[j].getAttribute("list-number"));
        // set innerHTML to the matched element
        // don't use innetHTML here this collection already converted to HTML no text
        list.appendChild(readyCollection[j]);
      }
    }
  });
  // call main functions to readd evevnt listeners to all new items
  updatingAndAddingEventlistners();
}
populateUI();
