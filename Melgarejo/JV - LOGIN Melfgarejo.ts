document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = document.querySelector('.btn-submit');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = 'Verificando...';
    btn.style.opacity = '0.8';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
        console.log('Intento de login enviado.');
        
        // Aquí iría tu petición fetch a tu backend en PHP o C#
        
    }, 1000);
});