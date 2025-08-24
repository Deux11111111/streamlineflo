<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>N8n Chat Test</title>
    <link href="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css" rel="stylesheet" />
</head>
<body>
    <h1>Testing Official N8n Chat Widget</h1>
    <p>The chat widget should appear in the bottom right corner.</p>
    
    <script type="module">
        import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

        createChat({
            webhookUrl: 'https://adrianzap.app.n8n.cloud/webhook/c803253c-f26b-4a80-83a5-53fad70dbdb6/chat',
            mode: 'window',
            showWelcomeScreen: true,
            initialMessages: ['Hello! I am your AI assistant.']
        });
    </script>
</body>
</html>
