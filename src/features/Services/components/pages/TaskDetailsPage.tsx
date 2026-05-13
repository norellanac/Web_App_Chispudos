import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { UserLayout } from '../../../../components/templates/UserLayout';
import TaskDetailInput from '../organisms/TaskDetailInput';

export const TaskDetailsPage = () => {
  const location = useLocation();
  const { dateTime, service } = location.state || {};
  const [userText, setUserText] = useState('');

  if (!dateTime || !service) {
    return <div>No data available</div>;
  }

  const formattedDate = format(new Date(dateTime), 'EEEE - MMM dd, yyyy', {
    locale: es,
  });
  const formattedTime = format(new Date(dateTime), 'hh:mm a', { locale: es });


  return (
    <UserLayout>
      <Box>
        <TaskDetailInput
            date={formattedDate}
            time={formattedTime}
            dateTime={dateTime}
            service={service}
            userText={userText}
            setUserText={setUserText}
          />
      </Box>
    </UserLayout>
  );
};
