import React, { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { getToken } from "../utils/auth";
import UsersList from "../components/Messages/ConversationsList"; // renomme le fichier en UsersList.js si nécessaire
import ChatWindow from "../components/Messages/ChatWindow";
import Navbar from "../components/Navbar";

export default function MessagesPage() {
  const token = getToken();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [convLoading, setConvLoading] = useState(false);
  const [convError, setConvError] = useState("");

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (r.ok) {
          const data = await r.json();
          setCurrentUser(data);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [token]);

  const openConversation = async (user) => {
    if (!user || !token) return;
    setSelectedUser(user);
    setConvError("");
    setConvLoading(true);
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ peerUserId: user.id }),
      });
      if (!r.ok) throw new Error("Conversation error");
      const data = await r.json();
      const newId = data.id || data.conversationId || data.conversation?.id;
      if (!newId) throw new Error("ID de conversation manquant");
      setConversationId(newId);
    } catch (e) {
      console.error(e);
      setConversationId(null);
      setConvError("Impossible d'ouvrir la conversation.");
    } finally {
      setConvLoading(false);
    }
  };

  return (
    <main style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />
      <Box sx={{ flex: 1, display: "flex", p: 2, gap: 2, overflow: "hidden" }}>
        <Paper sx={{ width: 300, display: "flex", flexDirection: "column" }}>
          <Box sx={{ p: 1.5, pb: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Utilisateurs
            </Typography>
          </Box>
          <UsersList
            onSelectUser={openConversation}
            selectedUserId={selectedUser?.id}
            currentUserId={currentUser?.id}
          />
        </Paper>

        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          {convError && (
            <Paper sx={{ p: 2, mb: 1 }}>
              <Typography color="error">{convError}</Typography>
            </Paper>
          )}
          {conversationId ? (
            <ChatWindow
              conversationId={conversationId}
              peerUser={selectedUser}
              currentUserId={currentUser?.id}
            />
          ) : (
            <Paper
              sx={{
                flex: 1,
                p: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Sélectionne un utilisateur pour commencer une conversation.
              </Typography>
            </Paper>
          )}
          {convLoading && (
            <Typography
              variant="caption"
              sx={{ mt: 1, color: "text.secondary", textAlign: "center" }}
            >
              Ouverture de la conversation...
            </Typography>
          )}
        </Box>
      </Box>
    </main>
  );
}