import {
  Box,
  Typography,
  Avatar,
  Grid2 as Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  useGetChatByIdQuery,
  useGetChatsByUserIdQuery,
} from '../../../../services/chatApi';
import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { selectAuth } from '../../../../redux/slices/authSlice';
import { getApiImageUrl } from '../../../../utils/baseEnvironment';
import { UserLayout } from '../../../../components/templates/UserLayout';
import MessagesConversation from '../../../messages/organisms/molecules/MessagesConversation';
import { useParams, useNavigate } from 'react-router-dom';

export default function ChatComponent() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const userID = useAppSelector(selectAuth)?.user?.id;

  const {
    data: chatUser,
    isLoading,
  } = useGetChatsByUserIdQuery(userID, { skip: !userID });
  const chats = chatUser?.data || [];

  const {
      data: singleChatUser,
    } = useGetChatByIdQuery(chatId, { skip: !chatId });

  const [selectedChat, setSelectedChat] = useState<any>(null);
  const listRef = useRef(null);

  // Handle chat selection from URL param or default selection
  useEffect(() => {
    if (chatId && singleChatUser?.data) {
      // If there's a chatId in URL and we have the data, use it
      setSelectedChat(singleChatUser.data);
    } else if (!chatId && chats.length > 0 && !selectedChat) {
      // If no chatId in URL, select first chat and update URL
      setSelectedChat(chats[0]);
    }
  }, [chatId, singleChatUser, chats, selectedChat, navigate]);

  // Handle chat selection - navigate to the chat URL
  const handleChatSelect = (chat: any) => {
    navigate(`/messages/${chat.id}`);
  };

  return (

    <UserLayout showFooter={false}>
      <Grid container>
      {isMobile && chatId?
      null :
      <Grid size={{ xs: 12, md: 4 }} sx={{ border: '1px solid #ccc', borderRadius: '8px', minHeight: { xs: '300px', md: '500px' } }}>
        {/* Lista de chats - Scroll vertical */}
        <Box
          sx={{
            // border: '1px solid #ccc',
            // borderTopLeftRadius: '8px',
            // borderBottomLeftRadius: '8px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            // p:5,
          }}
        >
          <List
            ref={listRef}
            sx={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'auto',
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#673ab7',
                borderRadius: '3px',
              },
            }}
          >
            {isLoading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              chats.map((chat: any) => (
                <ListItem
                  key={chat.id}
                  disablePadding
                >
                  <ListItemButton
                    onClick={() => handleChatSelect(chat)}
                    selected={chatId === chat.id || (!chatId && selectedChat?.id === chat.id)}
                    sx={{
                      '&.Mui-selected': { backgroundColor: '#f3e5f5' },
                      '&:hover': { backgroundColor: '#f3e5f550' },
                    }}
                  >
                  <ListItemAvatar sx={{ minWidth: '72px' }}>
                    <Box sx={{ml:15}}  >
                      <Avatar
                        src={getApiImageUrl(chat.user1.avatarUrl)}
                        sx={{
                          width: 40,
                          height: 40,
                          position: 'absolute',
                          top: 5,
                          left: 25,
                        }}
                      />
                      <Avatar
                        src={getApiImageUrl(chat.user2.avatarUrl)}
                        sx={{
                          width: 40,
                          height: 40,
                          position: 'absolute',
                          top: 20,
                          left: 50,
                          border: '2px solid white',
                        }}
                      />
                    </Box>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${chat.user1.name} & ${chat.user2.name}`}
                    secondary={
                      <Typography variant="caption" color="textSecondary">
                        {new Date(chat.updatedAt).toLocaleDateString()}
                      </Typography>
                    }
                  />
                  </ListItemButton>
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Grid>}
      
        {isMobile && !chatId ?
        null: 
        <Grid size={{ xs: 12, md: 8 }} sx={{ border: '1px solid #ccc', borderRadius: '8px', minHeight: { xs: '300px', md: '500px' } }}>
          <MessagesConversation conversationId={chatId || selectedChat?.id} />
        </Grid>
}
      </Grid>
    </UserLayout>
  );
}
