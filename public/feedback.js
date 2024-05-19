class Feedback {
    constructor(elementId) {
        this.feedbackElement = document.getElementById(elementId);
    }

    showFeedback(message, isSuccess) {
        // Forçar a leitura da mensagem pelo leitor de tela
        this.feedbackElement.style.display = 'none';
        this.feedbackElement.innerText = '';
        setTimeout(() => {
            this.feedbackElement.style.display = 'block';
            this.feedbackElement.innerText = message;
            this.feedbackElement.className = isSuccess ? 'success' : 'error';
        }, 100); // Pequeno atraso para garantir que a mudança de texto seja detectada

        // Ocultar a mensagem após 3 segundos
        setTimeout(() => {
            this.feedbackElement.style.display = 'none';
        }, 3000);
    }
}

export default Feedback;
