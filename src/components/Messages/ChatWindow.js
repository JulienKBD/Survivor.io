import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Paper, TextField, IconButton, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { getToken } from "../../utils/auth";

export default function ChatWindow({ conversationId, peerUser, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const token = getToken();

  // Chargement + polling
  useEffect(() => {
    if (!conversationId || !token) return;
    let abort = false;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/${conversationId}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        const arr = Array.isArray(data) ? data : (data.messages || []);
        const enriched = arr.map(m => ({
          ...m,
            isMine: typeof m.isMine === "boolean" ? m.isMine : m.sender_id === currentUserId
          }));
        if (!abort) setMessages(enriched);
      } catch (e) {
        if (!abort) {
          console.error(e);
          setError("Impossible de charger les messages");
        }
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => { abort = true; clearInterval(interval); };
  }, [conversationId, token, currentUserId]);

  // Scroll bas
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !conversationId || !token) return;
    const content = input.trim();
    setInput("");
    const tempId = `tmp-${Date.now()}`;

    // Optimiste
    setMessages(prev => [
      ...prev,
      {
        id: tempId,
        content,
        created_at: new Date().toISOString(),
        sender_id: currentUserId,
        isMine: true,
        pending: true
      }
    ]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Send failed");
      const msg = await res.json();
      setMessages(prev => prev.map(m => m.id === tempId ? { ...msg, isMine: true } : m));
    } catch (e) {
      console.error(e);
      setMessages(prev => prev.filter(m => m.id !== tempId));
      setError("Envoi impossible");
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Paper sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6">
          {peerUser ? (peerUser.name || peerUser.email || "Conversation") : "Conversation"}
        </Typography>
      </Box>
      {error && (
        <Typography color="error" sx={{ p: 2 }}>
          {error}
        </Typography>
      )}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {messages.map(m => (
          <Box
            key={m.id || `${m.created_at}-${m.sender_id}`}
            sx={{
              mb: 1,
              display: "flex",
              justifyContent: m.isMine ? "flex-end" : "flex-start",
              opacity: m.pending ? 0.6 : 1
            }}
          >
            <Box
              sx={{
                maxWidth: "70%",
                p: 1.2,
                borderRadius: 2,
                bgcolor: m.isMine ? "primary.main" : "grey.200",
                color: m.isMine ? "primary.contrastText" : "text.primary"
              }}
            >
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{m.content}</Typography>
              <Typography
                variant="caption"
                color={m.isMine ? "#e3f2fd" : "text.secondary"}
                sx={{ display: "block", mt: 0.5 }}
              >
                {new Date(m.created_at || Date.now()).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        ))}
        <div ref={bottomRef} />
      </Box>
      <Box sx={{ p: 1, borderTop: "1px solid", borderColor: "divider" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            fullWidth
            size="small"
            placeholder="Votre message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            multiline
            maxRows={4}
          />
          <IconButton color="primary" onClick={sendMessage} aria-label="Envoyer">
            <SendIcon />
          </IconButton>
        </Stack>
      </Box>
    </Paper>
  );
}