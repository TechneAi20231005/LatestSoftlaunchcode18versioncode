export const NumbersOnly = (e) => {
  //angka only
  var regex = new RegExp("^(?!0{9})[0-9 \b]+$");
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};

export const RequiredNumbersOnly = (e) => {
  // angka only
  var regex = new RegExp("^(?!0{9})[0-9 \b]+$");
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);

  // Check if the input is 0
  // if (key === '0') {
  //   e.preventDefault();
  //   return false;
  // }

  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};


export const MobileNumbersOnly = (e) => {
  //angka only
  var regex = new RegExp("^(?!0{9})[0-9 \b]+$");
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};

// export const NumbersOnly = (e) => {

//   var regex = /^[0-9]{12}$/;
//   var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
//   if (!regex.test(key)) {
//     e.preventDefault();
//     return false;
//   }
// };

export const mobileNumbersOnly = (e) => {
  //angka only
  var regex = /^(?!0{9})[0-9]{0,10}$/;
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};

// export const GSTNumberOnly = (e) => {
//   var regex = new RegExp(
//     // "[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[0-9]{1}[Z]{1}[A-Z0-9]{1}"
//     "^[A-Z0-9]+$"
//   );
//   var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
//   if (!regex.test(key)) {
//     e.preventDefault();
//     return false;
//   }
// };

export const GSTNumberOnly = (e) => {
  //angka only
  var regex = new RegExp(
    "^[a-zA-Z0-9]+$"
  );
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};

export const NumbersOnlyWithMinus = (e) => {
  //angka only
  var regex = new RegExp("^[0-9-\b]+$");
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};

export const NumbersOnlyWithoutMinus = (e) => {
  //angka only
  var regex = new RegExp("^[0-9\b/-]+$");
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};

export const MobileNumberOnly = (e) => {
  //angka only
  var mob = e.target.value;
  if (mob.charAt(0) === "0" && mob.charAt(0) === "") {
    // if (mob.length == 10) {
    //   var regex = new RegExp("^[6-9]{1}[0-9]{9}+$");
    //   var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    //   if (!regex.test(key)) {
    //     e.preventDefault();
    //     return false;
    //   }
    // }
  } else {
    // alert("Invalid Start");
    // e.preventDefault();
    // return false;
  }
};

export const NumbersOnlyForPincode = (e) => {
  //angka only
  var regex = new RegExp("^[1-9]{1}[0-9]{5}$");
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};

export const pincodeWithOutSpace = (e) => {
  //angka only
  var regex = new RegExp("^[0-9]+$");
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};

export const NumbersSpeicalOnlyDot = (e) => {
  var regex = new RegExp("^[0-9.\b]+$");
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};

export const NumbersSpecialOnlyDecimal = (e) => {
  var regex = new RegExp("^[0-9.,-]+$");
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  var value = e.target.value + key;
  if (!regex.test(value)) {
    e.preventDefault();
    return false;
  }
  if ((value.match(/[.]/g) || []).length > 1) {
    e.preventDefault();
    return false;
  }
  var parts = value.split('.');
  if (parts.length > 1 && parts[1].length > 2) {
    e.preventDefault();
    return false;
  }
};


export const NumbersSpeicalOnly = (e) => {
  var regex = new RegExp("[0-9*,#+]+$");
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};
export const Characters = (e) => {
  var regex = new RegExp("^[A-Za-z]+$");
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};

export const CharacterWithSpace = (e) => {
  var regex = new RegExp("^[a-zA-Z0-9\\s@#$%^&*()_+={}\\[\\]:;\"'<>,.?/|]+$");
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};


export const userNameOnly = (e) => {
  var regex = new RegExp("^[a-zA-Z0-9]+$");
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};

export const password = (e) => {
  var regex = new RegExp("[A-Za-z0-9!@#$%^&*().,<>{}<>?_=+-|;:'\"/]");
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};

export const addressFieldOnly = (e) => {
  const regex = new RegExp(
    "^[A-Za-z0-9 .,?!@#$%^&*()_+-=;:'\"\\/\\[\\]{}|`~\\n]{0,50}$"
  );

  if (e.keyCode === 13) {


    return true;
  }

  const value =
    e.target.value + String.fromCharCode(e.charCode || e.which || 0);
  if (!regex.test(value)) {
    e.preventDefault();
  }
};


export const addressField = (e) => {
  const regex = new RegExp(
    "^[A-Za-z0-9 .,?!@#$%^&*()_+-=;:'\"\\/\\[\\]{}|`~\\n]{0,250}$"
  );

  if (e.keyCode === 13) {


    return true;
  }

  const value =
    e.target.value + String.fromCharCode(e.charCode || e.which || 0);
  if (!regex.test(value)) {
    e.preventDefault();
  }
};

// export const CharactersOnly = (e) => {
//   var regex = new RegExp("^[a-zA-Z]+$");
//   var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
//   if (!regex.test(key)) {
//     e.preventDefault();
//     return false;
//   }
// };

export const CharactersOnly = (e) => {
  var regex = new RegExp("^[a-zA-Z0-9]+$");
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};


export const CharactersNumbersOnly = (e) => {
  var regex = new RegExp("^[a-zA-Z0-9 !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~]+$");
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};

export const CharactersNumbersOnlyWithComma = (e) => {
  var regex = new RegExp("^[a-zA-Z 0-9, ]+$");
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};

// const templates = []; // This array will hold all the template names that have been added

// export const CharactersNumbersOnlypri = (e, templateName) => {
//   var regex = new RegExp("^[a-zA-Z0-9!@#$%^&*()_+=\\-\\[\\]{}|\\:;\"'<>,.?\\/ ]+$"); // Updated regular expression to allow for special characters
//   var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
//   if (!regex.test(key)) {
//     e.preventDefault();
//     return false;
//   }
// }

export const validateTemplateName = (e, existingTemplates) => {
  var regex = new RegExp(
    "^[a-zA-Z0-9 !@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]+$"
  );
  var templateName = e.target.value.trim();

  if (templateName === "") {
    return;
  }

  // Check if existingTemplates is an array and not null or undefined
  if (!Array.isArray(existingTemplates) || existingTemplates.length === 0) {
    // Handle the case where existingTemplates is not valid
    console.error("Invalid or empty existingTemplates");
    return;
  }

  if (existingTemplates.includes(templateName)) {
    alert("Template name already exists");
    e.preventDefault();
    return false;
  }

  if (!regex.test(templateName)) {
    alert(
      "Template name should only contain letters, numbers, and special characters"
    );
    e.preventDefault();
    return false;
  }
};

export const MSMENumbersOnly = (e) => {
  var regex = new RegExp("/^([A-Za-z]{5}d{2}[A-Za-z0-9]{1,2}d{7})$|^(d{12})$/");

  if (regex == regex) {
    return true;
  } else {
    return false;
  }
};

export const CharactersNumbersOnlyForPan = (e) => {
  var regex = new RegExp("^[a-zA-Z0-9]+$");
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  // if (e.key >= 'a' && e.key <= 'z') {
  //     e.preventDefault();
  //   }
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};
export const validatePAN = (e) => {
  const regex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  const key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};

export const CharactersNumberAccountNumberonly = (e) => {
  // Only allow numbers (0-9)
  var regex = new RegExp("^[0-9]+$");
  var inputValue = e.target.value + String.fromCharCode(!e.charCode ? e.which : e.charCode);

  // Check if the input length is between 10 and 25 characters
  if (inputValue.length < 10 || inputValue.length > 25 || !regex.test(inputValue)) {
    e.preventDefault();
    return false;
  }
};


const bank = (e) => {
  var regex = new RegExp("^[a-zA-Z0-9\\s]+$"); // allow characters, numbers, and spaces
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};

// export const CharactersNumbersSpeicalOnly = (e) => {
//   var regex = new RegExp("^[a-zA-Z0-9\\s]+$"); // allow only English characters, numbers, and white space
//   var regex1 = new RegExp("^[\\u0900-\\u097F\\s]+$"); // allow Devanagari script characters along with white space
//   var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
//   if (!regex.test(key) && !regex1.test(key)) {
//     e.preventDefault();
//     return false;
//   }
//   // check the length of the entered value
//   if (e.target.value.length >= 50) {
//     e.preventDefault();
//     return false;
//   }
// };

export const CharactersNumbersOnlyi = (e) => {
  var regex = new RegExp("^[a-zA-Z0-9\\u0900-\\u097F ]+$");

  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);

  if (e.target.value.length >= 50) {
    e.preventDefault();
    return false;
  }

  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};

export const CharactersNumbersSpeicalOnly = (e) => {
  var regex = new RegExp("^[a-zA-Z0-9\\s]+$");
  var regex1 = new RegExp("^[\\u0900-\\u097F\\s]+$");

  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);

  if (e.target.value.length >= 50) {
    e.preventDefault();
    return false;
  }
};




export const emailOnly = (e) => {
  // Get the entered character
  const key = e.key;

  // Email regex pattern
  const emailRegex = /^[a-zA-Z0-9._@]+$/;

  // Check if the entered character is valid for an email address
  if (!emailRegex.test(key)) {
    e.preventDefault();
    return false;
  }
};

export const RefNumbersSpeicalOnly = (e) => {
  var regex = new RegExp(
    "^[0-9!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?\\s-]{0,20}$"
  );

  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);

  if (e.target.value.length >= 20) {
    e.preventDefault();
    return false;
  }

  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};
export const NarrationAlphanumeric = (e) => {
  // Define a regular expression that matches alphanumeric characters and space
  var regex = /^[A-Za-z]*$/;

  // Get the current input value
  var inputValue = e.target.value;

  // If the input length exceeds 50 characters, prevent further input
  if (inputValue.length >= 50) {
    e.preventDefault();
    return false;
  }

  // Check if the input matches the allowed pattern
  if (!regex.test(inputValue)) {
    // If it doesn't match, prevent the input
    e.preventDefault();
  }



  // Check if the new character being typed is an alphabet
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};





export const RefNumbersSpecialAlphanumeric = (e) => {
  var regex = new RegExp(
    "^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?\\s-]{0,20}$"
  );

  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);

  if (e.target.value.length >= 25) {
    e.preventDefault();
    return false;
  }

  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};


export const CardNumbersOnly = (e) => {
  var regex = new RegExp("^[0-9]{0,20}$");

  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);

  if (!regex.test(key) && key.toUpperCase() !== "N" && key.toUpperCase() !== "A") {
    e.preventDefault();
    return false;
  }
};


export const CharacterFirstOnly = (e) => {
  var regex = new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$");
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};

export const EmailOnly = (e) => {
  var regex = new RegExp("^([a-zd.-]+)@([a-zd-]+).([a-z]{2,8})(.[a-z]{2,8})?$");
  var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (!regex.test(key)) {
    e.preventDefault();
    return false;
  }
};




export const imageOnly = (e) => {
  const imageFile = e.target.files[0];
  if (!imageFile.name.match(/\.(jpg|jpeg|png|gif)$/)) {
    e.preventDefault();
    e.target.value = null;
    alert("Please select valid image.");
    return false;
  }
};

export const timeHrMin = (e) => {
  // var regex = new RegExp("^(?:([01]?\d|2[0-3]):([0-5]?\d):)?([0-5]?\d)$");
  // if (!regex.test(e.target.value)) {
  //     alert("NOT ACCEPTED");
  //     e.target.vaule="00:00";
  //     return false;
  // }
};
