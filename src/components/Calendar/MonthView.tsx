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
import { MonthViewProps } from '@/components/Calendar/types';
import { weekDays } from '@/constants';
import { formatDate, formatMonth, getEventsForDay, getWeeksAtMonth } from '@/utils/dateUtils';

const MonthView = ({
  currentDate,
  holidays,
  setDate,
  filteredEvents,
  notifiedEvents,
}: MonthViewProps) => {
  const weeks = getWeeksAtMonth(currentDate);

  return (
    <Stack data-testid="month-view" spacing={4} sx={{ width: '100%' }}>
      <Typography variant="h5">{formatMonth(currentDate)}</Typography>
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
            {weeks.map((week, weekIndex) => (
              <TableRow key={weekIndex}>
                {week.map((day, dayIndex) => {
                  const dateString = day ? formatDate(currentDate, day) : '';
                  const holiday = holidays[dateString];

                  return (
                    <DayCell
                      key={dayIndex}
                      day={day}
                      dateString={dateString}
                      holiday={holiday}
                      onClick={() => setDate(dateString)}
                    >
                      {day && (
                        <>
                          {getEventsForDay(filteredEvents, day).map((event) => {
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
                        </>
                      )}
                    </DayCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default MonthView;
