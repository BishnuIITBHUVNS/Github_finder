// GitHub Portfolio Application
class GitHubPortfolio {
    constructor() {
        this.apiBase = 'https://api.github.com';
        this.languageColors = {
            "JavaScript": "#f1e05a",
            "Python": "#3572A5", 
            "Java": "#b07219",
            "TypeScript": "#2b7489",
            "HTML": "#e34c26",
            "CSS": "#563d7c",
            "C++": "#f34b7d",
            "C": "#555555",
            "Go": "#00ADD8",
            "Rust": "#dea584",
            "PHP": "#4F5D95",
            "Ruby": "#701516",
            "Swift": "#ffac45",
            "Kotlin": "#F18E33",
            "C#": "#239120",
            "Shell": "#89e051"
        };

        this.initializeEventListeners();
        this.loadDefaultUser();
    }

    initializeEventListeners() {
        const searchBtn = document.getElementById('search-btn');
        const usernameInput = document.getElementById('username-input');

        searchBtn.addEventListener('click', () => this.handleSearch());
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
    }

    async loadDefaultUser() {
        // Load default user 'octocat' on page load
        document.getElementById('username-input').value = 'octocat';
        await this.handleSearch();
    }

    async handleSearch() {
        const username = document.getElementById('username-input').value.trim();

        if (!username) {
            alert('Please enter a GitHub username');
            return;
        }

        // Reset all states
        this.resetDisplay();
        this.showLoading();

        try {
            const [userData, reposData] = await Promise.all([
                this.fetchUserData(username),
                this.fetchUserRepositories(username)
            ]);

            // Hide loading and ensure error is hidden
            this.hideLoading();
            this.ensureErrorHidden();

            this.displayProfile(userData);
            this.displayRepositories(reposData);
        } catch (error) {
            this.hideLoading();
            this.showError();
            console.error('Error fetching GitHub data:', error);
        }
    }

    async fetchUserData(username) {
        const response = await fetch(`${this.apiBase}/users/${username}`);
        if (!response.ok) {
            throw new Error(`User not found: ${response.status}`);
        }
        return await response.json();
    }

    async fetchUserRepositories(username) {
        const response = await fetch(`${this.apiBase}/users/${username}/repos?sort=updated&per_page=8`);
        if (!response.ok) {
            throw new Error(`Repositories not found: ${response.status}`);
        }
        return await response.json();
    }

    displayProfile(userData) {
        // Update profile information
        document.getElementById('user-avatar').src = userData.avatar_url;
        document.getElementById('user-avatar').alt = `${userData.login}'s avatar`;
        document.getElementById('user-name').textContent = userData.name || userData.login;
        document.getElementById('user-username').textContent = `@${userData.login}`;
        document.getElementById('user-bio').textContent = userData.bio || 'No bio available';

        // Update location if available
        const locationElement = document.getElementById('user-location');
        if (userData.location) {
            locationElement.textContent = userData.location;
            locationElement.style.display = 'inline';
        } else {
            locationElement.style.display = 'none';
        }

        // Update join date
        const joinDate = new Date(userData.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
        document.getElementById('user-joined').textContent = `Joined ${joinDate}`;

        // Update stats
        document.getElementById('user-repos').textContent = userData.public_repos;
        document.getElementById('user-followers').textContent = userData.followers;
        document.getElementById('user-following').textContent = userData.following;

        // Update GitHub link
        document.getElementById('user-github-link').href = userData.html_url;

        // Show profile section
        this.showProfile();
    }

    displayRepositories(reposData) {
        const container = document.getElementById('repos-container');
        container.innerHTML = '';

        reposData.forEach(repo => {
            const repoCard = this.createRepositoryCard(repo);
            container.appendChild(repoCard);
        });

        this.showRepositories();
    }

    createRepositoryCard(repo) {
        const card = document.createElement('div');
        card.className = 'card repo-card';

        const languageColor = this.languageColors[repo.language] || '#8b949e';
        const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        card.innerHTML = `
            <div class="repo-header">
                <a href="${repo.html_url}" target="_blank" class="repo-name">
                    ${repo.name}
                </a>
            </div>
            <p class="repo-description">
                ${repo.description || 'No description available'}
            </p>
            <div class="repo-footer">
                ${repo.language ? `
                    <div class="repo-language">
                        <span class="language-dot" style="background-color: ${languageColor}"></span>
                        <span>${repo.language}</span>
                    </div>
                ` : ''}
                <div class="repo-stats">
                    <div class="repo-stat">
                        <span>⭐</span>
                        <span>${repo.stargazers_count}</span>
                    </div>
                    <div class="repo-stat">
                        <span>🔀</span>
                        <span>${repo.forks_count}</span>
                    </div>
                </div>
                <div class="repo-updated">
                    Updated ${updatedDate}
                </div>
            </div>
        `;

        return card;
    }

    // Utility methods for showing/hiding elements
    resetDisplay() {
        this.hideProfile();
        this.hideRepositories();
        this.hideError();
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }

    showError() {
        document.getElementById('error').classList.remove('hidden');
    }

    hideError() {
        document.getElementById('error').classList.add('hidden');
    }

    ensureErrorHidden() {
        const errorElement = document.getElementById('error');
        if (!errorElement.classList.contains('hidden')) {
            errorElement.classList.add('hidden');
        }
    }

    showProfile() {
        document.getElementById('profile').classList.remove('hidden');
    }

    hideProfile() {
        document.getElementById('profile').classList.add('hidden');
    }

    showRepositories() {
        document.getElementById('repositories').classList.remove('hidden');
    }

    hideRepositories() {
        document.getElementById('repositories').classList.add('hidden');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GitHubPortfolio();
});