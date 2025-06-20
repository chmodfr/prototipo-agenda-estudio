# **App Name**: SessionSnap

## Core Features:

- Visualização Semanal de Disponibilidade: Exibir uma visualização semanal do calendário (segunda a sábado, das 09:00 às 19:00) com horários.
- Indicadores Dinâmicos de Disponibilidade: Indicar visualmente a disponibilidade de horários com marcas de seleção (✅) para horários livres e cruzes (❌) para horários reservados/bloqueados, com base nas reservas extraídas do Firestore.
- Cálculo de Buffer: Calcular horários bloqueados com base nas reservas existentes e no buffer obrigatório de 1 hora.
- Exportar como Imagem: Exportar a visualização semanal de disponibilidade como uma imagem estática.
- Exportar como PDF: Exportar a visualização semanal de disponibilidade como um arquivo PDF.
- Compartilhar via WhatsApp/Email com ofertas inteligentes: Gerar mensagem sugerida, incluindo o nome do estúdio e o link para o calendário de reservas, que o usuário pode usar rapidamente no WhatsApp ou e-mail, sem sair da janela do navegador. A IA é empregada para analisar os dados de reserva existentes para possíveis ofertas de serviços futuros com base no histórico de reservas de cada cliente. Se as ofertas de serviço puderem ser geradas dessa forma, isso será indicado na mensagem. Este modelo de IA funciona como uma ferramenta para compor mensagens de vendas.

## Style Guidelines:

- Cor primária: Lavanda Escuro (#947EB0) para representar o ambiente criativo e ligeiramente misterioso de um estúdio de gravação.
- Cor de fundo: Cinza muito escuro (#212429) para enfatizar o conteúdo na tela, com texto claro para facilitar a leitura em ambientes de estúdio de gravação mais escuros.
- Cor de destaque: Roxo Elétrico (#BF77F6) para elementos interativos para dar uma explosão de cor inesperada, permanecendo em harmonia com a cor primária roxa.
- Fonte do corpo: 'Inter', sans-serif, para fornecer uma experiência de interface do usuário limpa e legível, adequada tanto para títulos quanto para o corpo do texto.
- Use ícones simples e contornados para o status de disponibilidade (marca de seleção, cruz).
- Exiba o calendário em um formato tabular claro para facilitar a identificação do horário.