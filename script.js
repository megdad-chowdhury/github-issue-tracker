
const searchInput = document.getElementById('search-input');
const totalIssueCount = document.getElementById('total-issue-count');
const issuesContainer = document.getElementById('issues-container');


const tabAll = document.getElementById('tab-all');
const tabOpen = document.getElementById('tab-open');
const tabClosed = document.getElementById('tab-closed');

const issueModal = document.getElementById('issue_modal');
const modalTitle = document.getElementById('modal-title');
const modalStatus = document.getElementById('modal-status');
const modalAuthor = document.getElementById('modal-author');
const modalDate = document.getElementById('modal-date');
const modalLabels = document.getElementById('modal-labels');
const modalDescription = document.getElementById('modal-description');
const modalAssignee = document.getElementById('modal-assignee');
const modalPriority = document.getElementById('modal-priority');

let allIssues = [];

let currentStatus = 'all'; 

const showSpinner = () => {
    

    issuesContainer.innerHTML = `
        <div class="col-span-full flex justify-center items-center py-20">
            <span class="loading loading-spinner loading-xl text-indigo-600"></span>
        </div>`;
};


const getLabelStyle = (label) => {
    const l = label.toLowerCase().trim();
    
    if (l.includes('bug')) {
        return {
            bgClass: 'bg-red-100 text-red-600 border-red-200',
            iconClass: 'fa-solid fa-bug text-red-600'
        };
    }
    if (l.includes('help wanted')) {
        return {
            bgClass: 'bg-amber-100 text-amber-600 border-amber-200',
            iconClass: 'fa-solid fa-life-ring text-amber-600'
        };
    }
    if (l.includes('enhancement')) {
        return {
            bgClass: 'bg-blue-100 text-blue-600 border-blue-200',
            iconClass: 'fa-solid fa-arrow-up-right-dots text-blue-600'
        };
    }
    if (l.includes('documentation') || l.includes('docs')) {
        return {
            bgClass: 'bg-purple-100 text-purple-600 border-purple-200',
            iconClass: 'fa-regular fa-file text-purple-600'
        };
    }
    if (l.includes('good first issue')) {
        return {
            bgClass: 'bg-emerald-100 text-emerald-600 border-emerald-200',
            iconClass: 'fa-regular fa-thumbs-up text-emerald-600'
        };
    }
    

    return {
        bgClass: 'bg-gray-100 text-gray-600 border-gray-200',
        iconClass: 'fa-solid fa-tag text-gray-500'
    };
};

const openIssueModal = async (id) => {
    if (!issueModal) return;

    modalTitle.innerText = "Loading details...";
    modalDescription.innerText = "Please wait while we fetch issue details.";
    modalLabels.innerHTML = "";
    
    issueModal.showModal();

    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const data = await res.json();
        const issue = data.data || data;

        modalTitle.innerText = issue.title;
        modalAuthor.innerText = issue.author || 'Unknown';
        modalDate.innerText = new Date(issue.createdAt).toLocaleDateString();
        modalDescription.innerText = issue.description;

        if (modalAssignee) {
            modalAssignee.innerText = issue.assignee || 'Unassigned';
        }


        const isOpen = issue.status.toLowerCase() === 'open';
        modalStatus.innerText = isOpen ? 'Opened' : 'Closed';
        modalStatus.className = `${isOpen ? 'bg-emerald-600' : 'bg-purple-600'} text-white font-medium text-xs px-3 py-1 rounded-full`;

        if (modalPriority) {
            modalPriority.innerText = issue.priority;
            let priorityBg = 'bg-gray-500';

            if (issue.priority.toLowerCase() === 'high') {
                priorityBg = 'bg-red-500';
            } else if (issue.priority.toLowerCase() === 'medium') {
                priorityBg = 'bg-amber-500';
            } else if (issue.priority.toLowerCase() === 'low') {
                priorityBg = 'bg-blue-500';
            }

            modalPriority.className = `${priorityBg} text-white font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider inline-block`;
        }

        if (modalLabels) {
            modalLabels.innerHTML = issue.labels.map(label => {
                const style = getLabelStyle(label);
                return `
                    <span class="${style.bgClass} text-xs font-semibold px-3 py-1 rounded-full border flex items-center gap-1.5 uppercase">
                        <i class="${style.iconClass}"></i>
                        <span>${label}</span>
                    </span>
                `;
            }).join('');
        }

    } catch (error) {
        console.error("Error fetching issue details:", error);
        modalTitle.innerText = "Error Loading Details";
        modalDescription.innerText = "Failed to load issue information. Please try again.";
    }
};


const displayIssues = (issues) => {
    issuesContainer.innerHTML = "";
    totalIssueCount.innerText = issues.length;

    issues.forEach((issue) => {
        const isOpen = issue.status.toLowerCase() === "open";

        const topBorderClass = isOpen ? 'border-t-emerald-500' : 'border-t-purple-600';
        const statusBg = isOpen ? 'bg-emerald-100' : 'bg-purple-100';
        const statusIcon = isOpen ? './assets/Open-Status.png' : './assets/Closed-Status.png';
        
        let priorityBgClass = 'bg-gray-100 text-gray-600';
        if (issue.priority.toLowerCase() === 'high') {
            priorityBgClass = 'bg-red-100 text-red-500';
        } else if (issue.priority.toLowerCase() === 'medium') {
            priorityBgClass = 'bg-amber-100 text-amber-600';
        } else if (issue.priority.toLowerCase() === 'low') {
            priorityBgClass = 'bg-blue-100 text-blue-600';
        }

        const formattedDate = new Date(issue.createdAt).toLocaleDateString();

        const card = document.createElement('div');
        card.className = `bg-white border border-gray-200 rounded-xl p-5 shadow-sm border-t-4 ${topBorderClass} max-w-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition`;

        card.innerHTML = `
            <div>
                <!-- Top Row: Status Icon & Priority Badge -->
                <div class="flex items-center justify-between mb-4">
                    <div class="w-8 h-8 rounded-full ${statusBg} flex items-center justify-center">
                        <img src="${statusIcon}" alt="${issue.status}" class="w-5 h-5">
                    </div>
                    <span class="${priorityBgClass} font-semibold text-xs px-4 py-1.5 rounded-full uppercase">
                        ${issue.priority}
                    </span>
                </div>

                <!-- Title -->
                <h3 class="font-bold text-gray-800 text-base mb-2 leading-snug">
                    ${issue.title}
                </h3>

                <!-- Description -->
                <p class="text-slate-500 text-sm mb-5 leading-relaxed line-clamp-2">
                    ${issue.description}
                </p>

                <!-- Labels with Icons -->
                <div class="flex flex-wrap items-center gap-2 mb-6">
                    ${issue.labels.map(label => {
                        const style = getLabelStyle(label);
                        return `
                            <span class="${style.bgClass} text-xs font-semibold px-3 py-1 rounded-full border flex items-center gap-1.5 uppercase">
                                <i class="${style.iconClass}"></i>
                                <span>${label}</span>
                            </span>
                        `;
                    }).join('')}
                </div>

            </div>

            <!-- Footer -->
            <div class="pt-4 border-t border-gray-200 text-sm text-slate-500 space-y-1">
                <p>#${issue.id} by ${issue.author}</p>
                <p>${formattedDate}</p>
            </div>
        `;


        card.addEventListener('click', () => {
        openIssueModal(issue.id); 
        });

        issuesContainer.appendChild(card);
    });
};


const loadIssues = () => {
    showSpinner();

    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
        .then(res => res.json())
        .then(data => {
            allIssues = data.data || data;
            displayIssues(allIssues);
            
        });
};

loadIssues();


const filterIssues = (status, selectedTab) => {
    currentStatus = status; 

    searchInput.value = '';

    [tabAll, tabOpen, tabClosed].forEach(tab => {
        tab.classList.remove('bg-indigo-600', 'text-white');
        tab.classList.add('bg-gray-100', 'text-gray-600');
    });

    selectedTab.classList.remove('bg-gray-100', 'text-gray-600');
    selectedTab.classList.add('bg-indigo-600', 'text-white');

    applyFilters();
};

tabAll.addEventListener('click', () => filterIssues('all', tabAll));
tabOpen.addEventListener('click', () => filterIssues('open', tabOpen));
tabClosed.addEventListener('click', () => filterIssues('closed', tabClosed));

const applyFilters = () => {
    const searchText = searchInput.value.toLowerCase().trim();

    const filtered = allIssues.filter(issue => {
        
        const matchesStatus = currentStatus === 'all' || issue.status.toLowerCase() === currentStatus;

        const matchesSearch = issue.title.toLowerCase().includes(searchText) || 
                              issue.description.toLowerCase().includes(searchText);

        return matchesStatus && matchesSearch;
    });

    displayIssues(filtered);
};

searchInput.addEventListener('input', applyFilters);



