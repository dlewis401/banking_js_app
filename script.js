// Fixes missing gap property in older safari versions
function checkFlexGap() {
    var flex = document.createElement("div");
    flex.style.display = "flex";
    flex.style.flexDirection = "column";
    flex.style.rowGap = "1px";
    flex.appendChild(document.createElement("div"));
    flex.appendChild(document.createElement("div"));
    document.body.appendChild(flex);
    var isSupported = flex.scrollHeight === 1;
    flex.parentNode.removeChild(flex);
    console.log(isSupported);
    if (!isSupported) document.body.classList.add("no-flexbox-gap");
};

checkFlexGap();


// HTML Elements
const username_account = document.querySelector('#user-input');
const password_account = document.querySelector('#pass-input');
const login_button = document.querySelector('#button-login');
const current_account_text = document.querySelector('#current_account_label');
const current_balance_text = document.querySelector('#current_balance_label');
const transfer_to_account = document.querySelector('#transfer_to_account');
const transfer_to_amount = document.querySelector('#transfer_amount');
const transfer_to_button = document.querySelector('#transfer_to_button');
const transaction_container = document.querySelector('.transaction-container');
const transaction_box = document.querySelector('.transaction-box');
const loan_amount_text = document.querySelector('#LoanAmountNumber');
const request_loan_button = document.querySelector('#request_loan_button');
const main_app_hidden = document.querySelector('.hidden');

// Date variables
const current_date = new Date();
const day = current_date.getDate();
const month = current_date.getMonth();
const year = current_date.getFullYear();
const time = current_date.getTime();

// Object of the bank accounts
const accounts = {
	account_lewis: {
		name: "Lewis David",
		currentBalance: 50000,
		transactions: [],
		password: "pass123"
	},

	account_janeDoe: {
		name: "Jane Doe",
		currentBalance: 3,
		transactions: [],
		password: "pass111"
	}
}

// Array that holds bank account objects
let accountsInArray = [accounts.account_lewis, accounts.account_janeDoe]

// Create usernames
const createUsernames = () => {
	accountsInArray.forEach(user => {
		let username = user.name.split(' ').map(name => name[0]).join('').toLowerCase();
		user.username = username;
	})
};

// Call function to make usernames
createUsernames(accounts);


// Empty declaration of currentAccount (to override later)
let currentAccount;


// When the login button is clicked, find the account with the correct password. This also turns the .hidden CSS opacity to 100.
login_button.addEventListener('click', function(event) {
	event.preventDefault();

	currentAccount = accountsInArray.find(userAccount => {
		return userAccount.username === username_account.value.toLowerCase() && userAccount.password === password_account.value.toLowerCase();
	});
	
	if (currentAccount) {
		main_app_hidden.classList.remove('hidden');
		updateUI(currentAccount.transactions, '', 'transfer', 0)
		current_account_text.innerHTML = `<strong>Current Account:</strong> ${currentAccount.name}`
		current_balance_text.innerHTML = `<strong>Current Balance:</strong> £${currentAccount.currentBalance}`
	} else {
		// Nothing
	}
});

let index = 0;

// Update UI Function. This clears all HTML & Adds the transactions of the user when the array length is > 0
const updateUI = (transactions) => {
	transaction_container.innerHTML = '';
	transfer_to_account.value = "";
	transfer_to_amount.value = "";
	loan_amount_text.value = "";


	transactions.forEach((transaction,i) => {
		let type = transaction.type || 'Transaction'
		let reciever = transaction.recipient || 'Bank'
        const displayReceiver = transaction.amount < 0 ? 'Transferred to: ' + reciever : 'Transferred from: ' + reciever;
		const htmlBox = `
				<br><div class="transaction-box">
					<p><strong>${type}</strong></p>
					<p>Index: ${i}</p>
					<p>${displayReceiver}</p>
					<p>Amount: £${transaction.amount}</p>
					<p>Date & Time: ${String(day).padStart(2, 0)}/${String(month+1).padStart(2, 0)}/${year}: ${current_date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
				</div>`
		transaction_container.insertAdjacentHTML('beforeend', htmlBox);
	});
}

// Create Transfer. When button is clicked, check reciever account, then check conditions and then add values into transaction reviews (and then update balances accordingly)
// this took long, it made want to fucking murder this code (02:30 rn)
transfer_to_button.addEventListener('click', function(event) {
	event.preventDefault();

	const receiverAccount = accountsInArray.find(acc => acc.username === transfer_to_account.value.toLowerCase());

	if (receiverAccount.username !== currentAccount.username && receiverAccount && Number(transfer_to_amount.value) <= currentAccount.currentBalance) {
		receiverAccount.transactions.push({ amount: transfer_to_amount.value, type: 'Transfer', recipient: currentAccount.name });
        currentAccount.transactions.push({ amount: -(transfer_to_amount.value), type: 'Transfer', recipient: receiverAccount.name});

		receiverAccount.currentBalance += Number(transfer_to_amount.value);
		currentAccount.currentBalance -= Number(transfer_to_amount.value);
		
		current_balance_text.innerHTML = `<strong>Current Balance:</strong> £${currentAccount.currentBalance}`;

		updateUI(currentAccount.transactions);
	}
});

// Loan - this took so fucking long
request_loan_button.addEventListener('click', event => {
	event.preventDefault();

	if (loan_amount_text.value !== "") {
		currentAccount.transactions.push({ amount: Number(loan_amount_text.value), type: 'Loan' });
		currentAccount.currentBalance += Number(loan_amount_text.value);
		current_balance_text.innerHTML = `<strong>Current Balance:</strong> £${currentAccount.currentBalance}`;
		updateUI(currentAccount.transactions);
	};
});