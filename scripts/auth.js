// Authentication System
class AuthSystem {
    constructor() {
        this.userManager = new UserManager();
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.checkRememberMe();
    }
    
    bindEvents() {
        // Login/Register navigation
        document.getElementById('showRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('registerPage');
        });
        
        document.getElementById('showLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('loginPage');
        });
        
        // Login form
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        // Register form
        document.getElementById('registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
        
        // Password strength indicator
        const passwordInput = document.getElementById('registerPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                this.updatePasswordStrength(e.target.value);
            });
        }
    }
    
    showPage(pageId) {
        // Hide all auth pages
        document.querySelectorAll('.auth-page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }
    
    async handleLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Clear previous errors
        this.clearErrors();
        
        // Validate
        if (!email || !password) {
            this.showError('loginPasswordError', 'Please fill in all fields');
            return;
        }
        
        // Show loading state
        const submitBtn = document.querySelector('#loginForm .btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        submitBtn.disabled = true;
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
            const result = this.userManager.login(email, password);
            
            if (result.success) {
                // Save remember me preference
                if (rememberMe) {
                    localStorage.setItem('fatal_exe_remember_email', email);
                } else {
                    localStorage.removeItem('fatal_exe_remember_email');
                }
                
                // Show success message
                this.showToast('Login successful!', 'success');
                
                // Redirect to app
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showError('loginPasswordError', result.message);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            this.showError('loginPasswordError', 'An error occurred. Please try again.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    async handleRegister() {
        const firstName = document.getElementById('registerFirstName').value.trim();
        const lastName = document.getElementById('registerLastName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const termsAgreed = document.getElementById('termsAgreement').checked;
        
        // Clear previous errors
        this.clearErrors();
        
        // Validate
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            this.showError('registerFirstNameError', 'Please fill in all fields');
            return;
        }
        
        if (!termsAgreed) {
            this.showError('registerConfirmPasswordError', 'You must agree to the terms and conditions');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showError('registerConfirmPasswordError', 'Passwords do not match');
            return;
        }
        
        if (password.length < 8) {
            this.showError('registerPasswordError', 'Password must be at least 8 characters long');
            return;
        }
        
        // Show loading state
        const submitBtn = document.querySelector('#registerForm .btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
            const result = this.userManager.register(firstName, lastName, email, password);
            
            if (result.success) {
                // Auto login after registration
                this.userManager.login(email, password);
                
                // Show success message
                this.showToast('Account created successfully!', 'success');
                
                // Redirect to app
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                this.showError('registerEmailError', result.message);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            this.showError('registerEmailError', 'An error occurred. Please try again.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    updatePasswordStrength(password) {
        const bars = document.querySelectorAll('.strength-bar');
        bars.forEach(bar => bar.classList.remove('active'));
        
        if (password.length === 0) return;
        
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Complexity checks
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        // Cap strength at 4
        strength = Math.min(strength, 4);
        
        // Activate bars
        for (let i = 0; i < strength; i++) {
            if (bars[i]) {
                bars[i].classList.add('active');
                
                // Set color based on strength
                if (strength <= 2) {
                    bars[i].style.backgroundColor = 'var(--danger)';
                } else if (strength === 3) {
                    bars[i].style.backgroundColor = 'var(--warning)';
                } else {
                    bars[i].style.backgroundColor = 'var(--success)';
                }
            }
        }
    }
    
    checkRememberMe() {
        const rememberedEmail = localStorage.getItem('fatal_exe_remember_email');
        if (rememberedEmail) {
            document.getElementById('loginEmail').value = rememberedEmail;
            document.getElementById('rememberMe').checked = true;
        }
    }
    
    clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
            el.classList.remove('show');
        });
    }
    
    showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.classList.add('show');
        }
    }
    
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastIcon = document.getElementById('toastIcon');
        const toastMessage = document.getElementById('toastMessage');
        
        if (!toast || !toastIcon || !toastMessage) return;
        
        // Set icon based on type
        switch (type) {
            case 'success':
                toastIcon.className = 'fas fa-check-circle';
                toastIcon.style.color = 'var(--success)';
                break;
            case 'error':
                toastIcon.className = 'fas fa-exclamation-circle';
                toastIcon.style.color = 'var(--danger)';
                break;
            case 'warning':
                toastIcon.className = 'fas fa-exclamation-triangle';
                toastIcon.style.color = 'var(--warning)';
                break;
            default:
                toastIcon.className = 'fas fa-info-circle';
                toastIcon.style.color = 'var(--info)';
        }
        
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        // Auto hide
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Password reset functionality
    async requestPasswordReset(email) {
        // In a real app, this would send an email with reset link
        // For demo, we'll just show a message
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (this.userManager.getUserByEmail(email)) {
            this.showToast('Password reset email sent. Check your inbox.', 'info');
            return true;
        } else {
            this.showToast('No account found with that email.', 'error');
            return false;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});
