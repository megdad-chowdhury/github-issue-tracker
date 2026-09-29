
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

const showSpinner = () => {
    

    issuesContainer.innerHTML = `
        <div class="col-span-full flex justify-center items-center py-20">
            <span class="loading loading-spinner loading-xl text-indigo-600"></span>
        </div>`;
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

                <!-- Labels -->
                <div class="flex flex-wrap items-center gap-2 mb-6">
                    ${issue.labels.map(label => `
                        <span class="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full border border-gray-200 uppercase">
                            ${label}
                        </span>
                    `).join('')}
                </div>
            </div>

            <!-- Footer -->
            <div class="pt-4 border-t border-gray-200 text-sm text-slate-500 space-y-1">
                <p>#${issue.id} by ${issue.author}</p>
                <p>${formattedDate}</p>
            </div>
        `;

        issuesContainer.appendChild(card);
    });
};


const loadIssues = () => {
    showSpinner();

    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
        .then(res => res.json())
        .then(data => {
            allIssues = data.data || data;
            console.log("Api success", allIssues);
            displayIssues(allIssues);
            
        });
};

loadIssues();


