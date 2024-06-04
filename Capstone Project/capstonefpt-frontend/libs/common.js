export function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

// For hidden lisense in syncfusion - Violate code (do not use in the real project, you should buy a lisense)
export function hideLisenceElementSyncFusion() {
  // Get the body element
  let body = document.body;
  // letiable to store the found element
  let foundElement = null;
  // Iterate through child elements of body
  for (let i = 0; i < body.children.length; i++) {
    let child = body.children[i];
    // Check if the child has the expected styles
    if (
      child.style.position === "fixed" &&
      child.style.top === "10px"
      // add other style checks as needed
    ) {
      foundElement = child;
      break;
    }
  }
  // If the element is found, set its display to 'none'
  if (foundElement) {
    // console.log("Element found:", foundElement);
    foundElement.style.display = "none";
  } else {
    // console.log("Element not found");
  }
}

export function hideFormAdsSyncFusion() {
  // Get all elements on the page
  const allElements = document.querySelectorAll("*");
  
  // Loop through all elements to find the ad element
  allElements.forEach(element => {
    // Check if the element's text content contains the specific text
    if (element.textContent.includes("Claim your FREE account")) {
      // If the ad element is found, hide it
      element.style.display = "none";
      console.log("Ad element hidden");
    }
  });
}




// For CKEditor config
export const editorConfiguration = {
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "link",
    "bulletedList",
    "numberedList",
    "|",
    "outdent",
    "indent",
    "|",
    "imageUpload",
    "blockQuote",
    "insertTable",
    "mediaEmbed",
    "undo",
    "redo",
  ],
};

export const getUniqueRecords = (arr, prop) => {
  const uniqueSet = new Set();
  return arr.filter((obj) => {
    const propValue = obj[prop];
    if (!uniqueSet.has(propValue)) {
      uniqueSet.add(propValue);
      return true;
    }
    return false;
  });
};

// For Decoded JWT
export function parseJwt(token) {
  if (!token) {
    return;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}

// For getRole from token
export function getRoleFromToken(token) {
  let roleFromToken = parseJwt(token)?.role;
  if (!roleFromToken) {
    return;
  }
  return roleFromToken;
}

// For getUserName from token
export function getUserNameFromToken(token) {
  let nameFromToken = parseJwt(token)?.name;
  if (!nameFromToken) {
    return;
  }
  return nameFromToken;
}

// Format search schedule date
export function formatDateScheduleSearch(inputDateString) {
  const inputDate = new Date(inputDateString);
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return inputDate.toLocaleDateString("en-GB", options).replace(/\//g, "/");
}
