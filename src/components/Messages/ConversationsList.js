import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Paper, Typography, Box, Avatar } from "@mui/material";
import { getToken, getCurrentUserId } from "../../utils/auth";

export default function ConversationsList({ selectedConversationId, onSelect }) {
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    const fetchConversations = async () => {
      try {
        const res = await fetch("http://localhost:3001/messages/conversations", {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch conversations");
        const data = await res.json();
        setConversations(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setError("Impossible de charger les conversations");
      }
    };
    fetchConversations();
  }, []);

  const me = getCurrentUserId();

  return (
    <Paper sx={{ height: "100%", overflowY: "auto" }}>
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6">Conversations</Typography>
      </Box>
      {error && (
        <Typography color="error" sx={{ p: 2 }}>
          {error}
        </Typography>
      )}
      <List>
        {conversations.map((c) => {
          const other = c.participants?.find((p) => p.id !== me) || c.otherUser || {};
          const title = other?.name || other?.email || `Conversation #${c.id}`;
          return (
            <ListItem
              key={c.id}
              button
              selected={selectedConversationId === c.id}
              onClick={() => onSelect(c)}
            >
              <Avatar sx={{ mr: 2 }}>{(title || "?").charAt(0).toUpperCase()}</Avatar>
              <ListItemText
                primary={title}
                secondary={c.lastMessage?.content || ""}
              />
            </ListItem>
          );
        })}
        {conversations.length === 0 && !error && (
          <Typography sx={{ p: 2 }} color="text.secondary">
            Aucune conversation.
          </Typography>
        )}
      </List>
    </Paper>
  );
}
