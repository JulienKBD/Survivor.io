import React, { useEffect, useState } from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { getToken } from "../../utils/auth";

export default function UsersList({ onSelectUser, selectedUserId, currentUserId }) {
  const token = getToken();
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      try {
        const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await r.json();
        const list = Array.isArray(data) ? data : (data.users || []);
        setUsers(list.filter(u => u.id !== currentUserId));
      } catch (e) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, currentUserId]);

  const filtered = users.filter(u =>
    (u.name || u.email || "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 1 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Rechercher"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {loading && <CircularProgress size={22} sx={{ m: 2 }} />}
        {!loading && filtered.length === 0 && (
          <Typography variant="body2" sx={{ p: 2 }}>Aucun utilisateur</Typography>
        )}
        <List dense>
          {filtered.map(u => (
            <ListItemButton
              key={u.id}
              selected={u.id === selectedUserId}
              onClick={() => onSelectUser?.(u)}
            >
              <ListItemText
                primary={u.name || u.email}
                secondary={u.email && u.name ? u.email : null}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
}