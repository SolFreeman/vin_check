const loadingReport = document.querySelector('.loading-report');

if (loadingReport) {
    const progress = loadingReport.querySelector('.loading-progress');
    const progressValue = loadingReport.querySelector('.loading-progress__value');
    const status = loadingReport.querySelector('.loading-report__status');
    const checks = [...loadingReport.querySelectorAll('.loading-check')];
    const duration = Number(loadingReport.dataset.loadingDuration) || 18000;
    const startedAt = performance.now();

    const renderLoadingProgress = (now) => {
        const percentage = Math.min(Math.max(((now - startedAt) / duration) * 100, 0), 100);
        const currentIndex = Math.min(Math.floor((percentage / 100) * checks.length), checks.length - 1);

        progressValue.style.width = `${percentage}%`;
        progress.setAttribute('aria-valuenow', String(Math.round(percentage)));

        checks.forEach((check, index) => {
            check.classList.toggle('is-active', index <= currentIndex);
            check.classList.toggle('is-current', index === currentIndex);
        });

        status.textContent = percentage === 100 ? 'Your VIN report is ready.' : checks[currentIndex].dataset.message;

        const currentCheck = checks[currentIndex];
        const scroller = currentCheck.closest('.loading-checks__scroller');
        if (window.innerWidth < 768) {
            scroller.scrollTo({
                left: Math.max(currentCheck.offsetLeft - 16, 0),
                behavior: 'smooth'
            });
        }

        if (percentage < 100) requestAnimationFrame(renderLoadingProgress);
    };

    requestAnimationFrame(renderLoadingProgress);
}
