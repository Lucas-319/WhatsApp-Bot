# WhatsApp Bot - WWebJS

Este é um bot para WhatsApp utilizando a biblioteca [`whatsapp-web.js`](https://github.com/pedroslopez/whatsapp-web.js), que permite interação automatizada com mensagens e grupos no WhatsApp Web.

## Funcionalidades

- Gera um QR Code para autenticação no WhatsApp Web.
- Responde automaticamente a comandos predefinidos.
- Envia uma mensagem de resposta a pedidos de entrada em grupos.
## Comandos

> **Observação**: Os comandos disponíveis dizem respeito ao grupo de estudantes do curso de Análise e Desenvolvimento de Sistemas (ADS) do IFBA campus Salvador/BA:

- `!link`: Links úteis  
- `!discord`: Link do Discord  
- `!telegram`: Link do Telegram  
- `!sala`: Link do aplicativo para encontrar a sua sala  
- `!calendario`: Link do calendário acadêmico  
- `!suap`: Link do SUAP  
- `!ping`: Retorna "pong 🏓"  
- `!help`: Lista todos os comandos disponíveis.  

## Como usar

1. **Defina o arquivo `.env`**  
   Crie um arquivo `.env` na raiz do projeto contendo as informações relacionadas aos IDs dos chats e o número da pessoa que receberá notificações de novas solicitações de entrada no grupo.

   Exemplo de `.env`:
   ```properties
   CHAT_ID_TESTE=129326392407548463@g.us
   CHAT_ID_TEST_BY_LUCAS=130361413834910049@g.us
   CHAT_ID=551293631886-1433433949@g.us
   CHAT_JULIA=551199999999@c.us
   ```

2. **Construa a imagem Docker**  
   Execute o comando para construir a imagem Docker:
   ```bash
   docker build --no-cache -t <image.name> .
   ```

3. **Rode o contêiner Docker**  
   Execute o contêiner com o seguinte comando:
   ```bash
   docker run -d --name <container.name> --env-file .env -p 3000:3000 -p 8080:8080 <image.name>
   ```

4. **Escaneie o QR Code**  
   Para autenticar o bot no WhatsApp Web, escaneie o QR Code. Você pode acessá-lo de duas formas:
   - Pelo console do contêiner:
     ```bash
     docker logs -f <container.name>
     ```
   - Pelo endpoint HTTP:
     ```
     http://<IP_DA_VM>:8000/qrcode
     ```

## Observações

- O bot precisa estar autenticado no WhatsApp Web para funcionar.
- O QR Code expira rapidamente, sendo necessário regenerá-lo caso demore muito para escanear.

## Eventos implementados

- **`group_membership_request`**: Responde automaticamente a pedidos de entrada em grupos.
- **`group_join`**: Dá boas-vindas a novos membros em grupos.
- **`message`**: Responde automaticamente a comandos predefinidos.
- **`auth_failure`**: Captura falhas de autenticação.
- **`disconnected`**: Notifica quando o cliente é desconectado.
- **`ready`**: Indica que o cliente está pronto para uso.

## Contribuidores

- [Julia](https://github.com/nanotecnologista)
- [Kaua](https://github.com/KauaBR0)

## Contribuições

Sinta-se à vontade para contribuir para este projeto enviando Pull Requests ou relatando problemas na seção de Issues.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).