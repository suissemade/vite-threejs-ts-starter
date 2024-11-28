window.addEventListener('scroll', () => {
    console.log('Scroll event triggered');
    if (model) {
        console.log('Model exists:', model);
    } else {
        console.log('Model is not loaded yet');
    }
});
