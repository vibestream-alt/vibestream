const accountKey = 'vibestreamAccount';
const loggedInKey = 'vibestreamLoggedIn';

function getStoredAccount() {
    const accountJson = localStorage.getItem(accountKey);
    return accountJson ? JSON.parse(accountJson) : null;
}

function saveAccount(account) {
    localStorage.setItem(accountKey, JSON.stringify(account));
}

function setLoggedInUser(account) {
    localStorage.setItem(loggedInKey, JSON.stringify(account));
}

function getLoggedInUser() {
    const userJson = localStorage.getItem(loggedInKey);
    return userJson ? JSON.parse(userJson) : null;
}

function clearLoggedInUser() {
    localStorage.removeItem(loggedInKey);
}

function updateAuthUI() {
    const loginButton = document.getElementById('loginButton');
    const userWelcome = document.getElementById('userWelcome');
    const user = getLoggedInUser();

    if (!loginButton || !userWelcome) return;

    if (user) {
        loginButton.textContent = 'Logga ut';
        loginButton.classList.remove('login-button');
        loginButton.classList.add('logout-button');
        userWelcome.textContent = `Inloggad som ${user.displayName || user.email}`;
    } else {
        loginButton.textContent = 'Logga in';
        loginButton.classList.remove('logout-button');
        loginButton.classList.add('login-button');
        userWelcome.textContent = '';
    }
}

function clearMessages() {
    document.getElementById('signinMessage').textContent = '';
    document.getElementById('signupMessage').textContent = '';
}

function openLoginModal() {
    document.getElementById('loginModal').classList.add('active');
    showTab('signin');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
    clearMessages();
}

function showTab(tabName) {
    const signinTab = document.getElementById('signinTab');
    const signupTab = document.getElementById('signupTab');
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');

    if (tabName === 'signup') {
        signinTab.classList.remove('active');
        signupTab.classList.add('active');
        signinForm.classList.remove('active');
        signupForm.classList.add('active');
    } else {
        signinTab.classList.add('active');
        signupTab.classList.remove('active');
        signinForm.classList.add('active');
        signupForm.classList.remove('active');
    }
}

function handleSignin(event) {
    event.preventDefault();
    const email = document.getElementById('signinEmail').value.trim().toLowerCase();
    const password = document.getElementById('signinPassword').value;
    const message = document.getElementById('signinMessage');
    const account = getStoredAccount();

    if (!email || !password) {
        message.textContent = 'Fyll i både e-post och lösenord.';
        return;
    }

    if (!account || account.email !== email) {
        message.textContent = 'Inget konto hittades med den här e-posten. Skapa ett konto först.';
        return;
    }

    if (account.password !== password) {
        message.textContent = 'Fel lösenord. Försök igen.';
        return;
    }

    setLoggedInUser(account);
    updateAuthUI();
    closeLoginModal();
    alert('Du är inloggad som ' + account.displayName + '.');
}

function handleSignup(event) {
    event.preventDefault();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value;
    const displayName = document.getElementById('signupName').value.trim();
    const message = document.getElementById('signupMessage');
    const existingAccount = getStoredAccount();

    if (!email || !password || !displayName) {
        message.textContent = 'Fyll i alla fält för att skapa ett konto.';
        return;
    }

    if (existingAccount && existingAccount.email === email) {
        message.textContent = 'Ett konto med den här e-posten finns redan. Logga in istället.';
        return;
    }

    const account = { email, password, displayName };
    saveAccount(account);
    setLoggedInUser(account);
    updateAuthUI();
    closeLoginModal();
    alert('Ditt konto är skapat och du är inloggad som ' + displayName + '.');
}

function initializeAuth() {
    const loginButton = document.getElementById('loginButton');
    const closeLoginModalButton = document.getElementById('closeLoginModal');
    const signinTab = document.getElementById('signinTab');
    const signupTab = document.getElementById('signupTab');
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');

    if (loginButton) {
        loginButton.addEventListener('click', () => {
            if (getLoggedInUser()) {
                clearLoggedInUser();
                updateAuthUI();
                alert('Du har loggats ut.');
            } else {
                openLoginModal();
            }
        });
    }

    if (closeLoginModalButton) {
        closeLoginModalButton.addEventListener('click', closeLoginModal);
    }

    if (signinTab) {
        signinTab.addEventListener('click', () => showTab('signin'));
    }

    if (signupTab) {
        signupTab.addEventListener('click', () => showTab('signup'));
    }

    if (signinForm) {
        signinForm.addEventListener('submit', handleSignin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    updateAuthUI();
}

window.addEventListener('DOMContentLoaded', initializeAuth);
