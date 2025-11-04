import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import DayCell from '@/components/Calendar/DayCell';
import EventCard from '@/components/Calendar/EventCard';
import { WeekViewProps } from '@/components/Calendar/types';
import { weekDays } from '@/constants';
import { formatDate, formatWeek, getWeekDates } from '@/utils/dateUtils';

const WeekView = ({ currentDate, setDate, filteredEvents, notifiedEvents }: WeekViewProps) => {
  const weekDates = getWeekDates(currentDate);

  return (
    <Stack data-testid="week-view" spacing={4} sx={{ width: '100%' }}>
      <Typography variant="h5">{formatWeek(currentDate)}</Typography>
      <TableContainer>
        <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
          <TableHead>
            <TableRow>
              {weekDays.map((day) => (
                <TableCell key={day} sx={{ width: '14.28%', padding: 1, textAlign: 'center' }}>
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {weekDates.map((date) => {
                const dateString = formatDate(date, date.getDate());

                return (
                  <DayCell
                    key={date.toISOString()}
                    day={date.getDate()}
                    dateString={dateString}
                    onClick={() => setDate(dateString)}
                  >
                    {filteredEvents
                      .filter(
                        (event) => new Date(event.date).toDateString() === date.toDateString()
                      )
                      .map((event) => {
                        const isNotified = notifiedEvents.includes(event.id);
                        const isRepeating = event.repeat.type !== 'none';

                        return (
                          <EventCard
                            key={event.id}
                            event={event}
                            isNotified={isNotified}
                            isRepeating={isRepeating}
                          />
                        );
                      })}
                  </DayCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default WeekView;
