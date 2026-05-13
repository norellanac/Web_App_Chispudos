import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Grid2 as Grid,
  Divider,
  CircularProgress,
  Fab,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import {
  useSendMessageMutation,
  useGetChatByIdQuery,
  useAddReactionMutation,
} from '../../../../services/chatApi';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { selectAuth } from '../../../../redux/slices/authSlice';
import { getApiImageUrl } from '../../../../utils/baseEnvironment';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

const REACTIONS = [
  { type: 'like', emoji: '👍' },
  { type: 'love', emoji: '❤️' },
  { type: 'laugh', emoji: '😂' },
  { type: 'wow', emoji: '😮' },
  { type: 'sad', emoji: '👎' },
];

function MessagesConversation( {conversationId}: {conversationId: number | string}) {
  const [newMessage, setNewMessage] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const userID = useAppSelector(selectAuth)?.user?.id;
  const { chatId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const messagesConversationID = chatId || conversationId;

  const {
    data: chatUser,
  } = useGetChatByIdQuery(messagesConversationID, { skip: !messagesConversationID, pollingInterval: 60000, });

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [addReaction, { isLoading: isReacting }] = useAddReactionMutation();

  

  const selectedChat = chatUser?.data;
  // console.error({selectedChat});

  // Scroll automático optimizado
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Check if user is at bottom of messages
  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
      setShowScrollButton(!isAtBottom);
    }
  }, []);

  useEffect(() => {
    if (selectedChat?.messages && selectedChat.messages.length > 0) {
      // Scroll inmediato al cargar y suave al enviar
      const timer = setTimeout(() => {
        scrollToBottom(selectedChat.messages.length > 10 ? 'auto' : 'smooth');
      }, 100); // Small delay to ensure DOM is rendered
      
      return () => clearTimeout(timer);
    }
  }, [selectedChat?.messages, scrollToBottom]);


  // Envío de mensajes optimizado
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      await sendMessage({
        conversationId: selectedChat.id,
        senderId: userID,
        content: newMessage,
      }).unwrap();

      setNewMessage('');
      // Scroll to bottom after sending message
      setTimeout(() => {
        scrollToBottom('smooth');
      }, 100);
    } catch (err) {
      console.error('Error al enviar:', err);
    }
  };

  
  const groupMessagesByDate = useCallback((messages: any[]) => {
    // First sort all messages by creation date
    const sortedMessages = [...messages].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Group messages by date
    const groups = sortedMessages.reduce((groups: { [key: string]: any[] }, message: any) => {
      const date = new Date(message.createdAt).toLocaleDateString();
      groups[date] = groups[date] || [];
      groups[date].push(message);
      return groups;
    }, {});

    // Convert to array of [date, messages] pairs and sort by date
    const sortedGroups = Object.entries(groups).sort(([dateA], [dateB]) => {
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

    // Convert back to object to maintain the expected structure
    return Object.fromEntries(sortedGroups);
  }, []);

  const handleReactionClick = (
    event: React.MouseEvent<HTMLElement>,
    messageId: number,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessage(messageId);
  };

  const handleReactionClose = () => {
    setAnchorEl(null);
    setSelectedMessage(null);
  };

  const handleAddReaction = async (reactionType: string, emoji: string) => {
    if (selectedMessage !== null && userID) {
      try {
        await addReaction({
          userId: userID,
          reactableType: 'message',
          reactableId: selectedMessage,
          type: reactionType,
        }).unwrap();
        
        console.log('Reaction added successfully:', { type: reactionType, emoji }, 'to message:', selectedMessage);
      } catch (error) {
        console.error('Error adding reaction:', error);
      }
    }
    handleReactionClose();
  };

  // Helper function to group reactions by type and count them
  const groupReactionsByType = useCallback((reactions: { id: number; type: string; userId: number }[]) => {
    const grouped = reactions.reduce((acc, reaction) => {
      if (!acc[reaction.type]) {
        acc[reaction.type] = {
          type: reaction.type,
          count: 0,
          userIds: [],
          hasCurrentUser: false,
        };
      }
      acc[reaction.type].count += 1;
      acc[reaction.type].userIds.push(reaction.userId);
      if (reaction.userId === userID) {
        acc[reaction.type].hasCurrentUser = true;
      }
      return acc;
    }, {} as Record<string, { type: string; count: number; userIds: number[]; hasCurrentUser: boolean }>);
    
    return Object.values(grouped);
  }, [userID]);
  return (
    <Grid
          sx={{
            height: '90vh', // Full viewport height
            maxHeight: '90vh', // Prevent overflow
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fafafa',
            overflow: 'hidden', // Prevent container overflow
          }}
        >
          {selectedChat ? (
            <>
              <Box
                sx={{
                  p: 2,
                  borderBottom: '1px solid #eee',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {isMobile ? (
                    <IconButton onClick={() => navigate('/messages')} disabled={isSending}>
                      <ArrowBack />
                    </IconButton>
                  ) : null}
                <Box sx={{ position: 'relative', m: 2 }}>
                  <Avatar
                    src={getApiImageUrl(selectedChat.user1.avatarUrl)}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Avatar
                    src={getApiImageUrl(selectedChat.user2.avatarUrl)}
                    sx={{
                      width: 40,
                      height: 40,
                      position: 'absolute',
                      top: 20,
                      left: 20,
                      border: '2px solid white',
                    }}
                  />
                </Box>
                <Typography variant="subtitle1">
                  {selectedChat.user1.name} & {selectedChat.user2.name}
                </Typography>
              </Box>

              <Box
                ref={messagesContainerRef}
                onScroll={handleScroll}
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  p: 2,
                  minHeight: 0, // Important for flex container scrolling
                  maxHeight: 'calc(100vh - 200px)', // Adjust based on header/footer height
                  position: 'relative',
                  '&::-webkit-scrollbar': { width: '6px' },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#673ab7',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                {Object.entries(groupMessagesByDate(selectedChat.messages || [])).map(
                  ([date, messages]) => (
                    <div key={date}>
                      <Divider sx={{ my: 2 }}>
                        <Typography variant="caption" color="textSecondary">
                          {date}
                        </Typography>
                      </Divider>
                      {(messages as any[]).map((msg: any) => (
                        <Box
                          key={msg.id}
                          sx={{
                            display: 'flex',
                            justifyContent:
                              msg.senderId === userID
                                ? 'flex-end'
                                : 'flex-start',
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              maxWidth: '70%',
                              flexDirection:
                                msg.senderId === userID ? 'row-reverse' : 'row',
                            }}
                          >
                            <Avatar
                              src={
                                msg.senderId === userID
                                  ? getApiImageUrl(selectedChat.user1.avatarUrl)
                                  : getApiImageUrl(selectedChat.user2.avatarUrl)
                              }
                              sx={{ mx: 1 }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {msg.senderId !== userID && (
                                <IconButton
                                  size="small"
                                  onClick={(event) => handleReactionClick(event, msg.id)}
                                  sx={{ mr: 0.5 }}
                                  disabled={isReacting}
                                >
                                  <EmojiEmotionsIcon fontSize="small" />
                                </IconButton>
                              )}
                              <Box>
                                <Typography
                                  sx={{
                                    p: 2,
                                    borderRadius: '15px',
                                    backgroundColor:
                                      msg.senderId === userID ? '#673ab7' : '#fff',
                                    color:
                                      msg.senderId === userID
                                        ? 'white'
                                        : 'text.primary',
                                    boxShadow: 1,
                                  }}
                                >
                                  {msg.content}
                                </Typography>
                                {/* Display reactions if they exist */}
                                {(msg.Reactions && msg.Reactions.length > 0) && (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      mt: 0.5,
                                      gap: 0.5,
                                    }}
                                  >
                                    {groupReactionsByType(msg.Reactions).map((groupedReaction) => {
                                      const reactionConfig = REACTIONS.find(r => r.type === groupedReaction.type);
                                      return (
                                        <Typography
                                          key={groupedReaction.type}
                                          sx={{
                                            fontSize: '0.8rem',
                                            backgroundColor: groupedReaction.hasCurrentUser 
                                              ? 'rgba(103, 58, 183, 0.2)' 
                                              : 'rgba(103, 58, 183, 0.1)',
                                            borderRadius: '10px',
                                            px: 1,
                                            py: 0.25,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            border: groupedReaction.hasCurrentUser 
                                              ? '1px solid rgba(103, 58, 183, 0.3)' 
                                              : 'none',
                                            '&:hover': {
                                              backgroundColor: 'rgba(103, 58, 183, 0.3)',
                                            },
                                          }}
                                          title={`${groupedReaction.count} ${groupedReaction.type} reaction${groupedReaction.count > 1 ? 's' : ''}${groupedReaction.hasCurrentUser ? ' (including you)' : ''}`}
                                        >
                                          {reactionConfig?.emoji || '👍'}
                                          <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                                            {groupedReaction.count}
                                          </span>
                                        </Typography>
                                      );
                                    })}
                                  </Box>
                                )}
                              </Box>
                              {msg.senderId === userID && (
                                <IconButton
                                  size="small"
                                  onClick={(event) => handleReactionClick(event, msg.id)}
                                  sx={{ ml: 0.5 }}
                                  disabled={isReacting}
                                >
                                  <EmojiEmotionsIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </div>
                  ),
                )}
                <div ref={messagesEndRef} />
                
                {/* Floating scroll to bottom button */}
                {showScrollButton && (
                  <Fab
                    size="small"
                    onClick={() => scrollToBottom('smooth')}
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      right: 16,
                      backgroundColor: '#673ab7',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#8561c5',
                      },
                    }}
                  >
                    <KeyboardArrowDownIcon />
                  </Fab>
                )}
              </Box>
            </>
          ) : (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}
            >
              <Typography variant="h6" color="textSecondary">
                Selecciona una conversación
              </Typography>
            </Box>
          )} 

          {/* Área de entrada de mensajes */}
           <Box
            sx={{
              p: 2,
              borderTop: '1px solid #eee',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <IconButton disabled={isSending}>
              {/* <CameraAltOutlinedIcon /> */}
            </IconButton>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Escribe un mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && !e.shiftKey && handleSend()
              }
              disabled={isSending}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '30px',
                  backgroundColor: '#f5f5f5',
                },
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={isSending}
              sx={{
                color: 'white',
                backgroundColor: '#673ab7',
                '&:hover': { backgroundColor: '#8561c5' },
              }}
            >
              {isSending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <SendIcon />
              )}
            </IconButton>
          </Box>

          {/* Reaction Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleReactionClose}
            PaperProps={{
              sx: {
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              },
            }}
          >
            <Box sx={{ display: 'flex', px: 1 }}>
              {REACTIONS.map((reaction) => (
                <MenuItem
                  key={reaction.type}
                  onClick={() => handleAddReaction(reaction.type, reaction.emoji)}
                  sx={{
                    fontSize: '1.5rem',
                    minWidth: 'auto',
                    px: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(103, 58, 183, 0.1)',
                    },
                  }}
                  title={reaction.type}
                >
                  {reaction.emoji}
                </MenuItem>
              ))}
            </Box>
          </Menu>
        </Grid>
  )
}

export default MessagesConversation;
