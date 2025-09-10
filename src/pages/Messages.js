import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { Box, CssBaseline, Grid, Paper, Typography, Button, TextField, InputAdornment } from "@mui/material";
import ConversationsList from "../components/Messages/ConversationsList";
import ChatWindow from "../components/Messages/ChatWindow";
import SearchIcon from "@mui/icons-material/Search";
import { getToken } from "../utils/auth";
import { useSearchParams, useRouter } from "next/navigation";

export default function MessagesPage() {
  const [selected, setSelected] = useState(null);
  const [peer, setPeer] = useState(null);
  const token = getToken();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const userId = searchParams?.get("userId");
    if (!userId || !token) return;
    const ensureConversation = async () => {
      try {
        const res = await fetch("http://localhost:3001/messages/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ userId: Number(userId) }),
        });
        if (!res.ok) throw new Error("Failed to ensure conversation");
        const data = await res.json();
        setSelected({ id: data.id });
        setPeer(data.otherUser || null);
        // Clean URL
        router.replace("/Messages");
      } catch (e) {
        console.error(e);
      }
    };
    ensureConversation();
  }, [searchParams, token, router]);

  return (
    <main>
      <CssBaseline />
      <Navbar />
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2} sx={{ height: "calc(100vh - 140px)" }}>
          <Grid item xs={12} md={4} sx={{ height: "100%" }}>
            <Box sx={{ mb: 1 }}>
              <TextField fullWidth size="small" placeholder="Rechercher" InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} />
            </Box>
            <ConversationsList
              selectedConversationId={selected?.id || null}
              onSelect={(conv) => {
                setSelected(conv);
                const other = conv.otherUser || conv.participants?.find((p) => p && p.id);
                setPeer(other || null);
              }}
            />
          </Grid>
          <Grid item xs={12} md={8} sx={{ height: "100%" }}>
            {selected ? (
              <ChatWindow conversationId={selected.id} peerUser={peer} />
            ) : (
              <Paper sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography color="text.secondary">Sélectionnez une conversation</Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </main>
  );
}
