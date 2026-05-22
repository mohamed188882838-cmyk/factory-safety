document.addEventListener('DOMContentLoaded', function() {
    // Add click effects to settings items
    const settingsItems = document.querySelectorAll('.settings-item');
    settingsItems.forEach(item => {
        item.addEventListener('click', function() {
            const label = this.querySelector('.item-label').textContent;
            console.log('Navigating to: ' + label);
            // Add a simple ripple or highlight effect
            this.style.backgroundColor = '#e2e8f0';
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 200);
        });
    });

    // Logout button handler
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                alert('Logging out...');
            }
        });
    }
});
