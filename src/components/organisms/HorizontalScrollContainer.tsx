import React, { ReactNode, useRef } from 'react';
import { Box, IconButton, BoxProps } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface HorizontalScrollProps extends BoxProps {
  children: ReactNode;
  title?: string | ReactNode;
  actionButton?: ReactNode;
  scrollAmount?: number;
  showArrows?: boolean;
  gap?: number;
}

const HorizontalScrollContainer: React.FC<HorizontalScrollProps> = ({
  children,
  title,
  actionButton,
  scrollAmount = 300,
  showArrows = true,
  sx,
  ...rest
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', width: '100%', ...sx }} {...rest}>
      {(title || actionButton) && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 5 }}>
          <Box>{title}</Box>
          {actionButton && <Box>{actionButton}</Box>}
        </Box>
      )}

      {showArrows && (
        <>
          <IconButton
            onClick={scrollLeft}
            sx={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              color: 'primary.main',
              zIndex: 2,
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
              boxShadow: 1,
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>

          <IconButton
            onClick={scrollRight}
            sx={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              color: 'primary.main',
              zIndex: 2,
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
              boxShadow: 1,
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </>
      )}

      <Box
        ref={scrollContainerRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          px: 2,  // Add padding on sides for better visibility with arrows
          py: 1,
          // This is important - creates a proper flex context for Grid items
          '& > .MuiGrid2-root': {
            flexShrink: 0,
            width: {
              xs: 'calc(80% - 16px)', // Full width minus padding on mobile
              sm: 'calc(50% - 16px)',  // Half width on small screens
              md: 'calc(33.333% - 16px)', // One-third on medium screens
              lg: 'calc(20% - 16px)'   // One-fourth on large screens
            },
            minWidth: {
              xs: '200px',
              sm: '240px'
            },
            maxWidth: '350px'
          }
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default HorizontalScrollContainer;