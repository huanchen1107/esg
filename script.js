document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step-content-wrapper');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const stepLines = document.querySelectorAll('.step-line');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    
    let currentStep = 1;
    const totalSteps = steps.length;

    function updateStepUI() {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 === currentStep);
        });

        stepIndicators.forEach((indicator, index) => {
            const stepNum = index + 1;
            indicator.classList.toggle('active', stepNum === currentStep);
            indicator.classList.toggle('completed', stepNum < currentStep);
            if (stepNum > currentStep) {
                indicator.classList.remove('completed'); // Ensure future steps aren't marked completed
            }
        });
        
        stepLines.forEach((line, index) => {
            const stepNum = index + 1; // line is between stepNum and stepNum+1
            line.classList.toggle('active', stepNum === currentStep -1 && currentStep > 1);
            line.classList.toggle('completed', stepNum < currentStep -1);
             if (stepNum >= currentStep -1) {
                 line.classList.remove('completed');
                 if (stepNum > currentStep -1) line.classList.remove('active');
             }
        });


        prevButton.disabled = currentStep === 1;
        if (currentStep === totalSteps) {
            nextButton.innerHTML = '完成 <i class="fas fa-check"></i>';
        } else {
            nextButton.innerHTML = '下一步 <i class="fas fa-arrow-right"></i>';
        }
    }

    function handleNext() {
        if (currentStep < totalSteps) {
            // Mark previous line as completed when moving forward
            if (currentStep > 0 && currentStep -1 < stepLines.length) {
                 stepLines[currentStep-1].classList.add('completed');
                 stepLines[currentStep-1].classList.remove('active');
            }
            currentStep++;
            updateStepUI();
        } else {
            // Handle submission or final action
            alert('已完成所有步驟！');
            // Potentially redirect or show a final message
        }
    }

    function handlePrev() {
        if (currentStep > 1) {
             // Un-complete the line before the now current step
            if (currentStep - 2 >= 0 && currentStep - 2 < stepLines.length) {
                stepLines[currentStep-2].classList.remove('completed');
                stepLines[currentStep-2].classList.add('active'); // This line should now be active
            }
             // If there's a line after the new current step, ensure it's not active/completed
            if (currentStep - 1 < stepLines.length) {
                stepLines[currentStep-1].classList.remove('active');
                stepLines[currentStep-1].classList.remove('completed');
            }
            currentStep--;
            updateStepUI();
        }
    }

    nextButton.addEventListener('click', handleNext);
    prevButton.addEventListener('click', handlePrev);

    // File input display logic
    function setupFileInput(inputId, listId) {
        const fileInput = document.getElementById(inputId);
        const fileListDiv = document.getElementById(listId);
        if (fileInput && fileListDiv) {
            fileInput.addEventListener('change', (event) => {
                fileListDiv.innerHTML = ''; // Clear previous list
                const files = event.target.files;
                if (files.length > 0) {
                    Array.from(files).forEach(file => {
                        const fileItem = document.createElement('div');
                        fileItem.classList.add('file-list-item');
                        fileItem.textContent = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
                        fileListDiv.appendChild(fileItem);
                    });
                } else {
                    fileListDiv.textContent = '未選擇任何文件。';
                }
            });
        }
    }

    setupFileInput('regulation-files', 'regulation-files-list');
    setupFileInput('product-files', 'product-files-list');
    setupFileInput('excel-template', 'excel-template-list');

    // Placeholder actions for buttons in steps
    const computeButton = document.getElementById('compute-button');
    const computationStatus = document.getElementById('computation-status');
    if (computeButton && computationStatus) {
        computeButton.addEventListener('click', () => {
            computationStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 系統計算中，請稍候...';
            setTimeout(() => {
                computationStatus.innerHTML = '<i class="fas fa-check-circle"></i> 計算完成！您可以前往下一步。';
            }, 2000);
        });
    }

    const fillExcelButton = document.getElementById('fill-excel-button');
    const fillStatus = document.getElementById('fill-status');
    if (fillExcelButton && fillStatus) {
        fillExcelButton.addEventListener('click', () => {
            fillStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 系統正在填寫Excel，請稍候...';
            setTimeout(() => {
                fillStatus.innerHTML = '<i class="fas fa-check-circle"></i> Excel欄位已填寫完成！您可以前往下一步。';
            }, 2000);
        });
    }
    
    const exportButton = document.getElementById('export-button');
    const exportStatus = document.getElementById('export-status');
    if (exportButton && exportStatus) {
        exportButton.addEventListener('click', () => {
            exportStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在準備報告下載...';
            // Simulate file download
            setTimeout(() => {
                exportStatus.innerHTML = '<i class="fas fa-check-circle"></i> 報告已準備完成，下載即將開始。';
                // Actual download logic would go here, e.g., creating a blob and an anchor tag
                const dummyReportContent = "這是您的碳足跡報告內容。";
                const blob = new Blob([dummyReportContent], { type: 'text/plain;charset=utf-8' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = '碳足跡報告.txt';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href); // Clean up
            }, 2000);
        });
    }

    // Initialize UI
    updateStepUI();
});

