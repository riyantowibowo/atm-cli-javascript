function getCommand(event) {
	if (event.key === "Enter") { // Check if Enter key was pressed
		const stateScreen = parseInt(document.getElementById("state").value); // Get state value
		const inputValue = document.getElementById("command").value.trim(); // Get input value and trim whitespace
		const words = inputValue.split(" "); // Split input value by space
		const firstWord = inputValue.split(" ")[0]; // Split input value by space and get first word
		const secondWord = inputValue.split(" ")[1]; // Split input value by space and get first word
		const thirdWord = inputValue.split(" ")[2]; // Split input value by space and get first word

		document.getElementById("command").value = ""; // Clear the input value
		document.getElementById("command").focus(); // Give focus to the input field
		
		// Hide all errors
		document.querySelector(".error.not-found").style.display = "none"; 
		document.querySelector(".error.no-username").style.display = "none";
		document.querySelector(".error.no-balance").style.display = "none";
		document.querySelector(".error.wrong-amount").style.display = "none";
		// Hide all success
		document.querySelector(".success.saved").style.display = "none";	
		document.querySelector(".success.withdrawn").style.display = "none";	
		document.querySelector(".success.transfer").style.display = "none";	

		// console.log(stateScreen);

		if (stateScreen === 1) { 
			if(firstWord.toLowerCase() === "login"){ // Check if the first word is "login"
				const remainingWords = words.slice(1).join(" "); // Get the remaining words
				const userName = remainingWords; // Username is the remaining words

				if(userName.length < 1){
					document.querySelector(".error.no-username").style.display = "block";
				}
				else{
					document.getElementById("state").value = 2;
					document.getElementById("userlogin").value = userName;
					document.querySelector(".menu-username").innerHTML = userName;
					document.querySelector(".prompt.home").style.display = "none";
					document.querySelector(".prompt.menu").style.display = "block";

					// Check if userName is in the cookies
					const cookieName = `${userName}`; // Generate cookie name based on userName value
					if (document.cookie.indexOf(cookieName) === -1) {
						// If the cookie is not found, set a new cookie with a value of 0
						document.cookie = `${cookieName}=0`;
					}

					const cookieRegExp = new RegExp(`(^| )${cookieName}=([^;]+)`, "g"); // Create a regular expression to find the cookie with the generated name and its value
					const matches = document.cookie.match(cookieRegExp); // Find the cookie that matches the regular expression
					if (matches) {
						const cookieValue = matches[0].split("=")[1]; // Get the value of the cookie from the matched string
						document.querySelector(".menu-balance").innerHTML = cookieValue;
					}
				}

			}
			else{
				// Error command not found
				document.querySelector(".error-message").innerHTML = firstWord;
				document.querySelector(".error.not-found").style.display = "block";
			}
		}
		else if(stateScreen === 2){
			switch (firstWord.toLowerCase()) {
				case "deposit":
					if(isNaN(secondWord) || secondWord < 1){
						document.querySelector(".error.wrong-amount").style.display = "block";
					}
					else{
						const currentUser = document.getElementById("userlogin").value;
						const cookieRegExp = new RegExp(`(^| )${currentUser}=([^;]+)`, "g"); // Create a regular expression to find the cookie with the currentUser
						const matches = document.cookie.match(cookieRegExp); // Find the cookie that matches the regular expression
						if (matches) {
							const cookieValue = matches[0].split("=")[1]; // Get the value of the cookie from the matched string
							const addedAmount = parseInt(cookieValue) + parseInt(secondWord);
							document.cookie = `${currentUser}=` + addedAmount;
							document.querySelector(".added-amount").innerHTML = secondWord;
							document.querySelector(".menu-balance").innerHTML = addedAmount;
							document.querySelector(".success.saved").style.display = "block";
						}
					}
					break;
				case "withdraw":
					if(isNaN(secondWord) || secondWord < 1){
						document.querySelector(".error.wrong-amount").style.display = "block";
					}
					else{
						const currentUser = document.getElementById("userlogin").value;
						const cookieRegExp = new RegExp(`(^| )${currentUser}=([^;]+)`, "g"); // Create a regular expression to find the cookie with the currentUser
						const matches = document.cookie.match(cookieRegExp); // Find the cookie that matches the regular expression
						if (matches) {
							const cookieValue = matches[0].split("=")[1]; // Get the value of the cookie from the matched string
							const substractAmount = parseInt(cookieValue) - parseInt(secondWord);
							if(substractAmount < 0){
								document.querySelector(".error.no-balance").style.display = "block";
							}
							else{
								document.cookie = `${currentUser}=` + substractAmount;
								document.querySelector(".withdrawn-amount").innerHTML = secondWord;
								document.querySelector(".menu-balance").innerHTML = substractAmount;
								document.querySelector(".success.withdrawn").style.display = "block";
							}
						}
					}
					break;
				case "transfer":
					const extractCommand = words.shift(); // Extract first word from array
					const transferAmount = words.pop(); // Extract last word from array
					const targetUser = words.join(" "); // Join remaining words with space
					if(isNaN(transferAmount) || transferAmount < 1){
						document.querySelector(".error.wrong-amount").style.display = "block";
					}
					else{
						const currentUser = document.getElementById("userlogin").value;
						const cookieRegExp = new RegExp(`(^| )${currentUser}=([^;]+)`, "g"); // Create a regular expression to find the cookie with the currentUser
						const matches = document.cookie.match(cookieRegExp); // Find the cookie that matches the regular expression
						if (matches) {
							const cookieValue = matches[0].split("=")[1]; // Get the value of the cookie from the matched string
							const substractAmount = parseInt(cookieValue) - parseInt(transferAmount);
							if(substractAmount < 0){
								document.querySelector(".error.no-balance").style.display = "block";
							}
							else{
								document.cookie = `${currentUser}=` + substractAmount;

								// Check if targetUser is in the cookies
								const cookieTarget = `${targetUser}`; // Generate cookie name based on targetUser value
								if (document.cookie.indexOf(cookieTarget) === -1) {
									// If the cookie is not found, set a new cookie with a value of 0
									document.cookie = `${cookieTarget}=` + parseInt(transferAmount);
								}
								else{
									const cookieTargetRegExp = new RegExp(`(^| )${cookieTarget}=([^;]+)`, "g"); // Create a regular expression to find the cookie with the generated name and its value
									const matchesTarget = document.cookie.match(cookieTargetRegExp); // Find the cookie that matches the regular expression
									if (matchesTarget) {
										const cookieTargetValue = matchesTarget[0].split("=")[1]; // Get the value of the cookie from the matched string
										const cookieTargetValueAdded = parseInt(cookieTargetValue) + parseInt(transferAmount);
										document.cookie = `${cookieTarget}=` + parseInt(cookieTargetValueAdded);
									}
								}

								document.querySelector(".transfer-amount").innerHTML = transferAmount;
								document.querySelector(".transfer-target").innerHTML = targetUser;
								document.querySelector(".menu-balance").innerHTML = substractAmount;
								document.querySelector(".success.transfer").style.display = "block";
							}
						}
					}
					break;
				case "logout":
					document.getElementById("state").value = 1;
					document.getElementById("userlogin").value = "";
					document.querySelector(".prompt.menu").style.display = "none";
					document.querySelector(".prompt.exit").style.display = "block";
					setTimeout(function() {
						document.querySelector(".prompt.exit").style.display = "none";
						document.querySelector(".prompt.home").style.display = "block";
					}, 1500);					
					break;
				default:
					// Error command not found
					document.querySelector(".error-message").innerHTML = firstWord;
					document.querySelector(".error.not-found").style.display = "block";
					break;
			}
		}

		// console.log(firstWord); // Output the first word to the console
		// console.log(secondWord); // Output the second word to the console
		// console.log(thirdWord); // Output the third word to the console
	}
}