document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("auth-form");
  const formTitle = document.getElementById("form-title");
  const formSubtitle = document.getElementById("form-subtitle");
  const nameGroup = document.getElementById("name-group");
  const loginOptions = document.getElementById("login-options");
  const submitBtn = document.getElementById("submit-btn");
  const switchModeBtn = document.getElementById("switch-mode-btn");
  const toggleText = document.getElementById("toggle-text");
  const alertBox = document.getElementById("alert-box");

  const nameInput = document.getElementById("full-name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const togglePasswordBtn = document.getElementById("toggle-password");
  const rememberCheckbox = document.getElementById("remember-me");
  const forgotPasswordLink = document.getElementById("forgot-password");

  let isSignUp = false;

  // Load saved email if "Remember Me" was previously used
  const savedEmail = localStorage.getItem("rememberedEmail");
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberCheckbox.checked = true;
  }

  // Toggle Password Visibility
  togglePasswordBtn.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePasswordBtn.textContent = isHidden ? "Hide" : "Show";
    togglePasswordBtn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
  });

  // Switch between Sign In and Sign Up
  function toggleAuthMode() {
    isSignUp = !isSignUp;
    clearErrors();
    hideAlert();

    if (isSignUp) {
      formTitle.textContent = "Create an Account";
      formSubtitle.textContent = "Fill in your details to get started";
      nameGroup.classList.remove("hidden");
      loginOptions.classList.add("hidden");
      submitBtn.textContent = "Sign Up";
      toggleText.innerHTML = `Already have an account? <button type="button" id="switch-mode-btn" class="link-btn">Sign In</button>`;
    } else {
      formTitle.textContent = "Welcome Back";
      formSubtitle.textContent = "Enter your credentials to access your account";
      nameGroup.classList.add("hidden");
      loginOptions.classList.remove("hidden");
      submitBtn.textContent = "Sign In";
      toggleText.innerHTML = `Don't have an account? <button type="button" id="switch-mode-btn" class="link-btn">Sign Up</button>`;
    }

    // Re-bind click event to newly rendered button
    document.getElementById("switch-mode-btn").addEventListener("click", toggleAuthMode);
  }

  switchModeBtn.addEventListener("click", toggleAuthMode);

  // Forgot Password demo handler
  forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email || !isValidEmail(email)) {
      showAlert("Please enter a valid email address first to reset your password.", "error");
      emailInput.focus();
      return;
    }
    showAlert(`Password reset link sent to ${email}.`, "success");
  });

  // Validation Helpers
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setError(input, errorId, message) {
    input.classList.add("invalid");
    document.getElementById(errorId).textContent = message;
  }

  function clearErrors() {
    [nameInput, emailInput, passwordInput].forEach((input) => input.classList.remove("invalid"));
    ["name-error", "email-error", "password-error"].forEach((id) => {
      document.getElementById(id).textContent = "";
    });
  }

  function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
  }

  function hideAlert() {
    alertBox.className = "alert hidden";
  }

  // Form Submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();
    hideAlert();

    let isValid = true;
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (isSignUp && name.length < 2) {
      setError(nameInput, "name-error", "Please enter your full name.");
      isValid = false;
    }

    if (!isValidEmail(email)) {
      setError(emailInput, "email-error", "Please enter a valid email address.");
      isValid = false;
    }

    if (password.length < 8) {
      setError(passwordInput, "password-error", "Password must be at least 8 characters.");
      isValid = false;
    }

    if (!isValid) return;

    // Handle Remember Me storage
    if (!isSignUp) {
      if (rememberCheckbox.checked) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
    }

    // Simulated authentication response (replace with your fetch() API call)
    const actionText = isSignUp ? "Account created! Welcome," : "Successfully signed in as";
    showAlert(`${actionText} ${email}`, "success");
  });
});