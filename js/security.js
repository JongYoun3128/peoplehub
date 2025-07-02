function toggleAccordion(header) {
    const item = header.parentElement;
    const content = item.querySelector('.accordion-content');
    const isActive = item.classList.contains('active');

    if (isActive) {
        item.classList.remove('active');
        content.classList.remove('active');
    } else {
        item.classList.add('active');
        content.classList.add('active');
    }
}
